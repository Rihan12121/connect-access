import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Globe, User, LogOut, LayoutDashboard, Package, ChevronDown, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import SearchBar from '@/components/SearchBar';
import CategoryChips from '@/components/CategoryChips';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  
  const [langHover, setLangHover] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isVisible = useScrollHeader();
  const location = useLocation();
  
  const cartCount = getItemCount();
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await signOut();
  };

  return (
    <header 
      className={`sticky top-0 z-50 bg-header/95 backdrop-blur-md text-header-foreground transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4">
        {/* Top Row: Logo + Icons */}
        <div className="flex items-center justify-between h-12 md:h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Noor</span>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            {user && isAdmin && (
              <Link
                to="/admin"
                className="icon-btn text-header-foreground/70 hover:text-header-foreground p-2"
                title="Admin"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            <Link 
              to="/favorites" 
              className="icon-btn text-header-foreground/70 hover:text-header-foreground relative p-2"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="icon-btn text-header-foreground/70 hover:text-header-foreground relative p-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLangHover(!langHover)}
                className="icon-btn text-header-foreground/70 hover:text-header-foreground flex items-center gap-1 p-2"
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

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="icon-btn text-header-foreground/70 hover:text-header-foreground flex items-center gap-1 p-2"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3 hidden sm:block" />
                </button>
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-elevated py-1.5 min-w-[180px] z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {language === 'de' ? 'Mein Profil' : 'My Profile'}
                      </Link>
                      <Link 
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        {language === 'de' ? 'Meine Bestellungen' : 'My Orders'}
                      </Link>
                      <Link 
                        to="/order-tracking"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        {language === 'de' ? 'Bestellung verfolgen' : 'Track Order'}
                      </Link>
                      <Link 
                        to="/favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        {language === 'de' ? 'Wunschliste' : 'Wishlist'}
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-border mt-1 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {language === 'de' ? 'Abmelden' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="icon-btn text-header-foreground/70 hover:text-header-foreground p-2"
                title={t('nav.login')}
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            
          </div>
        </div>

        {/* Search Bar - Compact */}
        <div className="pb-2">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* Category Chips - Horizontal Scroll */}
        {isHomePage && (
          <div className="pb-3">
            <CategoryChips />
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;
