import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Key for local storage
const CONSENT_KEY = 'gdpr_consent_status';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null); // 'accepted', 'rejected', or null

  useEffect(() => {
    const status = localStorage.getItem(CONSENT_KEY);
    if (status) {
      setConsentStatus(status);
      // If status is set, hide the banner
    } else {
      // If no status, show the banner
      setShowBanner(true);
    }
  }, []);

  // Effect to handle script loading based on consent (Placeholder for real implementation)
  useEffect(() => {
    // THIS IS THE CRITICAL PART FOR GDPR/TTDSG COMPLIANCE:
    // In a real implementation, this logic would manage the loading of
    // third-party scripts (like Google Analytics, Facebook Pixel, etc.).
    // Scripts should ONLY load if consentStatus is 'accepted'.
    if (consentStatus === 'accepted') {
      console.log('CONSENT GRANTED: Third-party scripts (e.g., Analytics) can now be loaded.');
      // Example: Load Analytics script here
    } else if (consentStatus === 'rejected') {
      console.log('CONSENT REJECTED: Third-party scripts remain blocked.');
    } else {
      console.log('NO CONSENT YET: Third-party scripts are blocked by default.');
    }
  }, [consentStatus]);

  const handleConsent = (status) => {
    localStorage.setItem(CONSENT_KEY, status);
    setConsentStatus(status);
    setShowBanner(false);
  };

  const bannerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { y: 100, opacity: 0 },
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[100] bg-white shadow-2xl border-t-4 border-manus-blue-500 p-4"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-manus-gray-700 mb-4 md:mb-0">
              <h3 id="cookie-consent-title" className="font-bold text-manus-blue-700 mb-1">Datenschutz-Einstellungen</h3>
              <p>Wir nutzen Cookies und ähnliche Technologien zur Analyse der Website-Nutzung und zur Verbesserung Ihres Erlebnisses. Einige sind essenziell, andere helfen uns, unsere Dienste zu optimieren. Ihre Zustimmung ist freiwillig und kann jederzeit widerrufen werden.</p>
              <a href="#" className="text-manus-blue-500 hover:underline font-medium mt-1 inline-block">Datenschutzerklärung (Placeholder)</a>
            </div>

            <div className="flex space-x-3 flex-shrink-0">
              <button
                onClick={() => handleConsent('rejected')}
                className="px-4 py-2 text-sm font-medium rounded-lg text-manus-gray-700 border border-manus-gray-300 hover:bg-manus-gray-100 transition duration-150"
              >
                Ablehnen
              </button>
              <button
                onClick={() => handleConsent('accepted')}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-manus-success-500 hover:bg-manus-success-600 transition duration-150"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
