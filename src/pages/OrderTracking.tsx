import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Package, Truck, CheckCircle, Clock, Search, MapPin, ArrowRight, Loader2 } from 'lucide-react';

interface OrderItem {
  id: string;
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
    country?: string;
  };
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const trackingSteps = [
  { id: 'pending', icon: Clock, label: { de: 'Bestellt', en: 'Ordered' } },
  { id: 'paid', icon: CheckCircle, label: { de: 'Bezahlt', en: 'Paid' } },
  { id: 'confirmed', icon: Package, label: { de: 'Bestätigt', en: 'Confirmed' } },
  { id: 'shipped', icon: Truck, label: { de: 'Versendet', en: 'Shipped' } },
  { id: 'delivered', icon: MapPin, label: { de: 'Geliefert', en: 'Delivered' } },
];

const OrderTracking = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setOrderId(id);
      searchOrder(id);
    }
  }, [searchParams]);

  const searchOrder = async (id: string) => {
    if (!id.trim()) return;
    
    setLoading(true);
    setError('');
    setSearched(true);

    const { data, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id.trim())
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching order:', fetchError);
      setError(language === 'de' ? 'Fehler beim Laden der Bestellung' : 'Error loading order');
      setOrder(null);
    } else if (!data) {
      setError(language === 'de' ? 'Bestellung nicht gefunden' : 'Order not found');
      setOrder(null);
    } else {
      setOrder({
        ...data,
        shipping_address: data.shipping_address as Order['shipping_address'],
        order_items: data.order_items || []
      });
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(orderId);
  };

  const getStepIndex = (status: string) => {
    const index = trackingSteps.findIndex(s => s.id === status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={language === 'de' ? 'Bestellung verfolgen — Noor' : 'Track Order — Noor'}
        description={language === 'de' 
          ? 'Verfolgen Sie den Status Ihrer Bestellung bei Noor'
          : 'Track the status of your order at Noor'}
      />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {language === 'de' ? 'Bestellung verfolgen' : 'Track Your Order'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Geben Sie Ihre Bestellnummer ein, um den aktuellen Status zu sehen'
              : 'Enter your order number to see the current status'}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={language === 'de' ? 'Bestellnummer eingeben...' : 'Enter order ID...'}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="btn-primary px-6 py-4 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">{language === 'de' ? 'Suchen' : 'Search'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && searched && (
          <div className="max-w-xl mx-auto text-center py-12">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{error}</h2>
            <p className="text-muted-foreground mb-6">
              {language === 'de' 
                ? 'Bitte überprüfen Sie die Bestellnummer und versuchen Sie es erneut.'
                : 'Please check the order number and try again.'}
            </p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Tracking Progress */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-8">
                {language === 'de' ? 'Versandstatus' : 'Shipping Status'}
              </h2>
              
              {/* Progress Steps */}
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-border rounded-full" />
                <div 
                  className="absolute top-6 left-0 h-1 bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                />
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {trackingSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div 
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300
                            ${isCompleted 
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                              : 'bg-card border-2 border-border text-muted-foreground'
                            }
                            ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                          `}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`
                          text-xs md:text-sm mt-3 font-medium text-center
                          ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                        `}>
                          {step.label[language]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Status Message */}
              <div className="mt-10 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
                <p className="text-primary font-medium">
                  {order.status === 'delivered' 
                    ? (language === 'de' ? '✓ Ihre Bestellung wurde geliefert!' : '✓ Your order has been delivered!')
                    : order.status === 'shipped'
                    ? (language === 'de' ? '📦 Ihre Bestellung ist unterwegs!' : '📦 Your order is on its way!')
                    : order.status === 'confirmed'
                    ? (language === 'de' ? '✓ Bestellung bestätigt und wird vorbereitet' : '✓ Order confirmed and being prepared')
                    : order.status === 'paid'
                    ? (language === 'de' ? '✓ Zahlung erhalten, Bestellung wird bearbeitet' : '✓ Payment received, order is being processed')
                    : (language === 'de' ? '⏳ Bestellung eingegangen, warte auf Zahlung' : '⏳ Order received, awaiting payment')
                  }
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {language === 'de' ? 'Bestelldetails' : 'Order Details'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'de' ? 'Bestellnummer' : 'Order ID'}</span>
                    <span className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'de' ? 'Bestellt am' : 'Ordered on'}</span>
                    <span className="text-sm">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'de' ? 'Gesamtsumme' : 'Total'}</span>
                    <span className="font-semibold">{order.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {language === 'de' ? 'Lieferadresse' : 'Shipping Address'}
                </h3>
                <div className="text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {order.shipping_address.firstName} {order.shipping_address.lastName}
                  </p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
                  {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {language === 'de' ? 'Bestellte Artikel' : 'Ordered Items'} ({order.order_items.length})
              </h3>
              <div className="divide-y divide-border">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    {item.product_image && (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-1">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {item.price.toFixed(2)} €
                      </p>
                    </div>
                    <p className="font-semibold">{(item.quantity * item.price).toFixed(2)} €</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="text-center pt-4">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {language === 'de' ? 'Weiter einkaufen' : 'Continue Shopping'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!order && !searched && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'de' 
                ? 'Geben Sie oben Ihre Bestellnummer ein, um den Status zu verfolgen.'
                : 'Enter your order number above to track its status.'}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderTracking;
