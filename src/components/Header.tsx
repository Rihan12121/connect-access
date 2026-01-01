import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, Globe, User, LogOut, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import SearchBar from '@/components/SearchBar';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langHover, setLangHover] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isVisible = useScrollHeader();
  const location = useLocation();
  
  const cartCount = getItemCount();
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header 
      className={`sticky top-0 z-50 bg-header/95 backdrop-blur-md text-header-foreground transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-18 py-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            {!isHomePage && (
              <button 
                onClick={() => window.history.back()}
                className="icon-btn text-header-foreground/70 hover:text-header-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <Link to="/" className="flex items-center gap-3 group">
              <span className="font-display text-3xl font-semibold tracking-tight">Noor</span>
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {user && isAdmin && (
              <Link
                to="/admin"
                className="icon-btn text-header-foreground/70 hover:text-header-foreground"
                title="Admin"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            <Link 
              to="/favorites" 
              className="icon-btn text-header-foreground/70 hover:text-header-foreground relative"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="icon-btn text-header-foreground/70 hover:text-header-foreground relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLangHover(!langHover)}
                className="icon-btn text-header-foreground/70 hover:text-header-foreground flex items-center gap-1.5"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium hidden sm:inline tracking-wider">{language.toUpperCase()}</span>
              </button>
              {langHover && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangHover(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-elevated py-1.5 min-w-[140px] z-50">
                    <button 
                      onClick={() => { setLanguage('de'); setLangHover(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors cursor-pointer ${language === 'de' ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      DE — Deutsch
                    </button>
                    <button 
                      onClick={() => { setLanguage('en'); setLangHover(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors cursor-pointer ${language === 'en' ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      EN — English
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Auth Button */}
            {user ? (
              <button 
                onClick={handleLogout}
                className="icon-btn text-header-foreground/70 hover:text-header-foreground"
                title={t('nav.logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link 
                to="/auth" 
                className="icon-btn text-header-foreground/70 hover:text-header-foreground"
                title={t('nav.login')}
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden icon-btn text-header-foreground/70 hover:text-header-foreground"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-4">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 border-t border-header-foreground/10 pt-6">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/categories" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-wide uppercase text-header-foreground/70 hover:text-header-foreground transition-colors"
              >
                {t('nav.categories')}
              </Link>
              {user && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium tracking-wide uppercase text-header-foreground/70 hover:text-header-foreground transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link 
                to={user ? "/account" : "/auth"} 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-wide uppercase text-header-foreground/70 hover:text-header-foreground transition-colors"
              >
                {user ? t('nav.account') : t('nav.login')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
