import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COOKIE_KEY = "cookieConsent";

const CookieBanner = ({ discrete = false }) => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState({ essential: true, analytics: false });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      setVisible(true);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.prefs) setPrefs(parsed.prefs);
    } catch {
      setVisible(true);
    }
  }, []);

  const saveConsent = (value, nextPrefs) => {
    const payload = {
      value,
      prefs: nextPrefs,
      date: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(payload));
    setPrefs(nextPrefs);
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  if (discrete) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 sm:max-w-md">
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed text-[var(--color-text)]">
                Nous utilisons des cookies essentiels.{" "}
                <Link to="/legal/cookies" className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand)]/80 underline underline-offset-2">
                  En savoir plus
                </Link>
              </p>
            </div>
            <div className="flex gap-2 ml-2 flex-shrink-0 pt-0.5">
              <button
                onClick={() => saveConsent("all", { essential: true, analytics: true })}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:text-white/85 transition-colors"
                style={{ backgroundColor: "var(--color-brand)" }}
              >
                OK
              </button>
              <button
                onClick={() => saveConsent("essential", { essential: true, analytics: false })}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Refuser
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular version for other pages
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Cookies & confidentialité</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Nous utilisons des cookies essentiels au fonctionnement du site. Les cookies d'analyse sont optionnels.
              <Link to="/legal/cookies" className="text-[var(--color-brand)] hover:underline ml-1">En savoir plus</Link>
            </p>

            {showSettings && (
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)]"
                    style={{ accentColor: "var(--color-brand)" }}
                  />
                  <div>
                    <p className="font-medium text-[var(--color-text)]">Cookies essentiels</p>
                    <p>Indispensables au fonctionnement et à la sécurité.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)]"
                    style={{ accentColor: "var(--color-brand)" }}
                  />
                  <div>
                    <p className="font-medium text-[var(--color-text)]">Cookies d'analyse</p>
                    <p>Nous aident à améliorer l’expérience utilisateur.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {!showSettings ? (
              <div className="space-y-2">
                <button
                  onClick={() => saveConsent("all", { essential: true, analytics: true })}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white w-full sm:w-auto"
                  style={{ backgroundColor: "var(--color-brand)" }}
                >
                  Tout accepter
                </button>
                <button
                  onClick={() => saveConsent("essential", { essential: true, analytics: false })}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--color-border)] text-[var(--color-text-muted)] w-full sm:w-auto"
                >
                  Essentiels uniquement
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-brand)] w-full sm:w-auto"
                >
                  Personnaliser
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => saveConsent(prefs.analytics ? "all" : "essential", { essential: true, analytics: prefs.analytics })}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white w-full sm:w-auto"
                  style={{ backgroundColor: "var(--color-brand)" }}
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-brand)] w-full sm:w-auto"
                >
                  Retour
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;