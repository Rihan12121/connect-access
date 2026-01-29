import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User, Menu, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const MobileBottomNav = () => {
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { to: '/', icon: Home, label: language === 'de' ? 'Start' : 'Home' },
    { to: '/products', icon: Search, label: language === 'de' ? 'Suchen' : 'Search' },
    { 
      to: '/favorites', 
      icon: Heart, 
      label: language === 'de' ? 'Wunsch' : 'Wishlist',
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    { 
      to: '/cart', 
      icon: ShoppingCart, 
      label: language === 'de' ? 'Korb' : 'Cart',
      badge: cartCount > 0 ? cartCount : undefined,
    },
    { 
      to: user ? '/account' : '/auth', 
      icon: User, 
      label: user ? (language === 'de' ? 'Profil' : 'Profile') : (language === 'de' ? 'Login' : 'Login'),
    },
  ];

  return (
    <nav 
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-1 p-2 min-w-[60px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
