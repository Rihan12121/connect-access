import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Globe, User, LogOut, LayoutDashboard, Package, ChevronDown, Truck, Store, MessageCircle, Menu, X, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useIsSeller } from '@/hooks/useIsSeller';
import SearchBar from '@/components/SearchBar';
import CategoryChips from '@/components/CategoryChips';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { isSeller } = useIsSeller();
  
  const [langHover, setLangHover] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const isVisible = useScrollHeader();
  const location = useLocation();
  
  const cartCount = getItemCount();
  const isHomePage = location.pathname === '/';

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 bg-header/95 backdrop-blur-xl text-header-foreground transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled ? 'shadow-premium border-b border-header-foreground/5' : ''}`}
      >

        <div className="container max-w-7xl mx-auto px-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between h-16 md:h-[68px] gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                <span className="text-primary-foreground font-display font-bold text-lg">N</span>
              </div>
              <span className="font-display text-2xl md:text-[26px] font-bold tracking-tight text-header-foreground">
                Noor
              </span>
            </Link>


            {/* Search Bar - Center */}
            <div className="flex-1 max-w-xl hidden md:block">
              <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 md:gap-2">

              {user && isSeller && !isAdmin && (
                <Link
                  to="/seller"
                  className="hidden md:flex icon-btn text-header-foreground/70 hover:text-header-foreground p-2"
                  title="Seller Dashboard"
                >
                  <Store className="w-5 h-5" />
                </Link>
              )}
              {user && isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex icon-btn text-header-foreground/70 hover:text-header-foreground p-2"
                  title="Admin"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
              )}

              {/* Favorites */}
              <Link 
                to="/favorites" 
                className="icon-btn text-header-foreground/70 hover:text-header-foreground relative p-2"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-deal text-deal-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {favorites.length > 99 ? '99+' : favorites.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="icon-btn text-header-foreground/70 hover:text-header-foreground relative p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Language Dropdown - Desktop */}
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setLangHover(!langHover)}
                  className="icon-btn text-header-foreground/70 hover:text-header-foreground flex items-center gap-1 p-2"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-wider">{language.toUpperCase()}</span>
                </button>
                {langHover && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setLangHover(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-elevated py-2 min-w-[160px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { setLanguage('de'); setLangHover(false); }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center gap-3 ${language === 'de' ? 'text-primary font-semibold bg-primary/5' : 'text-foreground'}`}
                      >
                        <span className="text-lg">🇩🇪</span>
                        Deutsch
                      </button>
                      <button 
                        onClick={() => { setLanguage('en'); setLangHover(false); }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center gap-3 ${language === 'en' ? 'text-primary font-semibold bg-primary/5' : 'text-foreground'}`}
                      >
                        <span className="text-lg">🇬🇧</span>
                        English
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
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <ChevronDown className={`w-3 h-3 hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-elevated py-2 min-w-[220px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium text-foreground truncate">
                            {language === 'de' ? 'Willkommen!' : 'Welcome!'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link 
                            to="/account"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <User className="w-4 h-4 text-muted-foreground" />
                            {language === 'de' ? 'Mein Profil' : 'My Profile'}
                          </Link>
                          <Link 
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            {language === 'de' ? 'Bestellungen' : 'Orders'}
                          </Link>
                          <Link 
                            to="/order-tracking"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            {language === 'de' ? 'Sendungsverfolgung' : 'Track Order'}
                          </Link>
                          <Link 
                            to="/messages"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <MessageCircle className="w-4 h-4 text-muted-foreground" />
                            {language === 'de' ? 'Nachrichten' : 'Messages'}
                          </Link>
                          <Link 
                            to="/become-seller"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"
                          >
                            <Store className="w-4 h-4 text-primary" />
                            {language === 'de' ? 'Jetzt Verkäufer werden' : 'Become a Seller'}
                          </Link>
                          <Link 
                            to="/favorites"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            {language === 'de' ? 'Wunschliste' : 'Wishlist'}
                          </Link>
                        </div>
                        {(isSeller || isAdmin) && (
                          <div className="border-t border-border py-1">
                            {isSeller && (
                              <Link 
                                to="/seller"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <Store className="w-4 h-4 text-muted-foreground" />
                                {language === 'de' ? 'Verkäufer-Dashboard' : 'Seller Dashboard'}
                              </Link>
                            )}
                            {isAdmin && (
                              <Link 
                                to="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                Admin Dashboard
                              </Link>
                            )}
                          </div>
                        )}
                        <div className="border-t border-border pt-1">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
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
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{language === 'de' ? 'Anmelden' : 'Sign In'}</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden icon-btn text-header-foreground/70 hover:text-header-foreground p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>

          {/* Category Chips - Homepage only */}
          {isHomePage && (
            <div className="pb-3 -mx-4 px-4 overflow-hidden">
              <CategoryChips />
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-header-foreground/10 bg-header animate-in slide-in-from-top-2">
            <nav className="container max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link 
                to="/products" 
                className="block px-4 py-3 text-sm font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'de' ? 'Alle Produkte' : 'All Products'}
              </Link>
              <Link 
                to="/categories" 
                className="block px-4 py-3 text-sm font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'de' ? 'Kategorien' : 'Categories'}
              </Link>
              <Link 
                to="/products?filter=deals" 
                className="block px-4 py-3 text-sm font-medium text-deal hover:bg-deal/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔥 {language === 'de' ? 'Angebote' : 'Deals'}
              </Link>
              <Link 
                to="/favorites" 
                className="block px-4 py-3 text-sm font-medium text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                ❤️ {language === 'de' ? 'Wunschliste' : 'Wishlist'}
              </Link>
              
              {/* Language Switch - Mobile */}
              <div className="flex items-center gap-2 px-4 py-3">
                <Globe className="w-4 h-4 text-header-foreground/60" />
                <button 
                  onClick={() => setLanguage('de')}
                  className={`px-3 py-1.5 rounded-md text-sm ${language === 'de' ? 'bg-primary text-primary-foreground' : 'text-header-foreground/60'}`}
                >
                  DE
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-md text-sm ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-header-foreground/60'}`}
                >
                  EN
                </button>
              </div>

              <Link 
                to="/become-seller" 
                className="block px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏪 {language === 'de' ? 'Jetzt Verkäufer werden' : 'Become a Seller'}
              </Link>
              
              {!user && (
                <Link 
                  to="/auth" 
                  className="block px-4 py-3 text-center bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {language === 'de' ? 'Anmelden / Registrieren' : 'Sign In / Register'}
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
