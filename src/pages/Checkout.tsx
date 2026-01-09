import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, CreditCard, Truck, Check, ArrowRight, ArrowLeft, Lock, MapPin, Package, Loader2, Ban } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

type CheckoutStep = 'shipping' | 'payment';

const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { id: 'shipping', label: 'Lieferung', icon: MapPin },
  { id: 'payment', label: 'Zahlung', icon: CreditCard },
];

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingBlocked, setCheckingBlocked] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
  });

  // Check if user is blocked
  useEffect(() => {
    const checkIfBlocked = async () => {
      if (!user?.email) {
        setCheckingBlocked(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_user_blocked', {
          check_email: user.email,
        });

        if (error) {
          console.error('Error checking blocked status:', error);
        } else {
          setIsBlocked(data === true);
        }
      } catch (err) {
        console.error('Error:', err);
      }
      setCheckingBlocked(false);
    };

    checkIfBlocked();
  }, [user]);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  // Show blocked message
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Checkout — Noor" description="Checkout nicht verfügbar" />
        <Header />
        <div className="container max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Ban className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
              {language === 'de' ? 'Zugang gesperrt' : 'Access Blocked'}
            </h1>
            <p className="text-muted-foreground mb-10">
              {language === 'de' 
                ? 'Ihr Konto wurde gesperrt. Bei Fragen wenden Sie sich bitte an unseren Kundenservice.' 
                : 'Your account has been blocked. Please contact customer service for assistance.'}
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-3">
              {language === 'de' ? 'Kontakt aufnehmen' : 'Contact Us'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading while checking blocked status
  if (checkingBlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Checkout — Noor" description="Schließen Sie Ihre Bestellung ab" />
        <Header />
        <div className="container max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-10">Fügen Sie Produkte hinzu, um zur Kasse zu gehen.</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-3">
              Produkte entdecken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      // Redirect to Stripe Checkout
      setIsSubmitting(true);
      
      try {
        // First save order to database if user is logged in
        let orderId: string | undefined;
        
        if (user) {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              total: state.total,
              status: 'pending',
              shipping_address: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
              }
            })
            .select()
            .single();

          if (orderError) throw orderError;
          orderId = orderData.id;

          // Save order items
          const orderItems = state.items.map(item => ({
            order_id: orderData.id,
            product_id: item.product.id,
            product_name: item.product.name,
            product_image: item.product.image,
            price: item.product.price,
            quantity: item.quantity,
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) throw itemsError;
        }

        // Call Stripe checkout edge function
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            items: state.items.map(item => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.image,
            })),
            shippingAddress: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
              email: formData.email,
            },
            orderId,
          },
        });

        if (error) throw error;

        if (data?.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error(language === 'de' ? 'Fehler beim Checkout' : 'Checkout error');
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    if (currentStep === 'payment') setCurrentStep('shipping');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Checkout — Noor" description="Schließen Sie Ihre Bestellung ab" />
      <Header />

      <div className="container max-w-5xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <p className="section-subheading mb-2">{t('ui.secureOrder')}</p>
          <h1 className="section-heading">{t('checkout.title')}</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-14">
          {steps.map((step, index) => {
            const isCompleted = currentStepIndex > index;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCompleted 
                        ? 'bg-success text-success-foreground' 
                        : isCurrent 
                          ? 'bg-primary text-primary-foreground shadow-glow' 
                          : 'bg-secondary text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`
                    text-xs mt-3 font-medium tracking-wide uppercase
                    ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-16 md:w-24 h-[2px] mx-3 mb-6 transition-colors duration-300 ${
                      currentStepIndex > index ? 'bg-success' : 'bg-border'
                    }`} 
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit}>
              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <div className="bg-card border border-border rounded-lg p-8 animate-in">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Truck className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">{t('checkout.shippingInfo')}</h2>
                      <p className="text-sm text-muted-foreground">Wohin sollen wir liefern?</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                          {t('checkout.firstName')}
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                          className="w-full px-4 py-3.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                          {t('checkout.lastName')}
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                          className="w-full px-4 py-3.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                          {t('auth.email')}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="w-full px-4 py-3.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                          Telefon (optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        {t('checkout.address')}
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                        className="w-full px-4 py-3.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                          {t('checkout.postalCode')}
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                          required
                          className="w-full px-4 py-3.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                          {t('checkout.city')}
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          required
                          className="w-full px-4 py-3.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="bg-card border border-border rounded-lg p-8 animate-in">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-secondary rounded-lg">
                      <CreditCard className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">{t('checkout.paymentInfo')}</h2>
                      <p className="text-sm text-muted-foreground">Sichere Zahlung über Stripe</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="p-4 bg-accent/50 rounded-lg border border-accent flex items-center gap-3">
                      <Lock className="w-4 h-4 text-accent-foreground" />
                      <p className="text-sm text-accent-foreground">
                        {language === 'de' 
                          ? 'Ihre Zahlung wird sicher über Stripe abgewickelt.' 
                          : 'Your payment is securely processed via Stripe.'}
                      </p>
                    </div>
                    
                    <div className="p-6 bg-muted/50 rounded-lg border border-border text-center">
                      <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'de' ? 'Stripe Checkout' : 'Stripe Checkout'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === 'de' 
                          ? 'Klicken Sie auf "Weiter", um zur sicheren Stripe-Zahlungsseite zu gelangen.' 
                          : 'Click "Continue" to proceed to the secure Stripe payment page.'}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>{language === 'de' ? 'SSL-verschlüsselt' : 'SSL encrypted'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 mt-8">
                {currentStep !== 'shipping' && (
                  <button 
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('checkout.back')}
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === 'de' ? 'Wird verarbeitet...' : 'Processing...'}
                    </>
                  ) : currentStep === 'payment' ? (
                    <>
                      <Lock className="w-4 h-4" />
                      {language === 'de' ? 'Zur Zahlung' : 'Proceed to Payment'}
                    </>
                  ) : (
                    <>
                      {t('checkout.continue')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-lg p-8 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                {t('cart.summary')}
              </h2>
              
              {/* Items */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {state.items.map(item => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-16 rounded-md object-cover" 
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs font-semibold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">{item.product.name}</p>
                      <p className="font-display font-semibold text-foreground mt-1">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider w-full my-6" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zwischensumme ({itemCount} Artikel)</span>
                  <span className="text-foreground">{state.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Versand</span>
                  <span className="text-success font-medium">Kostenlos</span>
                </div>
              </div>

              <div className="divider w-full my-6" />

              <div className="flex justify-between items-baseline">
                <span className="text-foreground font-medium">Gesamt</span>
                <div className="text-right">
                  <span className="font-display text-3xl font-semibold text-foreground">{state.total.toFixed(2)} €</span>
                  <p className="text-xs text-muted-foreground mt-1">{t('ui.inclVat')}</p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>{t('ui.securePayment')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
