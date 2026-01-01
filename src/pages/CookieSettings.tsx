import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Cookie, Shield, BarChart3, Target } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieSettings = () => {
  const { language } = useLanguage();
  
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    const saved = localStorage.getItem('cookie-preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { essential: true, analytics: false, marketing: false };
      }
    }
    const accepted = localStorage.getItem('welcome-accepted');
    const essentialOnly = localStorage.getItem('cookie-essential-only');
    return {
      essential: true,
      analytics: accepted === 'true' && essentialOnly !== 'true',
      marketing: accepted === 'true' && essentialOnly !== 'true',
    };
  });

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    localStorage.setItem('welcome-accepted', 'true');
    localStorage.setItem('cookie-essential-only', (!preferences.analytics && !preferences.marketing).toString());
    toast.success(language === 'de' ? 'Einstellungen gespeichert' : 'Settings saved');
  };

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-preferences', JSON.stringify(allAccepted));
    localStorage.setItem('welcome-accepted', 'true');
    localStorage.setItem('cookie-essential-only', 'false');
    toast.success(language === 'de' ? 'Alle Cookies akzeptiert' : 'All cookies accepted');
  };

  const handleRejectAll = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    setPreferences(essentialOnly);
    localStorage.setItem('cookie-preferences', JSON.stringify(essentialOnly));
    localStorage.setItem('welcome-accepted', 'true');
    localStorage.setItem('cookie-essential-only', 'true');
    toast.success(language === 'de' ? 'Nur essentielle Cookies aktiviert' : 'Only essential cookies enabled');
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Cookie className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
          </h1>
        </div>

        <p className="text-muted-foreground mb-8">
          {language === 'de'
            ? 'Hier können Sie Ihre Cookie-Präferenzen verwalten. Essentielle Cookies sind für die Funktion der Website notwendig und können nicht deaktiviert werden.'
            : 'Here you can manage your cookie preferences. Essential cookies are necessary for the website to function and cannot be disabled.'}
        </p>

        <div className="space-y-4 mb-8">
          {cookieTypes.map(({ key, icon: Icon, title, description, required }) => (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </div>
                  <Switch
                    checked={preferences[key]}
                    onCheckedChange={() => handleToggle(key)}
                    disabled={required}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
                {required && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {language === 'de' ? 'Immer aktiv' : 'Always active'}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRejectAll} variant="outline" className="flex-1">
            {language === 'de' ? 'Alle ablehnen' : 'Reject All'}
          </Button>
          <Button onClick={handleSave} variant="outline" className="flex-1">
            {language === 'de' ? 'Auswahl speichern' : 'Save Selection'}
          </Button>
          <Button onClick={handleAcceptAll} className="flex-1">
            {language === 'de' ? 'Alle akzeptieren' : 'Accept All'}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookieSettings;
