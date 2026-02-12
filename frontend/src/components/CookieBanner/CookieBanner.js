import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COOKIE_KEY = "cookieConsent";

const CookieBanner = () => {
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

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Cookies & confidentialité</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Nous utilisons des cookies essentiels au fonctionnement du site. Les cookies d’analyse sont optionnels.
              <Link to="/legal/cookies" className="text-brand dark:text-gold hover:underline ml-1">En savoir plus</Link>
            </p>

            {showSettings && (
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Cookies essentiels</p>
                    <p>Indispensables au fonctionnement et à la sécurité.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Cookies d’analyse</p>
                    <p>Nous aident à améliorer l’expérience utilisateur.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {!showSettings ? (
              <>
                <button
                  onClick={() => saveConsent("all", { essential: true, analytics: true })}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6B1E1E, #8B2E2E)" }}
                >
                  Tout accepter
                </button>
                <button
                  onClick={() => saveConsent("essential", { essential: true, analytics: false })}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  Essentiels uniquement
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold"
                >
                  Personnaliser
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => saveConsent(prefs.analytics ? "all" : "essential", { essential: true, analytics: prefs.analytics })}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6B1E1E, #8B2E2E)" }}
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold"
                >
                  Retour
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;