import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, CreditCard, Truck, Check, ArrowRight, ArrowLeft, Lock, MapPin, Package, Loader2, Ban, Shield, AlertCircle, Zap, RotateCcw, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import PaymentBadges from '@/components/PaymentBadges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CheckoutStep = 'cart' | 'shipping' | 'payment';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

const Checkout = () => {
  const { state, clearCart, updateQuantity, removeItem } = useCart();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingBlocked, setCheckingBlocked] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
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

  const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
    { id: 'cart', label: language === 'de' ? 'Warenkorb' : 'Cart', icon: ShoppingBag },
    { id: 'shipping', label: language === 'de' ? 'Lieferung' : 'Shipping', icon: Truck },
    { id: 'payment', label: language === 'de' ? 'Zahlung' : 'Payment', icon: CreditCard },
  ];

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

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'de' ? 'Vorname erforderlich' : 'First name required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'de' ? 'Nachname erforderlich' : 'Last name required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'de' ? 'Gültige E-Mail erforderlich' : 'Valid email required';
    }
    if (!formData.address.trim()) {
      newErrors.address = language === 'de' ? 'Adresse erforderlich' : 'Address required';
    }
    if (!formData.city.trim()) {
      newErrors.city = language === 'de' ? 'Stadt erforderlich' : 'City required';
    }
    if (!formData.postalCode.trim() || !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = language === 'de' ? 'Gültige PLZ erforderlich (5 Ziffern)' : 'Valid postal code required (5 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-10">
              {language === 'de' ? 'Fügen Sie Produkte hinzu, um zur Kasse zu gehen.' : 'Add products to proceed to checkout.'}
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-3">
              {language === 'de' ? 'Produkte entdecken' : 'Discover Products'}
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
    
    if (currentStep === 'cart') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      if (validateForm()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      setIsSubmitting(true);
      
      try {
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
    else if (currentStep === 'shipping') setCurrentStep('cart');
  };

  const InputField = ({ 
    name, 
    label, 
    type = 'text', 
    required = true,
    placeholder,
    className = ''
  }: { 
    name: keyof typeof formData; 
    label: string; 
    type?: string; 
    required?: boolean;
    placeholder?: string;
    className?: string;
  }) => (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium text-foreground mb-2 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        value={formData[name]}
        onChange={(e) => {
          setFormData({...formData, [name]: e.target.value});
          if (errors[name as keyof FormErrors]) {
            setErrors({...errors, [name]: undefined});
          }
        }}
        placeholder={placeholder}
        className={`h-12 ${errors[name as keyof FormErrors] ? 'border-destructive focus:ring-destructive' : ''}`}
      />
      {errors[name as keyof FormErrors] && (
        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors[name as keyof FormErrors]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <SEO title="Checkout — Noor" description="Schließen Sie Ihre Bestellung ab" />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const isCompleted = currentStepIndex > index;
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (isCompleted) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={!isCompleted}
                    className="flex flex-col items-center group"
                  >
                    <div 
                      className={`
                        w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2
                        ${isCompleted 
                          ? 'bg-success border-success text-success-foreground' 
                          : isCurrent 
                            ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30' 
                            : 'bg-background border-border text-muted-foreground'
                        }
                        ${isCompleted ? 'cursor-pointer hover:scale-105' : ''}
                      `}
                    >
                      {isCompleted ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                    <span className={`
                      text-xs md:text-sm mt-2 font-medium transition-colors
                      ${isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}
                    `}>
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div 
                      className={`w-12 md:w-20 lg:w-32 h-0.5 mx-2 md:mx-4 mb-6 transition-colors duration-300 ${
                        currentStepIndex > index ? 'bg-success' : 'bg-border'
                      }`} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit}>
              {/* Cart Step */}
              {currentStep === 'cart' && (
                <div className="bg-card rounded-2xl border border-border overflow-hidden animate-in fade-in">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      {language === 'de' ? 'Ihr Warenkorb' : 'Your Cart'}
                      <span className="text-muted-foreground font-normal">({itemCount} {language === 'de' ? 'Artikel' : 'items'})</span>
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {state.items.map((item) => (
                      <div key={item.product.id} className="p-4 md:p-6 flex gap-4">
                        <Link to={`/product/${item.product.id}`} className="shrink-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-semibold text-foreground">{item.product.price.toFixed(2)} €</span>
                            {item.product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {item.product.originalPrice.toFixed(2)} €
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-background rounded transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-background rounded transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} €</span>
                              <button 
                                type="button"
                                onClick={() => removeItem(item.product.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-muted/50">
                    <Button type="submit" size="lg" className="w-full py-6 text-base font-semibold">
                      {language === 'de' ? 'Weiter zur Lieferung' : 'Continue to Shipping'}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <div className="bg-card rounded-2xl border border-border overflow-hidden animate-in fade-in">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      {language === 'de' ? 'Lieferadresse' : 'Shipping Address'}
                    </h2>
                    <button type="button" onClick={goBack} className="text-sm text-primary hover:underline">
                      ← {language === 'de' ? 'Zurück' : 'Back'}
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField 
                        name="firstName" 
                        label={language === 'de' ? 'Vorname' : 'First Name'}
                        placeholder="Max"
                      />
                      <InputField 
                        name="lastName" 
                        label={language === 'de' ? 'Nachname' : 'Last Name'}
                        placeholder="Mustermann"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <InputField 
                        name="email" 
                        label="E-Mail"
                        type="email"
                        placeholder="max@beispiel.de"
                      />
                      <InputField 
                        name="phone" 
                        label={language === 'de' ? 'Telefon (optional)' : 'Phone (optional)'}
                        type="tel"
                        required={false}
                        placeholder="+49 123 456789"
                      />
                    </div>
                    
                    <InputField 
                      name="address" 
                      label={language === 'de' ? 'Straße & Hausnummer' : 'Street Address'}
                      placeholder="Musterstraße 123"
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <InputField 
                        name="postalCode" 
                        label={language === 'de' ? 'PLZ' : 'Postal Code'}
                        placeholder="12345"
                      />
                      <InputField 
                        name="city" 
                        label={language === 'de' ? 'Stadt' : 'City'}
                        placeholder="Berlin"
                        className="col-span-2"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-muted/50">
                    <Button type="submit" size="lg" className="w-full py-6 text-base font-semibold">
                      {language === 'de' ? 'Weiter zur Zahlung' : 'Continue to Payment'}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="bg-card rounded-2xl border border-border overflow-hidden animate-in fade-in">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      {language === 'de' ? 'Zahlung' : 'Payment'}
                    </h2>
                    <button type="button" onClick={goBack} className="text-sm text-primary hover:underline">
                      ← {language === 'de' ? 'Zurück' : 'Back'}
                    </button>
                  </div>
                  
                  <div className="p-6">
                    {/* Shipping Summary */}
                    <div className="p-4 bg-muted/50 rounded-xl mb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {language === 'de' ? 'Lieferadresse' : 'Shipping to'}
                          </p>
                          <p className="font-medium text-foreground">
                            {formData.firstName} {formData.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formData.address}, {formData.postalCode} {formData.city}
                          </p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setCurrentStep('shipping')}
                          className="text-sm text-primary hover:underline"
                        >
                          {language === 'de' ? 'Ändern' : 'Change'}
                        </button>
                      </div>
                    </div>

                    {/* Payment Methods Info */}
                    <div className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">
                          {language === 'de' ? 'Sichere Zahlung mit Stripe' : 'Secure Payment with Stripe'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === 'de' 
                          ? 'Sie werden zu Stripe weitergeleitet, um Ihre Zahlung sicher abzuschließen.' 
                          : 'You will be redirected to Stripe to complete your payment securely.'}
                      </p>
                      <PaymentBadges />
                    </div>
                  </div>

                  <div className="p-6 bg-muted/50">
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="w-full py-6 text-base font-semibold bg-gradient-to-r from-primary to-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {language === 'de' ? 'Wird bearbeitet...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          {language === 'de' ? 'Jetzt bezahlen' : 'Pay Now'} — {state.total.toFixed(2)} €
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-2xl border border-border sticky top-24 overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  {language === 'de' ? 'Bestellübersicht' : 'Order Summary'}
                </h2>
              </div>

              {/* Items Preview */}
              <div className="p-4 max-h-64 overflow-y-auto divide-y divide-border">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="relative">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{(item.product.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="p-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'de' ? 'Zwischensumme' : 'Subtotal'}</span>
                  <span className="text-foreground">{state.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'de' ? 'Versand' : 'Shipping'}</span>
                  <span className="text-success font-medium">{language === 'de' ? 'Kostenlos' : 'Free'}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">{language === 'de' ? 'Gesamt' : 'Total'}</span>
                  <span className="text-2xl font-bold text-foreground">{state.total.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-muted-foreground text-right">{t('ui.inclVat')}</p>
              </div>

              {/* Trust Badges */}
              <div className="p-6 border-t border-border bg-muted/30 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground">{language === 'de' ? 'Kostenloser Versand' : 'Free Shipping'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{language === 'de' ? '14 Tage Rückgaberecht' : '14-day returns'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span className="text-muted-foreground">{language === 'de' ? 'SSL-verschlüsselt' : 'SSL encrypted'}</span>
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
