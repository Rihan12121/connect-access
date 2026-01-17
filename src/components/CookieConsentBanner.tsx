import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Cookie, Shield, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsentBanner = () => {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent-given');
    if (!accepted) {
      // Slight delay to avoid layout shift on load
      const timer = setTimeout(() => setShowBanner(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-preferences', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-given', 'true');
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('cookie-preferences', JSON.stringify(essentialOnly));
    localStorage.setItem('cookie-consent-given', 'true');
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-given', 'true');
    setShowSettings(false);
    setShowBanner(false);
  };

  const openSettings = () => {
    // Load saved preferences if any
    const saved = localStorage.getItem('cookie-preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        // keep defaults
      }
    }
    setShowSettings(true);
  };

  // Function to reopen settings from footer
  useEffect(() => {
    const handleOpenCookieSettings = () => {
      const saved = localStorage.getItem('cookie-preferences');
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch {
          // keep defaults
        }
      }
      setShowSettings(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenCookieSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenCookieSettings);
  }, []);

  const cookieTypes = [
    {
      key: 'essential' as const,
      icon: Shield,
      title: language === 'de' ? 'Essentielle Cookies' : 'Essential Cookies',
      description: language === 'de' 
        ? 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.'
        : 'These cookies are required for basic website functionality and cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      title: language === 'de' ? 'Analyse-Cookies' : 'Analytics Cookies',
      description: language === 'de'
        ? 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.'
        : 'These cookies help us understand how visitors interact with our website.',
      required: false,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      title: language === 'de' ? 'Marketing-Cookies' : 'Marketing Cookies',
      description: language === 'de'
        ? 'Diese Cookies werden verwendet, um Werbung relevanter für Sie zu gestalten.'
        : 'These cookies are used to make advertising more relevant to you.',
      required: false,
    },
  ];

  // Don't render anything if consent was already given and settings modal is closed
  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner (non-blocking) */}
      {showBanner && !showSettings && (
        <div className="fixed inset-x-0 bottom-0 z-[60] p-3 md:p-4">
          <div className="mx-auto w-full max-w-5xl">
            <div className="bg-card border border-border rounded-2xl shadow-elevated p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Cookie className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {language === 'de'
                        ? 'Wir verwenden Cookies für Funktionen, Analyse und Marketing. Sie können Ihre Auswahl jederzeit ändern.'
                        : 'We use cookies for functionality, analytics and marketing. You can change your choice anytime.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 md:w-[420px]">
                  <Button
                    variant="outline"
                    onClick={openSettings}
                    className="w-full"
                  >
                    {language === 'de' ? 'Anpassen' : 'Customize'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                    className="w-full"
                  >
                    {language === 'de' ? 'Ablehnen' : 'Reject'}
                  </Button>
                  <Button onClick={handleAcceptAll} className="w-full">
                    {language === 'de' ? 'Akzeptieren' : 'Accept'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary" />
              {language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {cookieTypes.map(({ key, icon: Icon, title, description, required }) => (
              <div key={key} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-medium text-foreground">{title}</h4>
                    <Switch
                      checked={preferences[key]}
                      onCheckedChange={(checked) => {
                        if (!required) {
                          setPreferences(prev => ({ ...prev, [key]: checked }));
                        }
                      }}
                      disabled={required}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  {required && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {language === 'de' ? 'Immer aktiv' : 'Always active'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRejectAll} className="flex-1">
              {language === 'de' ? 'Alle ablehnen' : 'Reject All'}
            </Button>
            <Button onClick={handleSavePreferences} className="flex-1">
              {language === 'de' ? 'Auswahl speichern' : 'Save Selection'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;
