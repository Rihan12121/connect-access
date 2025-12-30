import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShoppingCart, User, Menu } from 'lucide-react';
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
  const { t } = useLanguage();
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const cartCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-header text-header-foreground shadow-elevated">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Noor</span>
          </Link>

          <div className="flex items-center gap-2">
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
              className="icon-btn text-header-foreground hover:bg-header-foreground/10"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

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
      </div>
    </header>
  );
};

export default Header;
