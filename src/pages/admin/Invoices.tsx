import { useState, useEffect } from 'react';
import { FileText, Download, Mail, Eye, Check, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  user_id: string;
  subtotal: number;
  vat_amount: number;
  total: number;
  status: string;
  pdf_url: string | null;
  sent_at: string | null;
  created_at: string;
  order?: {
    shipping_address: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
}

const AdminInvoices = () => {
  const { language } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          order:orders (
            shipping_address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices((data as unknown as Invoice[]) || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (invoice: Invoice) => {
    // Generate PDF content
    const pdfContent = `
RECHNUNG

Rechnungsnummer: ${invoice.invoice_number}
Datum: ${new Date(invoice.created_at).toLocaleDateString('de-DE')}

An:
${invoice.order?.shipping_address?.firstName || ''} ${invoice.order?.shipping_address?.lastName || ''}

-------------------------------------------

Zwischensumme: €${invoice.subtotal.toFixed(2)}
MwSt. (19%): €${invoice.vat_amount.toFixed(2)}
-------------------------------------------
Gesamtbetrag: €${invoice.total.toFixed(2)}

-------------------------------------------

Vielen Dank für Ihren Einkauf!
    `;

    // Create a blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rechnung_${invoice.invoice_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(language === 'de' ? 'Rechnung heruntergeladen' : 'Invoice downloaded');
  };

  const sendInvoiceEmail = async (invoice: Invoice) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ sent_at: new Date().toISOString(), status: 'sent' })
        .eq('id', invoice.id);

      if (error) throw error;
      
      toast.success(language === 'de' ? 'Rechnung versendet' : 'Invoice sent');
      fetchInvoices();
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error(language === 'de' ? 'Fehler beim Versenden' : 'Error sending');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" /> {language === 'de' ? 'Bezahlt' : 'Paid'}</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800"><Mail className="h-3 w-3 mr-1" /> {language === 'de' ? 'Versendet' : 'Sent'}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> {language === 'de' ? 'Ausstehend' : 'Pending'}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><X className="h-3 w-3 mr-1" /> {language === 'de' ? 'Storniert' : 'Cancelled'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.order?.shipping_address?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Rechnungen' : 'Invoices'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Rechnungen' : 'Invoices'}
              </h1>
              <Badge variant="secondary">{invoices.length}</Badge>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="py-4">
              <Input
                placeholder={language === 'de' ? 'Rechnung suchen...' : 'Search invoice...'}
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
                    <TableHead>{language === 'de' ? 'Rechnungsnr.' : 'Invoice No.'}</TableHead>
                    <TableHead>{language === 'de' ? 'Kunde' : 'Customer'}</TableHead>
                    <TableHead>{language === 'de' ? 'Betrag' : 'Amount'}</TableHead>
                    <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                    <TableHead>{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>
                        {invoice.order?.shipping_address?.firstName} {invoice.order?.shipping_address?.lastName}
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-semibold">€{invoice.total.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground block">
                            inkl. €{invoice.vat_amount.toFixed(2)} MwSt.
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        {new Date(invoice.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => generatePDF(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => sendInvoiceEmail(invoice)}
                            disabled={invoice.sent_at !== null}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Invoice Preview Dialog */}
          <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'de' ? 'Rechnung' : 'Invoice'} {selectedInvoice?.invoice_number}
                </DialogTitle>
              </DialogHeader>
              {selectedInvoice && (
                <div className="space-y-6 py-4">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">{language === 'de' ? 'Rechnungsadresse' : 'Billing Address'}</h3>
                    <p>{selectedInvoice.order?.shipping_address?.firstName} {selectedInvoice.order?.shipping_address?.lastName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{language === 'de' ? 'Zwischensumme' : 'Subtotal'}</span>
                      <span>€{selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{language === 'de' ? 'MwSt. (19%)' : 'VAT (19%)'}</span>
                      <span>€{selectedInvoice.vat_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>{language === 'de' ? 'Gesamt' : 'Total'}</span>
                      <span>€{selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => generatePDF(selectedInvoice)} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      {language === 'de' ? 'Herunterladen' : 'Download'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => sendInvoiceEmail(selectedInvoice)}
                      disabled={selectedInvoice.sent_at !== null}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {language === 'de' ? 'Per E-Mail senden' : 'Send by Email'}
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

export default AdminInvoices;
