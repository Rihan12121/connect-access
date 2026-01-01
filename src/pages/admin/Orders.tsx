import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Loader2,
  ChevronDown,
  Package,
  Truck,
  Check,
  X
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
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

const statusOptions = [
  { value: 'pending', label: { de: 'In Bearbeitung', en: 'Pending' }, icon: Package },
  { value: 'confirmed', label: { de: 'Bestätigt', en: 'Confirmed' }, icon: Check },
  { value: 'shipped', label: { de: 'Versendet', en: 'Shipped' }, icon: Truck },
  { value: 'delivered', label: { de: 'Geliefert', en: 'Delivered' }, icon: Check },
  { value: 'cancelled', label: { de: 'Storniert', en: 'Cancelled' }, icon: X },
];

const AdminOrders = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
    } else {
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
    }
    
    setUpdatingStatus(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={language === 'de' ? 'Bestellungen verwalten' : 'Manage Orders'}
        description="Admin - Bestellungen verwalten"
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === 'de' ? 'Bestellungen' : 'Orders'}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>{language === 'de' ? 'Keine Bestellungen vorhanden' : 'No orders yet'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Order Header */}
                <div 
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">{order.total.toFixed(2)} €</span>
                    
                    {/* Status Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className={`appearance-none px-3 py-1.5 pr-8 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label[language]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                    
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="px-6 py-4 border-t border-border bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          {language === 'de' ? 'Artikel' : 'Items'}
                        </h3>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              {item.product_image && (
                                <img 
                                  src={item.product_image} 
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.product_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity}x {item.price.toFixed(2)} €
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          {language === 'de' ? 'Lieferadresse' : 'Shipping Address'}
                        </h3>
                        <p className="text-sm">
                          {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                          {order.shipping_address.address}<br />
                          {order.shipping_address.postalCode} {order.shipping_address.city}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminOrders;
