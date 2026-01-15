import { forwardRef, useEffect } from 'react';
import { Heart, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { addToRecentlyViewed } from './RecentlyViewedSection';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  variant?: 'default' | 'compact' | 'horizontal';
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, showAddToCart = false, variant = 'default' }, ref) => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addItem } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const handleClick = () => {
      // Track recently viewed
      addToRecentlyViewed(product.id);
      window.scrollTo(0, 0);
      navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem(product);
      toast.success(`${product.name} ${t('products.addedToCart')}`);
    };

    // Calculate discount percentage display
    const discountPercent = product.discount || 
      (product.originalPrice 
        ? Math.round((1 - product.price / product.originalPrice) * 100) 
        : 0);

    return (
      <div ref={ref} className="product-card group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
        <div onClick={handleClick} className="block cursor-pointer touch-manipulation">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {discountPercent > 0 && (
                <span className="bg-deal text-deal-foreground text-xs font-bold px-2 py-1 rounded-md">
                  -{discountPercent}%
                </span>
              )}
              {!product.inStock && (
                <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-md">
                  {language === 'de' ? 'Ausverkauft' : 'Sold out'}
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product);
                toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
              }}
              className="absolute top-2 right-2 p-2.5 rounded-full bg-card/95 backdrop-blur-sm hover:bg-card shadow-sm transition-all duration-300 hover:scale-110 touch-manipulation active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <Heart className={`w-4 h-4 transition-colors ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
            </button>

            {/* Quick Add - Appears on hover */}
            {showAddToCart && product.inStock && (
              <button
                onClick={handleAddToCart}
                className="absolute bottom-3 left-3 right-3 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
              >
                <ShoppingCart className="w-4 h-4" />
                {language === 'de' ? 'Hinzufügen' : 'Add'}
              </button>
            )}
          </div>
        </div>
        
        <div className="p-3 md:p-4">
          <div onClick={handleClick} className="cursor-pointer touch-manipulation">
            <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-snug group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
              {product.name}
            </h3>
          </div>
          
          {/* Price Section */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-lg md:text-xl font-bold text-foreground">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs md:text-sm text-muted-foreground line-through">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          {/* Savings indicator */}
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-success font-medium mt-1">
              {language === 'de' ? 'Sie sparen' : 'You save'} {(product.originalPrice - product.price).toFixed(2)} €
            </p>
          )}
          
          {/* Add to Cart Button - For mobile or when explicitly shown */}
          {showAddToCart && product.inStock && (
            <button
              onClick={handleAddToCart}
              className="w-full mt-3 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity touch-manipulation active:scale-[0.98] min-h-[44px] md:hidden"
            >
              <ShoppingCart className="w-4 h-4" />
              {t('products.addToCart')}
            </button>
          )}
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
