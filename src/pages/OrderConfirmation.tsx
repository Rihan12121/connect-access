import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, Home, ShoppingBag, CreditCard, Loader2, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';

interface PaymentDetails {
  id: string;
  amount_total: number;
  currency: string;
  customer_email: string | null;
  customer_name: string | null;
  payment_status: string;
  shipping_address?: {
    line1?: string;
    line2?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  shipping_name?: string;
  line_items?: Array<{
    description: string;
    quantity: number;
    amount_total: number;
  }>;
  payment_method?: {
    type: string;
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
    paypal?: {
      email: string;
    };
  };
  metadata?: {
    order_id?: string;
  };
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [orderNumber] = useState(() => 
    `NR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        setTimeout(() => setShowContent(true), 100);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('get-checkout-session', {
          body: { sessionId },
        });

        if (error) throw error;
        
        setPaymentDetails(data);
        
        // Clear cart after successful payment
        if (data?.payment_status === 'paid') {
          clearCart();
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
      } finally {
        setLoading(false);
        setTimeout(() => setShowContent(true), 100);
      }
    };

    fetchPaymentDetails();
  }, [sessionId, clearCart]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getPaymentMethodDisplay = () => {
    if (!paymentDetails?.payment_method) return null;
    
    const pm = paymentDetails.payment_method;
    if (pm.type === 'card' && pm.card) {
      const brandEmoji = pm.card.brand === 'visa' ? '💳' : pm.card.brand === 'mastercard' ? '💳' : '💳';
      return `${brandEmoji} ${pm.card.brand.toUpperCase()} •••• ${pm.card.last4}`;
    }
    if (pm.type === 'paypal') {
      return `PayPal${pm.paypal?.email ? ` (${pm.paypal.email})` : ''}`;
    }
    return pm.type.charAt(0).toUpperCase() + pm.type.slice(1);
  };

  const steps = [
    { icon: CheckCircle, title: 'Bestellung bestätigt', description: 'Ihre Bestellung wurde erfolgreich aufgenommen', completed: true },
    { icon: Package, title: 'In Bearbeitung', description: 'Wir bereiten Ihre Bestellung vor', completed: false },
    { icon: Truck, title: 'Versand', description: 'Ihre Bestellung ist unterwegs', completed: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Bestellung bestätigt — Noor" 
        description="Vielen Dank für Ihre Bestellung bei Noor" 
      />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Success Animation */}
        <div className={`text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-success rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-success-foreground" />
            </div>
          </div>

          <p className="section-subheading text-success mb-2">Bestellung erfolgreich</p>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-3">
            Vielen Dank!
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Ihre Bestellung wurde erfolgreich aufgenommen und wird nun bearbeitet.
          </p>
        </div>

        {/* Order Number & Payment Details */}
        <div className={`mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
              Bestellnummer
            </p>
            <p className="font-display text-xl md:text-2xl font-semibold text-foreground tracking-wider">
              {paymentDetails?.metadata?.order_id?.slice(0, 8).toUpperCase() || orderNumber}
            </p>
          </div>

          {paymentDetails && (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                Gesamtbetrag
              </p>
              <p className="font-display text-xl md:text-2xl font-semibold text-primary">
                {formatCurrency(paymentDetails.amount_total, paymentDetails.currency)}
              </p>
            </div>
          )}
        </div>

        {/* Payment Details Card */}
        {paymentDetails && (
          <div className={`mt-6 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-secondary/50 px-6 py-4 border-b border-border">
                <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Zahlungsdetails
                </h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Zahlungsmethode
                  </p>
                  <p className="text-foreground font-medium">
                    {getPaymentMethodDisplay() || 'Kreditkarte/Debitkarte'}
                  </p>
                </div>

                {/* Payment Status */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-success font-medium">Bezahlt</span>
                  </div>
                </div>

                {/* Customer Email */}
                {paymentDetails.customer_email && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      E-Mail
                    </p>
                    <p className="text-foreground">{paymentDetails.customer_email}</p>
                  </div>
                )}

                {/* Shipping Address */}
                {paymentDetails.shipping_address && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Lieferadresse
                    </p>
                    <p className="text-foreground text-sm">
                      {paymentDetails.shipping_name && <span className="block font-medium">{paymentDetails.shipping_name}</span>}
                      {paymentDetails.shipping_address.line1}
                      {paymentDetails.shipping_address.line2 && <span>, {paymentDetails.shipping_address.line2}</span>}
                      <br />
                      {paymentDetails.shipping_address.postal_code} {paymentDetails.shipping_address.city}
                    </p>
                  </div>
                )}
              </div>

              {/* Line Items */}
              {paymentDetails.line_items && paymentDetails.line_items.length > 0 && (
                <div className="border-t border-border">
                  <div className="px-6 py-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Bestellte Artikel
                    </p>
                    <div className="space-y-3">
                      {paymentDetails.line_items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-foreground text-sm font-medium">{item.description}</p>
                            <p className="text-muted-foreground text-xs">Menge: {item.quantity}</p>
                          </div>
                          <p className="text-foreground font-semibold">
                            {formatCurrency(item.amount_total, paymentDetails.currency)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Timeline */}
        <div className={`mt-6 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-foreground mb-6 text-center">
              Bestellstatus
            </h2>
            
            <div className="relative">
              <div className="absolute left-5 md:left-6 top-5 md:top-6 bottom-5 md:bottom-6 w-[2px] bg-border" />
              <div className="absolute left-5 md:left-6 top-5 md:top-6 w-[2px] h-[calc(33%-12px)] bg-success" />
              
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 md:gap-6 relative">
                      <div className={`
                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 z-10
                        ${step.completed 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-secondary text-muted-foreground'
                        }
                      `}>
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className="pt-1 md:pt-2">
                        <h3 className={`font-medium text-sm md:text-base ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Email Notification */}
        <div className={`mt-6 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-accent/30 border border-accent rounded-xl p-4 md:p-6 flex items-center gap-4">
            <div className="p-2.5 md:p-3 bg-accent rounded-full shrink-0">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm md:text-base">Bestätigungs-E-Mail gesendet</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Eine Bestellbestätigung wurde an {paymentDetails?.customer_email || 'Ihre E-Mail-Adresse'} gesendet.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 transition-all duration-700 delay-600 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link 
            to="/products" 
            className="btn-primary inline-flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
            Weiter einkaufen
          </Link>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Zur Startseite
          </Link>
        </div>

        {/* Help Section */}
        <div className={`mt-12 md:mt-16 text-center transition-all duration-700 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="divider mx-auto mb-6 md:mb-8" />
          <p className="text-muted-foreground text-sm">
            Haben Sie Fragen zu Ihrer Bestellung?{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Kontaktieren Sie uns
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
