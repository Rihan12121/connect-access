import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Check, X, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  commission_rate: number;
  total_earnings: number;
  pending_payout: number;
  total_paid: number;
  status: string;
  created_at: string;
  profile?: {
    display_name: string | null;
  };
}

interface Payout {
  id: string;
  affiliate_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  created_at: string;
  affiliate?: {
    code: string;
  };
}

const Affiliates = () => {
  const { language } = useLanguage();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [payouts, setPendingPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('');

  const [stats, setStats] = useState({
    totalAffiliates: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    totalPaid: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch affiliates with profiles
    const { data: affData } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (affData) {
      const affiliatesWithProfiles = await Promise.all(
        affData.map(async (aff) => {
          const { data: profile } = await supabase
            .from('profiles_public')
            .select('display_name')
            .eq('user_id', aff.user_id)
            .single();
          return { ...aff, profile };
        })
      );
      setAffiliates(affiliatesWithProfiles);

      // Calculate stats
      setStats({
        totalAffiliates: affData.length,
        totalEarnings: affData.reduce((sum, a) => sum + Number(a.total_earnings), 0),
        pendingPayouts: affData.reduce((sum, a) => sum + Number(a.pending_payout), 0),
        totalPaid: affData.reduce((sum, a) => sum + Number(a.total_paid), 0),
      });
    }

    // Fetch pending payouts
    const { data: payoutData } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (payoutData) {
      const payoutsWithAffiliates = await Promise.all(
        payoutData.map(async (p) => {
          const { data: aff } = await supabase
            .from('affiliates')
            .select('code')
            .eq('id', p.affiliate_id)
            .single();
          return { ...p, affiliate: aff };
        })
      );
      setPendingPayouts(payoutsWithAffiliates);
    }

    setLoading(false);
  };

  const updateCommissionRate = async (affiliateId: string, newRate: number) => {
    const { error } = await supabase
      .from('affiliates')
      .update({ commission_rate: newRate })
      .eq('id', affiliateId);

    if (error) {
      toast.error('Error updating commission rate');
    } else {
      toast.success(language === 'de' ? 'Rate aktualisiert' : 'Rate updated');
      fetchData();
    }
  };

  const toggleAffiliateStatus = async (affiliate: Affiliate) => {
    const newStatus = affiliate.status === 'active' ? 'suspended' : 'active';
    const { error } = await supabase
      .from('affiliates')
      .update({ status: newStatus })
      .eq('id', affiliate.id);

    if (error) {
      toast.error('Error updating status');
    } else {
      toast.success(language === 'de' ? 'Status aktualisiert' : 'Status updated');
      fetchData();
    }
  };

  const createPayout = async () => {
    if (!selectedAffiliate || !payoutAmount) return;

    const amount = parseFloat(payoutAmount);
    if (amount <= 0 || amount > selectedAffiliate.pending_payout) {
      toast.error(language === 'de' ? 'Ungültiger Betrag' : 'Invalid amount');
      return;
    }

    const { error } = await supabase.from('affiliate_payouts').insert({
      affiliate_id: selectedAffiliate.id,
      amount,
      status: 'pending',
    });

    if (error) {
      toast.error('Error creating payout');
    } else {
      toast.success(language === 'de' ? 'Auszahlung erstellt' : 'Payout created');
      setPayoutDialogOpen(false);
      setSelectedAffiliate(null);
      setPayoutAmount('');
      fetchData();
    }
  };

  const processPayout = async (payoutId: string, approve: boolean) => {
    const { data: payout } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .eq('id', payoutId)
      .single();

    if (!payout) return;

    if (approve) {
      // Update payout status
      await supabase
        .from('affiliate_payouts')
        .update({
          status: 'paid',
          processed_at: new Date().toISOString(),
        })
        .eq('id', payoutId);

      // Update affiliate balances manually
      const { data: aff } = await supabase
        .from('affiliates')
        .select('*')
        .eq('id', payout.affiliate_id)
        .single();
        
      if (aff) {
        await supabase
          .from('affiliates')
          .update({
            pending_payout: Number(aff.pending_payout) - Number(payout.amount),
            total_paid: Number(aff.total_paid) + Number(payout.amount),
          })
          .eq('id', payout.affiliate_id);
      }

      toast.success(language === 'de' ? 'Auszahlung genehmigt' : 'Payout approved');
    } else {
      await supabase
        .from('affiliate_payouts')
        .update({ status: 'rejected' })
        .eq('id', payoutId);
      toast.info(language === 'de' ? 'Auszahlung abgelehnt' : 'Payout rejected');
    }

    fetchData();
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <SEO title="Affiliate Management" />
        <Header />

        <main className="container max-w-6xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-2">
            {language === 'de' ? 'Affiliate-Verwaltung' : 'Affiliate Management'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === 'de' ? 'Verwalte Partner und Auszahlungen' : 'Manage partners and payouts'}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Affiliates' : 'Affiliates'}
                    </p>
                    <p className="text-2xl font-bold">{stats.totalAffiliates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Gesamtverdienst' : 'Total Earnings'}
                    </p>
                    <p className="text-2xl font-bold">€{stats.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ausstehend' : 'Pending'}
                    </p>
                    <p className="text-2xl font-bold">€{stats.pendingPayouts.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ausgezahlt' : 'Paid'}
                    </p>
                    <p className="text-2xl font-bold">€{stats.totalPaid.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Payouts */}
          {payouts.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-amber-600">
                  {language === 'de' ? 'Ausstehende Auszahlungen' : 'Pending Payouts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>{language === 'de' ? 'Betrag' : 'Amount'}</TableHead>
                      <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                      <TableHead className="text-right">
                        {language === 'de' ? 'Aktionen' : 'Actions'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{payout.affiliate?.code}</TableCell>
                        <TableCell>€{Number(payout.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          {format(new Date(payout.created_at), 'dd.MM.yyyy', {
                            locale: language === 'de' ? de : enUS,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-600"
                              onClick={() => processPayout(payout.id, true)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive"
                              onClick={() => processPayout(payout.id, false)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Affiliates Table */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Alle Affiliates' : 'All Affiliates'}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">
                  {language === 'de' ? 'Lade...' : 'Loading...'}
                </p>
              ) : affiliates.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  {language === 'de' ? 'Keine Affiliates' : 'No affiliates'}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>{language === 'de' ? 'Name' : 'Name'}</TableHead>
                      <TableHead>{language === 'de' ? 'Rate' : 'Rate'}</TableHead>
                      <TableHead>{language === 'de' ? 'Verdienst' : 'Earnings'}</TableHead>
                      <TableHead>{language === 'de' ? 'Ausstehend' : 'Pending'}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">
                        {language === 'de' ? 'Aktionen' : 'Actions'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliates.map((aff) => (
                      <TableRow key={aff.id}>
                        <TableCell className="font-mono">{aff.code}</TableCell>
                        <TableCell>{aff.profile?.display_name || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={aff.commission_rate}
                              onChange={(e) =>
                                updateCommissionRate(aff.id, parseFloat(e.target.value))
                              }
                              className="w-16 h-8"
                              min={0}
                              max={50}
                            />
                            <span>%</span>
                          </div>
                        </TableCell>
                        <TableCell>€{Number(aff.total_earnings).toFixed(2)}</TableCell>
                        <TableCell>€{Number(aff.pending_payout).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={aff.status === 'active' ? 'default' : 'destructive'}
                          >
                            {aff.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {aff.pending_payout > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAffiliate(aff);
                                  setPayoutAmount(aff.pending_payout.toString());
                                  setPayoutDialogOpen(true);
                                }}
                              >
                                <CreditCard className="w-4 h-4 mr-1" />
                                {language === 'de' ? 'Auszahlen' : 'Payout'}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleAffiliateStatus(aff)}
                            >
                              {aff.status === 'active' ? (
                                <X className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Payout Dialog */}
        <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'de' ? 'Auszahlung erstellen' : 'Create Payout'}
              </DialogTitle>
              <DialogDescription>
                {language === 'de'
                  ? `Auszahlung für ${selectedAffiliate?.code}`
                  : `Payout for ${selectedAffiliate?.code}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{language === 'de' ? 'Betrag' : 'Amount'}</Label>
                <Input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  max={selectedAffiliate?.pending_payout}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Max: €{selectedAffiliate?.pending_payout.toFixed(2)}
                </p>
              </div>
              <Button onClick={createPayout} className="w-full">
                {language === 'de' ? 'Auszahlung erstellen' : 'Create Payout'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </AdminGuard>
  );
};

export default Affiliates;
