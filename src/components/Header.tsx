import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, Globe, User, LogOut, ArrowLeft, LayoutDashboard, Settings, Package, ChevronDown } from 'lucide-react';
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

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="icon-btn text-header-foreground/70 hover:text-header-foreground flex items-center gap-1"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3" />
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

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Mobile Menu Slide-In */}
        <div 
          className={`fixed top-0 right-0 h-full w-72 bg-header z-50 md:hidden transform transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-display text-xl font-semibold text-header-foreground">Menü</span>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-2 text-header-foreground/70 hover:text-header-foreground active:scale-95 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link 
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
              >
                Home
              </Link>
              <Link 
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
              >
                {t('nav.products')}
              </Link>
              <Link 
                to="/categories" 
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
              >
                {t('nav.categories')}
              </Link>
              <Link 
                to="/favorites"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
              >
                {language === 'de' ? 'Wunschliste' : 'Wishlist'}
                {favorites.length > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link 
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
              >
                {t('nav.cart')}
                {cartCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <div className="border-t border-header-foreground/10 my-4" />
              
              {user ? (
                <>
                  <Link 
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
                  >
                    <User className="w-5 h-5" />
                    {language === 'de' ? 'Mein Profil' : 'My Profile'}
                  </Link>
                  <Link 
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
                  >
                    <Package className="w-5 h-5" />
                    {language === 'de' ? 'Bestellungen' : 'Orders'}
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-all active:scale-98 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    {language === 'de' ? 'Abmelden' : 'Logout'}
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-all active:scale-98"
                >
                  <User className="w-5 h-5" />
                  {t('nav.login')}
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
