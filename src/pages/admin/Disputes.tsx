import { useState, useEffect } from 'react';
import { AlertTriangle, MessageSquare, Check, X, Clock, Loader2 } from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Dispute {
  id: string;
  order_id: string;
  seller_id: string;
  buyer_id: string;
  reason: string;
  description: string | null;
  status: string;
  resolution: string | null;
  created_at: string;
}

const statusOptions = [
  { value: 'open', label: { de: 'Offen', en: 'Open' }, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'investigating', label: { de: 'In Prüfung', en: 'Investigating' }, color: 'bg-blue-100 text-blue-800' },
  { value: 'resolved_buyer', label: { de: 'Käufer gewonnen', en: 'Buyer Won' }, color: 'bg-green-100 text-green-800' },
  { value: 'resolved_seller', label: { de: 'Verkäufer gewonnen', en: 'Seller Won' }, color: 'bg-purple-100 text-purple-800' },
  { value: 'closed', label: { de: 'Geschlossen', en: 'Closed' }, color: 'bg-muted text-muted-foreground' },
];

const AdminDisputes = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_disputes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDisputes(data || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const updateDisputeStatus = async (disputeId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus.startsWith('resolved_') || newStatus === 'closed') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = user?.id;
      }

      const { error } = await supabase
        .from('seller_disputes')
        .update(updateData)
        .eq('id', disputeId);

      if (error) throw error;
      toast.success(language === 'de' ? 'Status aktualisiert' : 'Status updated');
      fetchDisputes();
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast.error(language === 'de' ? 'Fehler beim Aktualisieren' : 'Error updating');
    }
  };

  const addResolution = async () => {
    if (!selectedDispute || !resolution.trim()) return;

    try {
      const { error } = await supabase
        .from('seller_disputes')
        .update({ 
          resolution,
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id
        })
        .eq('id', selectedDispute.id);

      if (error) throw error;
      toast.success(language === 'de' ? 'Lösung hinzugefügt' : 'Resolution added');
      setSelectedDispute(null);
      setResolution('');
      fetchDisputes();
    } catch (error) {
      console.error('Error adding resolution:', error);
      toast.error(language === 'de' ? 'Fehler' : 'Error');
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

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    investigating: disputes.filter(d => d.status === 'investigating').length,
    resolved: disputes.filter(d => d.status.startsWith('resolved_')).length,
  };

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Streitfälle' : 'Disputes'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Streitfälle' : 'Disputes'}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
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
                    <p className="text-2xl font-bold">{stats.open}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Offen' : 'Open'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.investigating}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'In Prüfung' : 'Investigating'}
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
                    <p className="text-2xl font-bold">{stats.resolved}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Gelöst' : 'Resolved'}
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
          ) : disputes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {language === 'de' ? 'Keine Streitfälle vorhanden' : 'No disputes'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'de' ? 'Bestell-ID' : 'Order ID'}</TableHead>
                    <TableHead>{language === 'de' ? 'Grund' : 'Reason'}</TableHead>
                    <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                    <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">
                        #{dispute.order_id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="font-medium truncate">{dispute.reason}</p>
                        {dispute.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {dispute.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                      <TableCell>
                        {new Date(dispute.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select
                            value={dispute.status}
                            onValueChange={(value) => updateDisputeStatus(dispute.id, value)}
                          >
                            <SelectTrigger className="w-36">
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedDispute(dispute)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Resolution Dialog */}
          <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === 'de' ? 'Lösung hinzufügen' : 'Add Resolution'}
                </DialogTitle>
              </DialogHeader>
              {selectedDispute && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">{selectedDispute.reason}</p>
                    {selectedDispute.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedDispute.description}
                      </p>
                    )}
                  </div>
                  {selectedDispute.resolution ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-medium text-green-800">
                        {language === 'de' ? 'Bestehende Lösung:' : 'Existing Resolution:'}
                      </p>
                      <p className="text-green-700 mt-1">{selectedDispute.resolution}</p>
                    </div>
                  ) : (
                    <>
                      <Textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder={language === 'de' ? 'Lösungsbeschreibung...' : 'Resolution description...'}
                        rows={4}
                      />
                      <Button onClick={addResolution} className="w-full">
                        <Check className="h-4 w-4 mr-2" />
                        {language === 'de' ? 'Lösung speichern' : 'Save Resolution'}
                      </Button>
                    </>
                  )}
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

export default AdminDisputes;
