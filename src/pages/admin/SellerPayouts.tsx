import { useState, useEffect } from 'react';
import { Wallet, DollarSign, Percent, Clock, Check, Loader2, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Payout {
  id: string;
  seller_id: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  status: string;
  payout_method: string;
  scheduled_for: string | null;
  processed_at: string | null;
  created_at: string;
}

const PLATFORM_FEE_RATE = 0.15; // 15%

const statusOptions = [
  { value: 'pending', label: { de: 'Ausstehend', en: 'Pending' }, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'scheduled', label: { de: 'Geplant', en: 'Scheduled' }, color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: { de: 'In Bearbeitung', en: 'Processing' }, color: 'bg-purple-100 text-purple-800' },
  { value: 'completed', label: { de: 'Abgeschlossen', en: 'Completed' }, color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: { de: 'Fehlgeschlagen', en: 'Failed' }, color: 'bg-red-100 text-red-800' },
];

const AdminSellerPayouts = () => {
  const { language } = useLanguage();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const processPayout = async (payout: Payout) => {
    setProcessing(payout.id);
    try {
      // Simulate payout processing (in production, this would call Stripe Connect)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error } = await supabase
        .from('seller_payouts')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', payout.id);

      if (error) throw error;
      toast.success(language === 'de' ? 'Auszahlung abgeschlossen' : 'Payout completed');
      fetchPayouts();
    } catch (error) {
      console.error('Error processing payout:', error);
      toast.error(language === 'de' ? 'Fehler bei der Auszahlung' : 'Payout failed');
    } finally {
      setProcessing(null);
    }
  };

  const updatePayoutStatus = async (payoutId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('seller_payouts')
        .update({ status: newStatus })
        .eq('id', payoutId);

      if (error) throw error;
      toast.success(language === 'de' ? 'Status aktualisiert' : 'Status updated');
      fetchPayouts();
    } catch (error) {
      console.error('Error updating payout:', error);
      toast.error(language === 'de' ? 'Fehler beim Aktualisieren' : 'Error updating');
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(o => o.value === status);
    return (
      <Badge className={option?.color || 'bg-muted'}>
        {option?.label[language] || status}
      </Badge>
    );
  };

  const filteredPayouts = payouts.filter(p =>
    p.seller_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalPending: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.net_amount, 0),
    totalCompleted: payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.net_amount, 0),
    totalFees: payouts.reduce((sum, p) => sum + p.platform_fee, 0),
    pendingCount: payouts.filter(p => p.status === 'pending').length,
  };

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Seller-Auszahlungen' : 'Seller Payouts'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Wallet className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'de' ? 'Seller-Auszahlungen' : 'Seller Payouts'}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'de' ? '15% Plattformgebühr automatisch abgezogen' : '15% platform fee automatically deducted'}
                </p>
              </div>
            </div>
          </div>

          {/* Platform Fee Info */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">
                    {language === 'de' ? 'Plattformgebühr: 15%' : 'Platform Fee: 15%'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' 
                      ? 'Wird automatisch bei jeder Transaktion abgezogen. Auszahlungen erfolgen wöchentlich.'
                      : 'Automatically deducted from each transaction. Payouts processed weekly.'}
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
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">€{stats.totalPending.toFixed(2)}</p>
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
                  <Check className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">€{stats.totalCompleted.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ausgezahlt' : 'Paid Out'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">€{stats.totalFees.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Plattformgebühren' : 'Platform Fees'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingCount}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Wartend' : 'Waiting'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="py-4">
              <Input
                placeholder={language === 'de' ? 'Seller-ID suchen...' : 'Search seller ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : payouts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {language === 'de' ? 'Keine Auszahlungen vorhanden' : 'No payouts'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'de' ? 'Seller-ID' : 'Seller ID'}</TableHead>
                    <TableHead>{language === 'de' ? 'Brutto' : 'Gross'}</TableHead>
                    <TableHead>{language === 'de' ? 'Gebühr (15%)' : 'Fee (15%)'}</TableHead>
                    <TableHead>{language === 'de' ? 'Netto' : 'Net'}</TableHead>
                    <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                    <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-sm">
                        {payout.seller_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>€{payout.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-red-600">
                        -€{payout.platform_fee.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        €{payout.net_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell>
                        {new Date(payout.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {payout.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => processPayout(payout)}
                              disabled={processing === payout.id}
                            >
                              {processing === payout.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {language === 'de' ? 'Auszahlen' : 'Pay Out'}
                                </>
                              )}
                            </Button>
                          )}
                          {payout.status !== 'completed' && (
                            <Select
                              value={payout.status}
                              onValueChange={(value) => updatePayoutStatus(payout.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label[language]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
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

export default AdminSellerPayouts;
