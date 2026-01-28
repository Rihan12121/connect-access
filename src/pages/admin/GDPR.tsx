import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Download, Trash2, Clock, Check, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import AdminGuard from '@/components/AdminGuard';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GDPRRequest {
  id: string;
  user_id: string;
  request_type: string;
  status: string;
  completed_at: string | null;
  download_url: string | null;
  expires_at: string | null;
  created_at: string;
}

const AdminGDPR = () => {
  const { language } = useLanguage();
  const [requests, setRequests] = useState<GDPRRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('gdpr_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching GDPR requests:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const processExportRequest = async (request: GDPRRequest) => {
    setProcessing(request.id);
    try {
      // Collect user data from all tables
      const userId = request.user_id;
      
      const [profileRes, ordersRes, reviewsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId),
        supabase.from('orders').select('*, order_items(*)').eq('user_id', userId),
        supabase.from('reviews').select('*').eq('user_id', userId),
      ]);

      const userData = {
        profile: profileRes.data?.[0] || null,
        orders: ordersRes.data || [],
        reviews: reviewsRes.data || [],
        exported_at: new Date().toISOString(),
      };

      // Create downloadable JSON
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_data_${userId.slice(0, 8)}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // Update request status
      await supabase
        .from('gdpr_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      toast.success(language === 'de' ? 'Daten exportiert' : 'Data exported');
      fetchRequests();
    } catch (error) {
      console.error('Error processing export:', error);
      toast.error(language === 'de' ? 'Fehler beim Export' : 'Error exporting');
    } finally {
      setProcessing(null);
    }
  };

  const processDeletionRequest = async (request: GDPRRequest) => {
    setProcessing(request.id);
    try {
      const userId = request.user_id;

      // Delete user data from all tables (cascade will handle related data)
      await Promise.all([
        supabase.from('reviews').delete().eq('user_id', userId),
        supabase.from('wishlists').delete().eq('user_id', userId),
        supabase.from('profiles').delete().eq('user_id', userId),
      ]);

      // Update request status
      await supabase
        .from('gdpr_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      toast.success(language === 'de' ? 'Daten gelöscht' : 'Data deleted');
      fetchRequests();
    } catch (error) {
      console.error('Error processing deletion:', error);
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" /> {language === 'de' ? 'Abgeschlossen' : 'Completed'}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> {language === 'de' ? 'Ausstehend' : 'Pending'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'export':
        return <Badge className="bg-blue-100 text-blue-800"><Download className="h-3 w-3 mr-1" /> Export</Badge>;
      case 'deletion':
        return <Badge className="bg-red-100 text-red-800"><Trash2 className="h-3 w-3 mr-1" /> {language === 'de' ? 'Löschung' : 'Deletion'}</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    exports: requests.filter(r => r.request_type === 'export').length,
    deletions: requests.filter(r => r.request_type === 'deletion').length,
  };

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'DSGVO-Anfragen' : 'GDPR Requests'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'DSGVO-Anfragen' : 'GDPR Requests'}
              </h1>
            </div>
          </div>

          {/* Info Card */}
          <Card className="mb-8 border-blue-200 bg-blue-50/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {language === 'de' ? 'DSGVO-Compliance' : 'GDPR Compliance'}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {language === 'de' 
                      ? 'Bearbeiten Sie alle Anfragen innerhalb von 30 Tagen gemäß DSGVO Art. 12.'
                      : 'Process all requests within 30 days as per GDPR Art. 12.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Gesamt' : 'Total'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ausstehend' : 'Pending'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Download className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.exports}</p>
                    <p className="text-sm text-muted-foreground">Exports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.deletions}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Löschungen' : 'Deletions'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {language === 'de' ? 'Keine DSGVO-Anfragen vorhanden' : 'No GDPR requests'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'de' ? 'Nutzer-ID' : 'User ID'}</TableHead>
                    <TableHead>{language === 'de' ? 'Typ' : 'Type'}</TableHead>
                    <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                    <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">
                        {request.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{getTypeBadge(request.request_type)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          request.request_type === 'export' ? (
                            <Button
                              size="sm"
                              onClick={() => processExportRequest(request)}
                              disabled={processing === request.id}
                            >
                              {processing === request.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-2" />
                                  {language === 'de' ? 'Exportieren' : 'Export'}
                                </>
                              )}
                            </Button>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" disabled={processing === request.id}>
                                  {processing === request.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {language === 'de' ? 'Löschen' : 'Delete'}
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {language === 'de' ? 'Daten endgültig löschen?' : 'Permanently delete data?'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {language === 'de' 
                                      ? 'Diese Aktion kann nicht rückgängig gemacht werden. Alle Nutzerdaten werden unwiderruflich gelöscht.'
                                      : 'This action cannot be undone. All user data will be permanently deleted.'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{language === 'de' ? 'Abbrechen' : 'Cancel'}</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => processDeletionRequest(request)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {language === 'de' ? 'Endgültig löschen' : 'Delete permanently'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )
                        )}
                        {request.status === 'completed' && (
                          <Badge variant="outline">
                            <Check className="h-3 w-3 mr-1" />
                            {language === 'de' ? 'Erledigt' : 'Done'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
};

export default AdminGDPR;
