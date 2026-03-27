const https = require("https");
const { JWT } = require("google-auth-library");

const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

const getGaCredentials = () => {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GA4_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKeyRaw) {
    return null;
  }

  return {
    propertyId,
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, "\n"),
  };
};

const postJson = (url, token, body) =>
  new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const request = https.request(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let raw = "";
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          const isOk = response.statusCode >= 200 && response.statusCode < 300;
          try {
            const parsed = raw ? JSON.parse(raw) : {};
            if (!isOk) {
              return reject(new Error(parsed?.error?.message || "Erreur Analytics Data API"));
            }
            resolve(parsed);
          } catch (error) {
            reject(new Error("Reponse Analytics invalide"));
          }
        });
      }
    );

    request.on("error", reject);
    request.write(payload);
    request.end();
  });

const getAuthToken = async (credentials) => {
  const client = new JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: [GA_SCOPE],
  });

  const authResult = await client.authorize();
  if (!authResult?.access_token) {
    throw new Error("Impossible d'obtenir un token Google Analytics");
  }
  return authResult.access_token;
};

const parseMetric = (row, index = 0) => Number(row?.metricValues?.[index]?.value || 0);
const parseDimension = (row, index = 0) => row?.dimensionValues?.[index]?.value || "";

const getRealtimeData = async (token, propertyId) => {
  const realtimeEndpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`;

  try {
    const [realtimeTotals, realtimeTopPages] = await Promise.all([
      postJson(realtimeEndpoint, token, {
        metrics: [{ name: "activeUsers" }],
      }),
      postJson(realtimeEndpoint, token, {
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 8,
      }),
    ]);

    const realtimeActiveUsers = parseMetric(realtimeTotals?.rows?.[0], 0);
    const realtimeTopPagesData = (realtimeTopPages?.rows || []).map((row) => ({
      path: parseDimension(row, 0) || "/",
      count: parseMetric(row, 0),
    }));

    return {
      realtimeActiveUsers,
      realtimeTopPages: realtimeTopPagesData,
    };
  } catch (error) {
    // Realtime API can be empty or temporarily unavailable; keep aggregated report working.
    return {
      realtimeActiveUsers: 0,
      realtimeTopPages: [],
    };
  }
};

const getTrackingOverview = async (req, res) => {
  try {
    const credentials = getGaCredentials();
    if (!credentials) {
      return res.status(400).json({
        message: "Configuration GA4 manquante. Definissez GA4_PROPERTY_ID, GA4_CLIENT_EMAIL et GA4_PRIVATE_KEY.",
      });
    }

    const daysParam = Number.parseInt(req.query.days, 10);
    const days = Number.isFinite(daysParam) && daysParam > 0 && daysParam <= 90 ? daysParam : 14;
    const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };
    const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${credentials.propertyId}:runReport`;

    const token = await getAuthToken(credentials);

    const [totals, daily, topPages, realtime] = await Promise.all([
      postJson(endpoint, token, {
        dateRanges: [dateRange],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      }),
      postJson(endpoint, token, {
        dateRanges: [dateRange],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      postJson(endpoint, token, {
        dateRanges: [dateRange],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      }),
      getRealtimeData(token, credentials.propertyId),
    ]);

    const totalPageViews = parseMetric(totals?.rows?.[0], 0);
    const activeUsers = parseMetric(totals?.rows?.[0], 1);

    const dailyViews = (daily?.rows || []).map((row) => {
      const rawDate = parseDimension(row, 0);
      const normalized = rawDate.length === 8
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : rawDate;

      return {
        date: normalized,
        label: normalized
          ? new Date(`${normalized}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
          : "-",
        count: parseMetric(row, 0),
      };
    });

    const topPagesData = (topPages?.rows || []).map((row) => ({
      path: parseDimension(row, 0) || "/",
      count: parseMetric(row, 0),
    }));

    return res.json({
      provider: "ga4",
      windowDays: days,
      totalPageViews,
      activeUsers,
      realtimeActiveUsers: realtime.realtimeActiveUsers,
      uniquePages: topPagesData.length,
      consentAccepted: null,
      consentRefused: null,
      topPages: topPagesData,
      realtimeTopPages: realtime.realtimeTopPages,
      dailyViews,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur analytics overview:", error.message);
    return res.status(500).json({ message: "Impossible de recuperer les donnees de tracking." });
  }
};

module.exports = {
  getTrackingOverview,
};
