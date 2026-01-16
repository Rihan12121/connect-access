import { forwardRef } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
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

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(product);
      toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
    };

    // Calculate discount percentage display
    const discountPercent = product.discount || 
      (product.originalPrice 
        ? Math.round((1 - product.price / product.originalPrice) * 100) 
        : 0);

    const savings = product.originalPrice && product.originalPrice > product.price 
      ? (product.originalPrice - product.price).toFixed(2) 
      : null;

    return (
      <div 
        ref={ref} 
        className="group bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      >
        <div onClick={handleClick} className="block cursor-pointer touch-manipulation">
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges - Top Left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {discountPercent > 0 && (
                <span className="bg-gradient-to-r from-deal to-deal/80 text-deal-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                  -{discountPercent}%
                </span>
              )}
              {!product.inStock && (
                <span className="bg-muted/95 backdrop-blur-sm text-muted-foreground text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {language === 'de' ? 'Ausverkauft' : 'Sold out'}
                </span>
              )}
            </div>

            {/* Action Buttons - Top Right */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <button 
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 touch-manipulation active:scale-95 ${
                  isFavorite(product.id) 
                    ? 'bg-favorite/10 border border-favorite/20' 
                    : 'bg-card/90 hover:bg-card border border-border/50'
                }`}
              >
                <Heart className={`w-4 h-4 transition-colors ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-foreground/70'}`} />
              </button>
              
              {/* Quick View Button - Desktop */}
              <button 
                onClick={handleClick}
                className="hidden md:flex p-2.5 rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-lg hover:bg-card transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <Eye className="w-4 h-4 text-foreground/70" />
              </button>
            </div>

            {/* Quick Add Button - Hover (Desktop) */}
            {showAddToCart && product.inStock && (
              <button
                onClick={handleAddToCart}
                className="absolute bottom-4 left-4 right-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg hover:bg-primary/90 hidden md:flex"
              >
                <ShoppingCart className="w-4 h-4" />
                {language === 'de' ? 'In den Warenkorb' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div onClick={handleClick} className="cursor-pointer touch-manipulation">
            {/* Category Tag */}
            <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1.5">
              {product.category}
            </p>
            
            {/* Product Name */}
            <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-snug group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
              {product.name}
            </h3>
          </div>
          
          {/* Rating Placeholder - For pro look */}
          <div className="flex items-center gap-1 mt-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-3 h-3 fill-primary/80 text-primary/80" />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">(4.8)</span>
          </div>
          
          {/* Price Section */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-display text-xl font-bold text-foreground">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          {/* Savings indicator */}
          {savings && (
            <p className="text-xs text-success font-semibold mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {language === 'de' ? 'Sie sparen' : 'You save'} {savings} €
            </p>
          )}
          
          {/* Add to Cart Button - Mobile */}
          {showAddToCart && product.inStock && (
            <button
              onClick={handleAddToCart}
              className="w-full mt-4 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all touch-manipulation active:scale-[0.98] md:hidden shadow-sm"
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
