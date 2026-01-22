import { useState, useEffect } from 'react';
import { RotateCcw, Check, X, Clock, AlertCircle, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Refund {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  reason: string | null;
  status: string;
  stripe_refund_id: string | null;
  processed_at: string | null;
  created_at: string;
  order?: {
    id: string;
    total: number;
    status: string;
    shipping_address: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
}

const AdminRefunds = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select(`
          *,
          order:orders (
            id,
            total,
            status,
            shipping_address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRefunds((data as unknown as Refund[]) || []);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async (refund: Refund, approve: boolean) => {
    setProcessing(true);
    try {
      const newStatus = approve ? 'approved' : 'rejected';
      
      // Update refund status
      const { error: refundError } = await supabase
        .from('refunds')
        .update({
          status: newStatus,
          processed_by: user?.id,
          processed_at: new Date().toISOString(),
        })
        .eq('id', refund.id);

      if (refundError) throw refundError;

      // If approved, update order status
      if (approve) {
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'refunded',
            payment_status: 'refunded',
          })
          .eq('id', refund.order_id);

        if (orderError) throw orderError;
      }

      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        user_role: 'admin',
        action: approve ? 'refund_approved' : 'refund_rejected',
        entity_type: 'refund',
        entity_id: refund.id,
        new_values: { status: newStatus, reason: rejectReason || null },
      });

      toast.success(
        approve
          ? (language === 'de' ? 'Rückerstattung genehmigt' : 'Refund approved')
          : (language === 'de' ? 'Rückerstattung abgelehnt' : 'Refund rejected')
      );

      setSelectedRefund(null);
      setRejectReason('');
      fetchRefunds();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error(language === 'de' ? 'Fehler bei der Bearbeitung' : 'Error processing');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" /> {language === 'de' ? 'Genehmigt' : 'Approved'}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> {language === 'de' ? 'Ausstehend' : 'Pending'}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><X className="h-3 w-3 mr-1" /> {language === 'de' ? 'Abgelehnt' : 'Rejected'}</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><Euro className="h-3 w-3 mr-1" /> {language === 'de' ? 'Erstattet' : 'Refunded'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = {
    pending: refunds.filter(r => r.status === 'pending').length,
    approved: refunds.filter(r => r.status === 'approved').length,
    total: refunds.reduce((sum, r) => r.status === 'approved' ? sum + Number(r.amount) : sum, 0),
  };

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Rückerstattungen' : 'Refunds'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <RotateCcw className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === 'de' ? 'Rückerstattungen' : 'Refunds'}
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'de' ? 'Ausstehend' : 'Pending'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{stats.pending}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'de' ? 'Genehmigt' : 'Approved'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{stats.approved}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'de' ? 'Erstattet gesamt' : 'Total Refunded'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">€{stats.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : refunds.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {language === 'de' ? 'Keine Rückerstattungsanfragen' : 'No refund requests'}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'de' ? 'Bestellung' : 'Order'}</TableHead>
                    <TableHead>{language === 'de' ? 'Kunde' : 'Customer'}</TableHead>
                    <TableHead>{language === 'de' ? 'Betrag' : 'Amount'}</TableHead>
                    <TableHead>{language === 'de' ? 'Grund' : 'Reason'}</TableHead>
                    <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                    <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-mono text-sm">
                        {refund.order_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {refund.order?.shipping_address?.firstName} {refund.order?.shipping_address?.lastName}
                      </TableCell>
                      <TableCell className="font-semibold">
                        €{Number(refund.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {refund.reason || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(refund.status)}</TableCell>
                      <TableCell>
                        {new Date(refund.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        {refund.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setSelectedRefund(refund)}
                            >
                              {language === 'de' ? 'Bearbeiten' : 'Process'}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Process Refund Dialog */}
          <Dialog open={!!selectedRefund} onOpenChange={() => setSelectedRefund(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === 'de' ? 'Rückerstattung bearbeiten' : 'Process Refund'}
                </DialogTitle>
              </DialogHeader>
              {selectedRefund && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'de' ? 'Betrag' : 'Amount'}</p>
                      <p className="text-xl font-bold">€{Number(selectedRefund.amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'de' ? 'Bestellsumme' : 'Order Total'}</p>
                      <p className="text-xl font-bold">€{Number(selectedRefund.order?.total || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  {selectedRefund.reason && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{language === 'de' ? 'Kundengrund' : 'Customer Reason'}</p>
                      <p className="p-3 bg-muted rounded-lg">{selectedRefund.reason}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === 'de' ? 'Ablehnungsgrund (optional)' : 'Rejection Reason (optional)'}
                    </p>
                    <Textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder={language === 'de' ? 'Grund für Ablehnung...' : 'Reason for rejection...'}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => processRefund(selectedRefund, true)}
                      disabled={processing}
                      className="flex-1"
                    >
                      {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                      {language === 'de' ? 'Genehmigen' : 'Approve'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => processRefund(selectedRefund, false)}
                      disabled={processing}
                      className="flex-1"
                    >
                      {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                      {language === 'de' ? 'Ablehnen' : 'Reject'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
};

export default AdminRefunds;
