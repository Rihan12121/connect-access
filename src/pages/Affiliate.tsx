import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, DollarSign, Users, TrendingUp, Link2, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

interface Affiliate {
  id: string;
  code: string;
  commission_rate: number;
  total_earnings: number;
  pending_payout: number;
  total_paid: number;
  status: string;
}

interface Referral {
  id: string;
  clicked_at: string;
  converted_at: string | null;
  commission_amount: number;
  status: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

const Affiliate = () => {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchAffiliateData();
  }, [user]);

  const fetchAffiliateData = async () => {
    if (!user) return;

    const { data: affData } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (affData) {
      setAffiliate(affData);

      // Fetch referrals
      const { data: refData } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('affiliate_id', affData.id)
        .order('clicked_at', { ascending: false })
        .limit(50);

      setReferrals(refData || []);

      // Fetch payouts
      const { data: payData } = await supabase
        .from('affiliate_payouts')
        .select('*')
        .eq('affiliate_id', affData.id)
        .order('created_at', { ascending: false });

      setPayouts(payData || []);
    }

    setLoading(false);
  };

  const generateAffiliateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NOOR';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateAffiliate = async () => {
    if (!user) return;

    setCreating(true);
    const code = generateAffiliateCode();

    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_id: user.id,
        code,
        commission_rate: 5,
      })
      .select()
      .single();

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Erstellen' : 'Error creating affiliate');
    } else {
      setAffiliate(data);
      toast.success(
        language === 'de' ? 'Affiliate-Konto erstellt!' : 'Affiliate account created!'
      );
    }
    setCreating(false);
  };

  const copyLink = () => {
    if (!affiliate) return;
    const link = `${window.location.origin}/?ref=${affiliate.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(language === 'de' ? 'Link kopiert!' : 'Link copied!');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={language === 'de' ? 'Affiliate-Programm' : 'Affiliate Program'}
        description={
          language === 'de'
            ? 'Verdiene Geld mit dem Noor Affiliate-Programm'
            : 'Earn money with the Noor affiliate program'
        }
      />
      <Header />

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">
          {language === 'de' ? 'Affiliate-Programm' : 'Affiliate Program'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === 'de'
            ? 'Verdiene Provisionen durch Empfehlungen'
            : 'Earn commissions through referrals'}
        </p>

        {!affiliate ? (
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Werde Affiliate' : 'Become an Affiliate'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Starte jetzt und verdiene 5% Provision auf jede erfolgreiche Empfehlung.'
                  : 'Start now and earn 5% commission on every successful referral.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateAffiliate} disabled={creating}>
                {creating
                  ? language === 'de'
                    ? 'Wird erstellt...'
                    : 'Creating...'
                  : language === 'de'
                  ? 'Affiliate werden'
                  : 'Become an Affiliate'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Gesamtverdienst' : 'Total Earnings'}
                      </p>
                      <p className="text-2xl font-bold">
                        €{affiliate.total_earnings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Ausstehend' : 'Pending'}
                      </p>
                      <p className="text-2xl font-bold">
                        €{affiliate.pending_payout.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Check className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Ausgezahlt' : 'Paid Out'}
                      </p>
                      <p className="text-2xl font-bold">€{affiliate.total_paid.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Empfehlungen' : 'Referrals'}
                      </p>
                      <p className="text-2xl font-bold">{referrals.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Affiliate Link */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  {language === 'de' ? 'Dein Affiliate-Link' : 'Your Affiliate Link'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="sr-only">Affiliate Link</Label>
                    <Input
                      readOnly
                      value={`${window.location.origin}/?ref=${affiliate.code}`}
                    />
                  </div>
                  <Button onClick={copyLink} variant="outline">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === 'de'
                    ? `Provisionsrate: ${affiliate.commission_rate}%`
                    : `Commission rate: ${affiliate.commission_rate}%`}
                </p>
              </CardContent>
            </Card>

            {/* Referrals Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Letzte Empfehlungen' : 'Recent Referrals'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {language === 'de'
                      ? 'Noch keine Empfehlungen'
                      : 'No referrals yet'}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                        <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                        <TableHead className="text-right">
                          {language === 'de' ? 'Provision' : 'Commission'}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.slice(0, 10).map((ref) => (
                        <TableRow key={ref.id}>
                          <TableCell>
                            {format(new Date(ref.clicked_at), 'dd.MM.yyyy', {
                              locale: language === 'de' ? de : enUS,
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                ref.status === 'converted'
                                  ? 'default'
                                  : ref.status === 'clicked'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {ref.status === 'converted'
                                ? language === 'de'
                                  ? 'Konvertiert'
                                  : 'Converted'
                                : ref.status === 'clicked'
                                ? language === 'de'
                                  ? 'Geklickt'
                                  : 'Clicked'
                                : ref.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            €{ref.commission_amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Payouts Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Auszahlungen' : 'Payouts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {language === 'de'
                      ? 'Noch keine Auszahlungen'
                      : 'No payouts yet'}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                        <TableHead>{language === 'de' ? 'Betrag' : 'Amount'}</TableHead>
                        <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>
                            {format(new Date(payout.created_at), 'dd.MM.yyyy', {
                              locale: language === 'de' ? de : enUS,
                            })}
                          </TableCell>
                          <TableCell>€{payout.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payout.status === 'paid'
                                  ? 'default'
                                  : payout.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {payout.status === 'paid'
                                ? language === 'de'
                                  ? 'Ausgezahlt'
                                  : 'Paid'
                                : payout.status === 'pending'
                                ? language === 'de'
                                  ? 'Ausstehend'
                                  : 'Pending'
                                : payout.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Affiliate;
