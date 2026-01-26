import { useState, useEffect } from 'react';
import { Receipt, Globe, Percent, Check, Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TaxSetting {
  id: string;
  country_code: string;
  country_name: string;
  vat_rate: number;
  is_eu_member: boolean;
  oss_applicable: boolean;
  threshold_amount: number;
  is_active: boolean;
}

const AdminTaxSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<TaxSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTax, setEditingTax] = useState<TaxSetting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    country_code: '',
    country_name: '',
    vat_rate: 19,
    is_eu_member: true,
    oss_applicable: true,
    threshold_amount: 10000,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('tax_settings')
        .select('*')
        .order('country_name');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching tax settings:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTax) {
        const { error } = await supabase
          .from('tax_settings')
          .update(formData)
          .eq('id', editingTax.id);
        if (error) throw error;
        toast.success(language === 'de' ? 'Steuersatz aktualisiert' : 'Tax rate updated');
      } else {
        const { error } = await supabase
          .from('tax_settings')
          .insert([formData]);
        if (error) throw error;
        toast.success(language === 'de' ? 'Steuersatz hinzugefügt' : 'Tax rate added');
      }
      setIsDialogOpen(false);
      setEditingTax(null);
      resetForm();
      fetchSettings();
    } catch (error) {
      console.error('Error saving tax setting:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    }
  };

  const toggleActive = async (setting: TaxSetting) => {
    try {
      const { error } = await supabase
        .from('tax_settings')
        .update({ is_active: !setting.is_active })
        .eq('id', setting.id);
      if (error) throw error;
      fetchSettings();
    } catch (error) {
      console.error('Error toggling tax setting:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      country_code: '',
      country_name: '',
      vat_rate: 19,
      is_eu_member: true,
      oss_applicable: true,
      threshold_amount: 10000,
    });
  };

  const openEditDialog = (setting: TaxSetting) => {
    setEditingTax(setting);
    setFormData({
      country_code: setting.country_code,
      country_name: setting.country_name,
      vat_rate: setting.vat_rate,
      is_eu_member: setting.is_eu_member,
      oss_applicable: setting.oss_applicable,
      threshold_amount: setting.threshold_amount,
    });
    setIsDialogOpen(true);
  };

  const euCountries = settings.filter(s => s.is_eu_member);
  const nonEuCountries = settings.filter(s => !s.is_eu_member);

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Steuereinstellungen' : 'Tax Settings'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'de' ? 'Steuereinstellungen' : 'Tax Settings'}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'de' ? 'EU-OSS & Internationale Steuersätze' : 'EU-OSS & International Tax Rates'}
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setEditingTax(null); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Land hinzufügen' : 'Add Country'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTax 
                      ? (language === 'de' ? 'Steuersatz bearbeiten' : 'Edit Tax Rate')
                      : (language === 'de' ? 'Neuen Steuersatz' : 'New Tax Rate')}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'de' ? 'Ländercode' : 'Country Code'}</Label>
                      <Input
                        value={formData.country_code}
                        onChange={(e) => setFormData({...formData, country_code: e.target.value.toUpperCase()})}
                        placeholder="DE"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <Label>{language === 'de' ? 'Landname' : 'Country Name'}</Label>
                      <Input
                        value={formData.country_name}
                        onChange={(e) => setFormData({...formData, country_name: e.target.value})}
                        placeholder="Deutschland"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'de' ? 'MwSt.-Satz (%)' : 'VAT Rate (%)'}</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.vat_rate}
                        onChange={(e) => setFormData({...formData, vat_rate: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <Label>{language === 'de' ? 'Schwellenwert (€)' : 'Threshold (€)'}</Label>
                      <Input
                        type="number"
                        value={formData.threshold_amount}
                        onChange={(e) => setFormData({...formData, threshold_amount: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{language === 'de' ? 'EU-Mitglied' : 'EU Member'}</Label>
                    <Switch
                      checked={formData.is_eu_member}
                      onCheckedChange={(checked) => setFormData({...formData, is_eu_member: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{language === 'de' ? 'OSS anwendbar' : 'OSS Applicable'}</Label>
                    <Switch
                      checked={formData.oss_applicable}
                      onCheckedChange={(checked) => setFormData({...formData, oss_applicable: checked})}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingTax 
                      ? (language === 'de' ? 'Aktualisieren' : 'Update')
                      : (language === 'de' ? 'Hinzufügen' : 'Add')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* EU-OSS Info */}
          <Card className="mb-8 border-green-200 bg-green-50/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    {language === 'de' ? 'EU One-Stop-Shop (OSS)' : 'EU One-Stop-Shop (OSS)'}
                  </h3>
                  <p className="text-sm text-green-700">
                    {language === 'de' 
                      ? 'Die Steuersätze werden automatisch basierend auf dem Lieferland des Kunden angewendet.'
                      : 'Tax rates are automatically applied based on the customer\'s delivery country.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* EU Countries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {language === 'de' ? 'EU-Länder' : 'EU Countries'}
                    <Badge variant="secondary">{euCountries.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'de' ? 'Land' : 'Country'}</TableHead>
                      <TableHead>{language === 'de' ? 'Code' : 'Code'}</TableHead>
                      <TableHead>{language === 'de' ? 'MwSt.' : 'VAT'}</TableHead>
                      <TableHead>OSS</TableHead>
                      <TableHead>{language === 'de' ? 'Aktiv' : 'Active'}</TableHead>
                      <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {euCountries.map((setting) => (
                      <TableRow key={setting.id}>
                        <TableCell className="font-medium">{setting.country_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{setting.country_code}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{setting.vat_rate}%</span>
                        </TableCell>
                        <TableCell>
                          {setting.oss_applicable ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={setting.is_active}
                            onCheckedChange={() => toggleActive(setting)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(setting)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Non-EU Countries */}
              {nonEuCountries.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {language === 'de' ? 'Nicht-EU-Länder' : 'Non-EU Countries'}
                      <Badge variant="secondary">{nonEuCountries.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'de' ? 'Land' : 'Country'}</TableHead>
                        <TableHead>{language === 'de' ? 'Code' : 'Code'}</TableHead>
                        <TableHead>{language === 'de' ? 'MwSt.' : 'VAT'}</TableHead>
                        <TableHead>{language === 'de' ? 'Aktiv' : 'Active'}</TableHead>
                        <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nonEuCountries.map((setting) => (
                        <TableRow key={setting.id}>
                          <TableCell className="font-medium">{setting.country_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{setting.country_code}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono">{setting.vat_rate}%</span>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={setting.is_active}
                              onCheckedChange={() => toggleActive(setting)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditDialog(setting)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
};

export default AdminTaxSettings;
