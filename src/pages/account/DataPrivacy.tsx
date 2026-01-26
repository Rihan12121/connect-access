import { useState } from 'react';
import { Shield, Download, Trash2, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DataPrivacy = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [requestingDeletion, setRequestingDeletion] = useState(false);

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);

    try {
      // Collect all user data
      const [profileRes, ordersRes, reviewsRes, wishlistRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id),
        supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id),
        supabase.from('reviews').select('*').eq('user_id', user.id),
        supabase.from('wishlists').select('*').eq('user_id', user.id),
      ]);

      const userData = {
        user_id: user.id,
        email: user.email,
        profile: profileRes.data?.[0] || null,
        orders: ordersRes.data || [],
        reviews: reviewsRes.data || [],
        wishlist: wishlistRes.data || [],
        exported_at: new Date().toISOString(),
        gdpr_compliant: true,
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meine_daten_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(language === 'de' ? 'Daten erfolgreich exportiert!' : 'Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error(language === 'de' ? 'Fehler beim Export' : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!user) return;
    setRequestingDeletion(true);

    try {
      const { error } = await supabase.from('gdpr_requests').insert({
        user_id: user.id,
        request_type: 'deletion',
        status: 'pending',
      });

      if (error) throw error;

      toast.success(
        language === 'de' 
          ? 'Löschungsanfrage eingereicht. Wir bearbeiten Ihre Anfrage innerhalb von 30 Tagen.'
          : 'Deletion request submitted. We will process your request within 30 days.'
      );
    } catch (error) {
      console.error('Error requesting deletion:', error);
      toast.error(language === 'de' ? 'Fehler beim Einreichen' : 'Error submitting request');
    } finally {
      setRequestingDeletion(false);
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              {language === 'de' ? 'Bitte melden Sie sich an.' : 'Please log in.'}
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Datenschutz & Meine Daten' : 'Privacy & My Data'}
        description={language === 'de' ? 'DSGVO-konforme Datenverwaltung' : 'GDPR-compliant data management'}
      />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Datenschutz & Meine Daten' : 'Privacy & My Data'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'de' ? 'DSGVO-konforme Verwaltung Ihrer Daten' : 'GDPR-compliant management of your data'}
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Export Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {language === 'de' ? 'Meine Daten exportieren' : 'Export My Data'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Laden Sie eine vollständige Kopie aller Ihrer gespeicherten Daten herunter (Art. 15 DSGVO).'
                    : 'Download a complete copy of all your stored data (GDPR Art. 15).'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    {language === 'de' 
                      ? 'Enthält: Profil, Bestellungen, Bewertungen, Wunschliste'
                      : 'Includes: Profile, Orders, Reviews, Wishlist'}
                  </div>
                  <Button onClick={handleExportData} disabled={exporting}>
                    {exporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {language === 'de' ? 'Daten exportieren' : 'Export Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delete Data */}
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  {language === 'de' ? 'Konto & Daten löschen' : 'Delete Account & Data'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Fordern Sie die vollständige Löschung Ihres Kontos und aller damit verbundenen Daten an (Art. 17 DSGVO).'
                    : 'Request complete deletion of your account and all associated data (GDPR Art. 17).'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive">
                        {language === 'de' ? 'Warnung: Diese Aktion ist endgültig!' : 'Warning: This action is permanent!'}
                      </p>
                      <p className="text-muted-foreground mt-1">
                        {language === 'de' 
                          ? 'Nach der Löschung können Ihre Daten nicht wiederhergestellt werden. Bestellhistorie und Rechnungen werden gemäß gesetzlicher Aufbewahrungsfristen archiviert.'
                          : 'After deletion, your data cannot be recovered. Order history and invoices will be archived according to legal retention periods.'}
                      </p>
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={requestingDeletion}>
                      {requestingDeletion ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      {language === 'de' ? 'Löschung beantragen' : 'Request Deletion'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {language === 'de' ? 'Sind Sie sicher?' : 'Are you sure?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {language === 'de' 
                          ? 'Durch diese Anfrage wird Ihr Konto und alle zugehörigen Daten innerhalb von 30 Tagen unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.'
                          : 'This request will permanently delete your account and all associated data within 30 days. This action cannot be undone.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {language === 'de' ? 'Abbrechen' : 'Cancel'}
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleRequestDeletion}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {language === 'de' ? 'Ja, Löschung beantragen' : 'Yes, Request Deletion'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Ihre Rechte nach DSGVO' : 'Your GDPR Rights'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{language === 'de' ? 'Auskunftsrecht' : 'Right of Access'}</p>
                      <p className="text-sm text-muted-foreground">Art. 15 DSGVO</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{language === 'de' ? 'Recht auf Berichtigung' : 'Right to Rectification'}</p>
                      <p className="text-sm text-muted-foreground">Art. 16 DSGVO</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{language === 'de' ? 'Recht auf Löschung' : 'Right to Erasure'}</p>
                      <p className="text-sm text-muted-foreground">Art. 17 DSGVO</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{language === 'de' ? 'Recht auf Datenübertragbarkeit' : 'Right to Data Portability'}</p>
                      <p className="text-sm text-muted-foreground">Art. 20 DSGVO</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DataPrivacy;
