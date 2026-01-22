import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Percent, ShoppingBag, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Loader2 } from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  description: string | null;
  min_orders: number;
  min_total_spent: number;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
}

interface CustomerStats {
  user_id: string;
  email: string;
  order_count: number;
  total_spent: number;
  segment_name: string | null;
}

const CustomerSegments = () => {
  const { language } = useLanguage();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_orders: 0,
    min_total_spent: 0,
    discount_percentage: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch segments
      const { data: segmentsData, error: segmentsError } = await supabase
        .from('customer_segments')
        .select('*')
        .order('min_total_spent', { ascending: true });

      if (segmentsError) throw segmentsError;
      setSegments(segmentsData || []);

      // Fetch customer stats
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total');

      if (ordersError) throw ordersError;

      // Aggregate customer stats
      const statsMap = new Map<string, { order_count: number; total_spent: number }>();
      ordersData?.forEach(order => {
        const existing = statsMap.get(order.user_id) || { order_count: 0, total_spent: 0 };
        statsMap.set(order.user_id, {
          order_count: existing.order_count + 1,
          total_spent: existing.total_spent + Number(order.total),
        });
      });

      // Get profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name');

      const customerStats: CustomerStats[] = [];
      statsMap.forEach((stats, user_id) => {
        const profile = profilesData?.find(p => p.user_id === user_id);
        const segment = segmentsData?.find(s => 
          s.is_active && 
          stats.order_count >= s.min_orders && 
          stats.total_spent >= s.min_total_spent
        );
        
        customerStats.push({
          user_id,
          email: profile?.display_name || user_id.slice(0, 8),
          order_count: stats.order_count,
          total_spent: stats.total_spent,
          segment_name: segment?.name || null,
        });
      });

      setCustomers(customerStats.sort((a, b) => b.total_spent - a.total_spent));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingSegment) {
        const { error } = await supabase
          .from('customer_segments')
          .update(formData)
          .eq('id', editingSegment.id);

        if (error) throw error;
        toast.success(language === 'de' ? 'Segment aktualisiert' : 'Segment updated');
      } else {
        const { error } = await supabase
          .from('customer_segments')
          .insert([formData]);

        if (error) throw error;
        toast.success(language === 'de' ? 'Segment erstellt' : 'Segment created');
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving segment:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'de' ? 'Segment wirklich löschen?' : 'Delete this segment?')) return;

    try {
      const { error } = await supabase
        .from('customer_segments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(language === 'de' ? 'Segment gelöscht' : 'Segment deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting segment:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      min_orders: 0,
      min_total_spent: 0,
      discount_percentage: 0,
      is_active: true,
    });
    setEditingSegment(null);
  };

  const openEditDialog = (segment: Segment) => {
    setEditingSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description || '',
      min_orders: segment.min_orders,
      min_total_spent: segment.min_total_spent,
      discount_percentage: segment.discount_percentage,
      is_active: segment.is_active,
    });
    setDialogOpen(true);
  };

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Kundensegmente' : 'Customer Segments'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Kundensegmente' : 'Customer Segments'}
              </h1>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Neues Segment' : 'New Segment'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSegment
                      ? (language === 'de' ? 'Segment bearbeiten' : 'Edit Segment')
                      : (language === 'de' ? 'Neues Segment' : 'New Segment')}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>{language === 'de' ? 'Name' : 'Name'}</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === 'de' ? 'z.B. Gold-Kunden' : 'e.g. Gold Customers'}
                    />
                  </div>
                  <div>
                    <Label>{language === 'de' ? 'Beschreibung' : 'Description'}</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'de' ? 'Min. Bestellungen' : 'Min. Orders'}</Label>
                      <Input
                        type="number"
                        value={formData.min_orders}
                        onChange={(e) => setFormData({ ...formData, min_orders: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>{language === 'de' ? 'Min. Umsatz (€)' : 'Min. Spent (€)'}</Label>
                      <Input
                        type="number"
                        value={formData.min_total_spent}
                        onChange={(e) => setFormData({ ...formData, min_total_spent: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{language === 'de' ? 'Rabatt (%)' : 'Discount (%)'}</Label>
                    <Input
                      type="number"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>{language === 'de' ? 'Aktiv' : 'Active'}</Label>
                  </div>
                  <Button onClick={handleSubmit} className="w-full">
                    {language === 'de' ? 'Speichern' : 'Save'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Segments */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  {language === 'de' ? 'Segmente' : 'Segments'}
                </h2>
                {segments.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      {language === 'de' ? 'Keine Segmente erstellt' : 'No segments created'}
                    </CardContent>
                  </Card>
                ) : (
                  segments.map((segment) => (
                    <Card key={segment.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {segment.name}
                            {!segment.is_active && (
                              <Badge variant="secondary">
                                {language === 'de' ? 'Inaktiv' : 'Inactive'}
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => openEditDialog(segment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(segment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {segment.description && (
                          <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            {segment.min_orders}+ {language === 'de' ? 'Bestellungen' : 'Orders'}
                          </Badge>
                          <Badge variant="outline">
                            <Euro className="h-3 w-3 mr-1" />
                            {segment.min_total_spent}+ €
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            <Percent className="h-3 w-3 mr-1" />
                            {segment.discount_percentage}% {language === 'de' ? 'Rabatt' : 'Discount'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Customers */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {language === 'de' ? 'Kunden' : 'Customers'} ({customers.length})
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {customers.slice(0, 20).map((customer) => (
                        <div key={customer.user_id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{customer.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.order_count} {language === 'de' ? 'Bestellungen' : 'orders'} • €{customer.total_spent.toFixed(2)}
                            </p>
                          </div>
                          {customer.segment_name && (
                            <Badge>{customer.segment_name}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
};

export default CustomerSegments;
