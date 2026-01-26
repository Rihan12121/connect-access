import { useState, useEffect } from 'react';
import { RotateCcw, Package, Check, X, Clock, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

interface Return {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  status: string;
  refund_amount: number | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
}

const statusOptions = [
  { value: 'requested', label: { de: 'Angefragt', en: 'Requested' }, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: { de: 'Genehmigt', en: 'Approved' }, color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: { de: 'Versendet', en: 'Shipped' }, color: 'bg-purple-100 text-purple-800' },
  { value: 'received', label: { de: 'Erhalten', en: 'Received' }, color: 'bg-indigo-100 text-indigo-800' },
  { value: 'refunded', label: { de: 'Erstattet', en: 'Refunded' }, color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: { de: 'Abgelehnt', en: 'Rejected' }, color: 'bg-red-100 text-red-800' },
];

const AdminReturns = () => {
  const { language } = useLanguage();
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReturns(data || []);
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const updateReturnStatus = async (returnId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('returns')
        .update({ 
          status: newStatus,
          processed_at: newStatus === 'refunded' ? new Date().toISOString() : null
        })
        .eq('id', returnId);

      if (error) throw error;
      toast.success(language === 'de' ? 'Status aktualisiert' : 'Status updated');
      fetchReturns();
    } catch (error) {
      console.error('Error updating return:', error);
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

  const filteredReturns = returns.filter(r =>
    r.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'requested').length,
    approved: returns.filter(r => r.status === 'approved').length,
    refunded: returns.filter(r => r.status === 'refunded').length,
  };

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Rücksendungen' : 'Returns'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Rücksendungen' : 'Returns'}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-muted-foreground" />
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
                  <Truck className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Genehmigt' : 'Approved'}
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
                    <p className="text-2xl font-bold">{stats.refunded}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Erstattet' : 'Refunded'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="py-4">
              <Input
                placeholder={language === 'de' ? 'Suchen...' : 'Search...'}
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
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'de' ? 'Bestell-ID' : 'Order ID'}</TableHead>
                    <TableHead>{language === 'de' ? 'Grund' : 'Reason'}</TableHead>
                    <TableHead>{language === 'de' ? 'Betrag' : 'Amount'}</TableHead>
                    <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                    <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-mono text-sm">
                        #{returnItem.order_id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {returnItem.reason}
                      </TableCell>
                      <TableCell>
                        {returnItem.refund_amount ? `€${returnItem.refund_amount.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                      <TableCell>
                        {new Date(returnItem.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={returnItem.status}
                          onValueChange={(value) => updateReturnStatus(returnItem.id, value)}
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

export default AdminReturns;
