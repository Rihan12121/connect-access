import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, CreditCard, Truck, Check } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'payment' | 'confirm'>('info');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
  });

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header showSearch={false} />
        <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
          <Link to="/" className="btn-primary inline-block px-8 py-3 mt-4">
            {t('cart.continueShopping')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'info') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('confirm');
    } else {
      clearCart();
      toast.success(t('checkout.orderSuccess'));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t('checkout.title')}</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['info', 'payment', 'confirm'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-primary text-primary-foreground' : 
                ['info', 'payment', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-secondary text-muted-foreground'
              }`}>
                {['info', 'payment', 'confirm'].indexOf(step) > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-sm ${step === s ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s === 'info' && t('checkout.shipping')}
                {s === 'payment' && t('checkout.payment')}
                {s === 'confirm' && t('checkout.confirm')}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6">
              {step === 'info' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Truck className="w-5 h-5" /> {t('checkout.shippingInfo')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t('checkout.firstName')}
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="text"
                      placeholder={t('checkout.lastName')}
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder={t('auth.email')}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="text"
                    placeholder={t('checkout.address')}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t('checkout.postalCode')}
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="text"
                      placeholder={t('checkout.city')}
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> {t('checkout.paymentInfo')}
                  </h2>
                  <div className="p-4 bg-secondary rounded-xl border border-border">
                    <p className="text-muted-foreground text-sm">{t('checkout.demoPayment')}</p>
                  </div>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Check className="w-5 h-5" /> {t('checkout.confirmOrder')}
                  </h2>
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-2">{t('checkout.shippingTo')}:</p>
                    <p className="text-foreground">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.postalCode} {formData.city}
                    </p>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full btn-primary py-3 mt-6">
                {step === 'confirm' ? t('checkout.placeOrder') : t('checkout.continue')}
              </button>

              {step !== 'info' && (
                <button 
                  type="button"
                  onClick={() => setStep(step === 'confirm' ? 'payment' : 'info')}
                  className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-4"
                >
                  {t('checkout.back')}
                </button>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4">{t('cart.summary')}</h2>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {state.items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity}x {item.product.price.toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{state.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
