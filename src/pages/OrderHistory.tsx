import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Package, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  created_at: string;
  order_items: OrderItem[];
}

const OrderHistory = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else if (data) {
        const typedOrders = data.map(order => ({
          ...order,
          shipping_address: order.shipping_address as Order['shipping_address'],
          order_items: order.order_items || []
        }));
        setOrders(typedOrders);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { de: string; en: string }> = {
      pending: { de: 'In Bearbeitung', en: 'Processing' },
      confirmed: { de: 'Bestätigt', en: 'Confirmed' },
      shipped: { de: 'Versendet', en: 'Shipped' },
      delivered: { de: 'Geliefert', en: 'Delivered' },
      cancelled: { de: 'Storniert', en: 'Cancelled' },
    };
    return labels[status]?.[language] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {language === 'de' ? 'Bitte anmelden' : 'Please sign in'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'de' 
              ? 'Melde dich an, um deine Bestellungen zu sehen.'
              : 'Sign in to view your orders.'}
          </p>
          <Link to="/auth" className="btn-primary inline-flex">
            {language === 'de' ? 'Anmelden' : 'Sign In'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={language === 'de' ? 'Bestellverlauf' : 'Order History'}
        description={language === 'de' 
          ? 'Übersicht deiner vergangenen Bestellungen bei Noor.'
          : 'Overview of your past orders at Noor.'}
      />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {language === 'de' ? 'Meine Bestellungen' : 'My Orders'}
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {language === 'de' ? 'Keine Bestellungen' : 'No orders yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'de' 
                ? 'Du hast noch keine Bestellungen aufgegeben.'
                : 'You have not placed any orders yet.'}
            </p>
            <Link to="/products" className="btn-primary inline-flex">
              {language === 'de' ? 'Jetzt einkaufen' : 'Start Shopping'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Order Header */}
                <div className="bg-muted/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Bestellung' : 'Order'}
                      </p>
                      <p className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Datum' : 'Date'}
                      </p>
                      <p className="text-sm">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Gesamt' : 'Total'}
                      </p>
                      <p className="text-sm font-semibold">{order.total.toFixed(2)} €</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        {item.product_image && (
                          <img 
                            src={item.product_image} 
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.product_id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.product_name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity}x {item.price.toFixed(2)} €
                          </p>
                        </div>
                        <p className="font-medium">
                          {(item.quantity * item.price).toFixed(2)} €
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      {language === 'de' ? 'Lieferadresse' : 'Shipping Address'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                      {order.shipping_address.address}<br />
                      {order.shipping_address.postalCode} {order.shipping_address.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
