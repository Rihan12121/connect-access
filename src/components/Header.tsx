import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShoppingCart, User, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const Header = ({ searchQuery = '', onSearchChange, showSearch = true }: HeaderProps) => {
  const { t, language, setLanguage } = useLanguage();
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const cartCount = getItemCount();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <header className="sticky top-0 z-50 bg-header text-header-foreground shadow-elevated">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-xs border-b border-header-foreground/10">
          <div className="flex items-center gap-4">
            <Link to="/shipping" className="hover:text-primary transition-colors">{t('footer.shipping')}</Link>
            <Link to="/faq" className="hover:text-primary transition-colors">{t('footer.faq')}</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Globe className="w-3 h-3" />
              {language === 'de' ? 'DE' : 'EN'}
            </button>
            {user ? (
              <Link to="/account" className="hover:text-primary transition-colors">{t('nav.account')}</Link>
            ) : (
              <Link to="/auth" className="hover:text-primary transition-colors">{t('nav.login')}</Link>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Noor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.home')}</Link>
            <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.categories')}</Link>
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">{t('products.discoverAll')}</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Mobile Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="md:hidden icon-btn text-header-foreground hover:bg-header-foreground/10"
            >
              <Globe className="w-5 h-5" />
            </button>

            <Link 
              to="/favorites" 
              className="icon-btn text-header-foreground hover:bg-header-foreground/10 relative"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-favorite text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="icon-btn text-header-foreground hover:bg-header-foreground/10 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link 
              to={user ? "/account" : "/auth"} 
              className="hidden md:flex icon-btn text-header-foreground hover:bg-header-foreground/10"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden icon-btn text-header-foreground hover:bg-header-foreground/10"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && onSearchChange && (
          <div className="pb-3">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-header-foreground/10 rounded-xl px-4 py-3 text-header-foreground placeholder:text-header-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-header-foreground/10 pt-4">
            <nav className="flex flex-col gap-3">
              <Link 
                to="/" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/categories" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t('nav.categories')}
              </Link>
              <Link 
                to="/products" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t('products.discoverAll')}
              </Link>
              <Link 
                to={user ? "/account" : "/auth"} 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {user ? t('nav.account') : t('nav.login')}
              </Link>
              <div className="flex gap-4 pt-2 border-t border-header-foreground/10">
                <Link to="/faq" onClick={() => setMenuOpen(false)} className="text-xs hover:text-primary">{t('footer.faq')}</Link>
                <Link to="/shipping" onClick={() => setMenuOpen(false)} className="text-xs hover:text-primary">{t('footer.shipping')}</Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-xs hover:text-primary">{t('footer.contact')}</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
