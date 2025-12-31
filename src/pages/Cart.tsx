import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

const Cart = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { t } = useLanguage();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Warenkorb" description="Dein Warenkorb bei Noor Shop" />
        <Header />
        <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
          <p className="text-muted-foreground mb-6">{t('cart.emptyDescription')}</p>
          <Link to="/" className="btn-primary inline-block px-8 py-3">
            {t('cart.continueShopping')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Warenkorb" description="Dein Warenkorb bei Noor Shop" />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('cart.title')}</h1>
          <button 
            onClick={clearCart}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            {t('cart.clearAll')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map(item => (
              <div key={item.product.id} className="flex gap-4 bg-card rounded-xl p-4 border border-border">
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-primary font-bold mt-1">{item.product.price.toFixed(2)} €</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-secondary rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4">{t('cart.summary')}</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="text-foreground">{state.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className="text-foreground">{t('cart.free')}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-primary">{state.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full btn-primary py-3 mt-6 flex items-center justify-center"
              >
                {t('cart.checkout')}
              </Link>
              
              <Link 
                to="/"
                className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-4 block"
              >
                {t('cart.continueShopping')}
              </Link>
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
