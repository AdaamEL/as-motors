const COOKIE_KEY = "cookieConsent";
const GA_COOKIE_FLAG = "ga-disable";
const TRACKING_STORAGE_KEY = "as_tracking_events";
const MAX_LOCAL_EVENTS = 3000;

const getMeasurementId = () => process.env.REACT_APP_GA_MEASUREMENT_ID || "";

const getStoredConsent = () => {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const isAnalyticsAllowed = () => {
  const consent = getStoredConsent();
  return Boolean(consent?.prefs?.analytics);
};

const readLocalEvents = () => {
  try {
    const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalEvents = (events) => {
  try {
    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(events.slice(-MAX_LOCAL_EVENTS)));
  } catch {
    // Ignore quota/storage errors to avoid impacting UX.
  }
};

const addLocalEvent = (event, requiresAnalyticsConsent = true) => {
  if (requiresAnalyticsConsent && !isAnalyticsAllowed()) return;
  const events = readLocalEvents();
  events.push({
    ...event,
    ts: new Date().toISOString(),
  });
  writeLocalEvents(events);
};

export const recordConsentDecision = (value, prefs) => {
  addLocalEvent(
    {
      type: "consent",
      value,
      analytics: Boolean(prefs?.analytics),
    },
    false
  );
};

const setGaDisabled = (disabled) => {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === "undefined") return;
  window[`${GA_COOKIE_FLAG}-${measurementId}`] = disabled;
};

const injectGaScript = (measurementId) => {
  const existing = document.querySelector(`script[data-ga='${measurementId}']`);
  if (existing) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.ga = measurementId;
  document.head.appendChild(script);
};

const initGa = (measurementId) => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    send_page_view: false,
  });
};

export const initAnalyticsIfAllowed = () => {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === "undefined") return false;

  const allowed = isAnalyticsAllowed();
  setGaDisabled(!allowed);

  if (!allowed) return false;

  injectGaScript(measurementId);
  initGa(measurementId);
  return true;
};

export const trackPageView = (path) => {
  const measurementId = getMeasurementId();
  if (typeof window === "undefined") return;

  addLocalEvent({
    type: "page_view",
    path,
  });

  if (!measurementId || !isAnalyticsAllowed() || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

export const clearLocalTrackingData = () => {
  try {
    localStorage.removeItem(TRACKING_STORAGE_KEY);
  } catch {
    // no-op
  }
};

export const getLocalTrackingDashboard = (days = 14) => {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 14;
  const events = readLocalEvents();
  const now = Date.now();
  const windowStart = now - safeDays * 24 * 60 * 60 * 1000;
  const recentEvents = events.filter((event) => {
    const ts = new Date(event.ts || "").getTime();
    return Number.isFinite(ts) && ts >= windowStart;
  });

  const pageViews = recentEvents.filter((event) => event.type === "page_view");
  const consents = recentEvents.filter((event) => event.type === "consent");

  const topPagesMap = pageViews.reduce((acc, event) => {
    const key = event.path || "/";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const topPages = Object.entries(topPagesMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const dailyViewsMap = {};
  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    dailyViewsMap[key] = 0;
  }

  pageViews.forEach((event) => {
    const key = new Date(event.ts).toISOString().slice(0, 10);
    if (key in dailyViewsMap) dailyViewsMap[key] += 1;
  });

  const dailyViews = Object.entries(dailyViewsMap).map(([date, count]) => ({
    date,
    label: new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }),
    count,
  }));

  const accepted = consents.filter((event) => event.analytics === true).length;
  const refused = consents.filter((event) => event.analytics === false).length;

  return {
    windowDays: safeDays,
    totalPageViews: pageViews.length,
    uniquePages: new Set(pageViews.map((event) => event.path || "/")).size,
    consentAccepted: accepted,
    consentRefused: refused,
    topPages,
    dailyViews,
    lastUpdate: new Date().toISOString(),
  };
};
