import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Heart, ShoppingBag, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { getItemCount } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success(t('auth.logoutSuccess'));
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t('account.title')}</h1>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{user.email}</h2>
              <p className="text-muted-foreground text-sm">{t('account.member')}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link 
            to="/favorites"
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-favorite/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-favorite" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t('favorites.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {favorites.length} {t('account.items')}
              </p>
            </div>
          </Link>

          <Link 
            to="/cart"
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t('cart.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {getItemCount()} {t('account.items')}
              </p>
            </div>
          </Link>

          <Link 
            to="/orders"
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                {t('nav.home') === 'Home' ? 'Order History' : 'Bestellverlauf'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('nav.home') === 'Home' ? 'View your orders' : 'Bestellungen anzeigen'}
              </p>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-4 hover:bg-secondary transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-destructive" />
            <span className="text-foreground">{t('auth.logout')}</span>
          </button>
        </div>
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Account;
