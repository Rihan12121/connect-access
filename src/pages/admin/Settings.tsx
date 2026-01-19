import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  Settings as SettingsIcon,
  Loader2,
  Save,
  Image,
  Layout,
  Palette,
  Globe,
  Store,
  Upload
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  footer_text: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  maintenance_mode: boolean;
  newsletter_enabled: boolean;
  reviews_enabled: boolean;
}

const defaultSettings: SiteSettings = {
  site_name: 'Noor',
  site_description: 'Premium Marktplatz',
  contact_email: 'info@noor.de',
  contact_phone: '+49 123 456789',
  address: 'Berlin, Deutschland',
  logo_url: '',
  favicon_url: '',
  primary_color: '#6366f1',
  footer_text: '© 2025 Noor. Alle Rechte vorbehalten.',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  maintenance_mode: false,
  newsletter_enabled: true,
  reviews_enabled: true,
};

const AdminSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load from localStorage for now (can be extended to database)
    const stored = localStorage.getItem('siteSettings');
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        setSettings(defaultSettings);
      }
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    
    try {
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      toast.success(language === 'de' ? 'Einstellungen gespeichert' : 'Settings saved');
    } catch (error) {
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    }
    
    setSaving(false);
  };

  const updateSetting = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title={language === 'de' ? 'Einstellungen' : 'Settings'} />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Einstellungen' : 'Settings'}
              </h1>
            </div>
          </div>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {language === 'de' ? 'Speichern' : 'Save'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'de' ? 'Allgemein' : 'General'}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'de' ? 'Aussehen' : 'Appearance'}</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">
                {language === 'de' ? 'Shop-Informationen' : 'Shop Information'}
              </h3>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{language === 'de' ? 'Shop-Name' : 'Shop Name'}</Label>
                  <Input
                    value={settings.site_name}
                    onChange={(e) => updateSetting('site_name', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>{language === 'de' ? 'Beschreibung' : 'Description'}</Label>
                  <Textarea
                    value={settings.site_description}
                    onChange={(e) => updateSetting('site_description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>E-Mail</Label>
                    <Input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => updateSetting('contact_email', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{language === 'de' ? 'Telefon' : 'Phone'}</Label>
                    <Input
                      value={settings.contact_phone}
                      onChange={(e) => updateSetting('contact_phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>{language === 'de' ? 'Adresse' : 'Address'}</Label>
                  <Textarea
                    value={settings.address}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">
                {language === 'de' ? 'Branding' : 'Branding'}
              </h3>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Logo URL</Label>
                  <Input
                    value={settings.logo_url}
                    onChange={(e) => updateSetting('logo_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Favicon URL</Label>
                  <Input
                    value={settings.favicon_url}
                    onChange={(e) => updateSetting('favicon_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>{language === 'de' ? 'Primärfarbe' : 'Primary Color'}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>{language === 'de' ? 'Footer-Text' : 'Footer Text'}</Label>
                  <Input
                    value={settings.footer_text}
                    onChange={(e) => updateSetting('footer_text', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Social Media</h3>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Facebook</Label>
                  <Input
                    value={settings.social_facebook}
                    onChange={(e) => updateSetting('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Instagram</Label>
                  <Input
                    value={settings.social_instagram}
                    onChange={(e) => updateSetting('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Twitter/X</Label>
                  <Input
                    value={settings.social_twitter}
                    onChange={(e) => updateSetting('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="font-semibold text-lg mb-4">
                {language === 'de' ? 'Funktionen' : 'Features'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === 'de' ? 'Wartungsmodus' : 'Maintenance Mode'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Website für Besucher sperren' 
                        : 'Lock website for visitors'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Newsletter-Anmeldung aktivieren' 
                        : 'Enable newsletter signup'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.newsletter_enabled}
                    onCheckedChange={(checked) => updateSetting('newsletter_enabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === 'de' ? 'Bewertungen' : 'Reviews'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Kunden können Produkte bewerten' 
                        : 'Allow customers to review products'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.reviews_enabled}
                    onCheckedChange={(checked) => updateSetting('reviews_enabled', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminSettings;
