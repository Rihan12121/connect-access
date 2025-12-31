import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

const Cart = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { t } = useLanguage();

  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Warenkorb — Noor" description="Ihr Warenkorb bei Noor" />
        <Header />
        <div className="container max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">{t('cart.emptyDescription')}</p>
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

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Warenkorb — Noor" description="Ihr Warenkorb bei Noor" />
      <Header />

      <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-subheading mb-2">Ihr Einkauf</p>
            <h1 className="section-heading">{t('cart.title')}</h1>
            <p className="text-muted-foreground text-sm mt-2">
              {itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'} in Ihrem Warenkorb
            </p>
          </div>
          <button 
            onClick={clearCart}
            className="premium-link text-muted-foreground hover:text-destructive transition-colors"
          >
            {t('cart.clearAll')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            {state.items.map((item, index) => (
              <div 
                key={item.product.id} 
                className="flex gap-5 bg-card rounded-lg p-5 border border-border transition-all duration-300 hover:shadow-card animate-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/product/${item.product.id}`} className="shrink-0 group">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display text-xl font-semibold text-foreground">
                      {item.product.price.toFixed(2)} €
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {item.product.originalPrice.toFixed(2)} €
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center gap-3 bg-secondary rounded-md px-3 py-2">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-0.5 hover:bg-background rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-display text-lg font-semibold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-0.5 hover:bg-background rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg font-semibold text-foreground">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </span>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-lg p-8 border border-border sticky top-24">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-8">{t('cart.summary')}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="text-foreground font-medium">{state.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className="text-success font-medium">{t('cart.free')}</span>
                </div>
                
                <div className="divider w-full my-6" />
                
                <div className="flex justify-between items-baseline">
                  <span className="text-foreground font-medium">{t('cart.total')}</span>
                  <span className="font-display text-3xl font-semibold text-foreground">{state.total.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-muted-foreground">inkl. MwSt.</p>
              </div>

              <Link 
                to="/checkout"
                className="w-full btn-primary py-4 mt-8 flex items-center justify-center gap-3"
              >
                {t('cart.checkout')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                to="/products"
                className="w-full text-center premium-link mt-6 block"
              >
                {t('cart.continueShopping')}
              </Link>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-border space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Kostenloser Versand ab 50€</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sichere SSL-Verschlüsselung</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">14 Tage Rückgaberecht</span>
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

export default Cart;
