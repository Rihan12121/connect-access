import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  Bell, 
  Check,
  Share,
  PlusSquare,
  ArrowDown
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPage = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(checkStandalone);
    
    // Check for iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    {
      icon: Wifi,
      title: language === 'de' ? 'Offline verfügbar' : 'Works Offline',
      description: language === 'de' 
        ? 'Nutze die App auch ohne Internetverbindung'
        : 'Use the app even without internet connection',
    },
    {
      icon: Bell,
      title: language === 'de' ? 'Push-Benachrichtigungen' : 'Push Notifications',
      description: language === 'de'
        ? 'Erhalte Benachrichtigungen zu Angeboten und Bestellungen'
        : 'Get notified about deals and orders',
    },
    {
      icon: Smartphone,
      title: language === 'de' ? 'Native App-Erlebnis' : 'Native App Experience',
      description: language === 'de'
        ? 'Schnell, flüssig und direkt vom Homescreen'
        : 'Fast, smooth and right from your home screen',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={language === 'de' ? 'App Installieren' : 'Install App'}
        description={language === 'de' 
          ? 'Installiere die Noor App auf deinem Gerät'
          : 'Install the Noor app on your device'
        }
      />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Download className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {language === 'de' ? 'Noor App installieren' : 'Install Noor App'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'de'
              ? 'Installiere unsere App für das beste Einkaufserlebnis. Schneller Zugriff, Offline-Support und Push-Benachrichtigungen.'
              : 'Install our app for the best shopping experience. Quick access, offline support and push notifications.'
            }
          </p>
        </div>

        {/* Status Card */}
        {isStandalone || isInstalled ? (
        <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">
                  {language === 'de' ? 'App bereits installiert!' : 'App already installed!'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'de'
                    ? 'Du nutzt bereits die installierte Version der App.'
                    : 'You are already using the installed version of the app.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-primary/50">
            <CardHeader className="text-center">
              <CardTitle>
                {language === 'de' ? 'Jetzt installieren' : 'Install Now'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Füge Noor zu deinem Homescreen hinzu'
                  : 'Add Noor to your home screen'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deferredPrompt ? (
                <Button onClick={handleInstall} size="lg" className="w-full">
                  <Download className="w-5 h-5 mr-2" />
                  {language === 'de' ? 'App installieren' : 'Install App'}
                </Button>
              ) : isIOS ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {language === 'de' ? 'Auf iOS:' : 'On iOS:'}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div className="flex items-center gap-2">
                        <Share className="w-5 h-5" />
                        <span>{language === 'de' ? 'Tippe auf "Teilen"' : 'Tap "Share"'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div className="flex items-center gap-2">
                        <PlusSquare className="w-5 h-5" />
                        <span>{language === 'de' ? '"Zum Home-Bildschirm"' : '"Add to Home Screen"'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>{language === 'de' ? 'Bestätigen' : 'Confirm'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <ArrowDown className="w-8 h-8 mx-auto text-muted-foreground animate-bounce" />
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Öffne das Browser-Menü und wähle "Zum Startbildschirm hinzufügen" oder "App installieren".'
                      : 'Open the browser menu and select "Add to Home Screen" or "Install App".'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InstallPage;