import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, ShoppingCart, Menu, X, Globe, User, LogOut, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import SearchBar from '@/components/SearchBar';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();
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
      className={`sticky top-0 z-50 bg-header text-header-foreground shadow-elevated transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            {!isHomePage && (
              <Link 
                to="/" 
                className="icon-btn text-header-foreground hover:bg-header-foreground/10 mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Noor</span>
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1">
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
            
            {/* Language Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setLangHover(true)}
              onMouseLeave={() => setLangHover(false)}
            >
              <button className="icon-btn text-header-foreground hover:bg-header-foreground/10 flex items-center gap-1">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium hidden sm:inline">{language.toUpperCase()}</span>
              </button>
              {langHover && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                  <button 
                    onClick={() => setLanguage('de')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${language === 'de' ? 'text-primary font-medium' : 'text-foreground'}`}
                  >
                    DE - Deutsch
                  </button>
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${language === 'en' ? 'text-primary font-medium' : 'text-foreground'}`}
                  >
                    EN - English
                  </button>
                </div>
              )}
            </div>

            {/* Auth Button */}
            {user ? (
              <button 
                onClick={handleLogout}
                className="icon-btn text-header-foreground hover:bg-header-foreground/10"
                title={t('nav.logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link 
                to="/auth" 
                className="icon-btn text-header-foreground hover:bg-header-foreground/10"
                title={t('nav.login')}
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden icon-btn text-header-foreground hover:bg-header-foreground/10"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Always visible */}
        <div className="pb-3">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-header-foreground/10 pt-4">
            <nav className="flex flex-col gap-3">
              <Link 
                to="/categories" 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t('nav.categories')}
              </Link>
              <Link 
                to={user ? "/account" : "/auth"} 
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium hover:text-primary transition-colors"
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
