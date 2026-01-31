import { forwardRef, useEffect, useState } from 'react';
import { Heart, ShoppingCart, Star, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCompare } from '@/context/CompareContext';
import { toast } from 'sonner';
import { addToRecentlyViewed } from './RecentlyViewedSection';
import { supabase } from '@/integrations/supabase/client';

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
    const { addToCompare, isInCompare, canAddMore } = useCompare();
    const navigate = useNavigate();
    
    // Real product reviews
    const [rating, setRating] = useState<{ avg: number | null; count: number }>({ avg: null, count: 0 });

    useEffect(() => {
      const fetchRating = async () => {
        const { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', product.id);

        if (!error && data && data.length > 0) {
          const sum = data.reduce((acc, r) => acc + r.rating, 0);
          setRating({ avg: sum / data.length, count: data.length });
        }
      };
      fetchRating();
    }, [product.id]);

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

    const handleAddToCompare = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isInCompare(product.id)) {
        toast.info(language === 'de' ? 'Bereits im Vergleich' : 'Already in comparison');
        return;
      }
      addToCompare({
        id: product.id,
        name: product.name,
        price: product.price,
        original_price: product.originalPrice,
        image: product.image,
        category: product.category,
        description: product.description,
        in_stock: product.inStock,
        discount: product.discount,
      });
    };

    // Calculate discount percentage display
    const discountPercent = product.discount || 
      (product.originalPrice 
        ? Math.round((1 - product.price / product.originalPrice) * 100) 
        : 0);

    const savings = product.originalPrice && product.originalPrice > product.price 
      ? (product.originalPrice - product.price).toFixed(2) 
      : null;

    const displayRating = rating.avg ?? 0;
    const displayCount = rating.count;

    return (
      <div 
        ref={ref} 
        className="group bg-card rounded-xl overflow-hidden border border-border/30 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
      >
        <div onClick={handleClick} className="block cursor-pointer touch-manipulation">
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            
            {/* Badges - Top Left */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {discountPercent > 0 && (
                <span className="bg-deal text-deal-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              )}
              {!product.inStock && (
                <span className="bg-foreground/90 text-background text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {language === 'de' ? 'Ausverkauft' : 'Sold out'}
                </span>
              )}
            </div>

            {/* Action Buttons - Top Right */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
              <button 
                onClick={handleToggleFavorite}
                className={`p-1.5 rounded-full backdrop-blur-sm shadow transition-all duration-200 hover:scale-110 touch-manipulation active:scale-95 ${
                  isFavorite(product.id) 
                    ? 'bg-favorite/20' 
                    : 'bg-card/90 hover:bg-card'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-foreground/60'}`} />
              </button>
              
              <button 
                onClick={handleAddToCompare}
                className={`p-1.5 rounded-full backdrop-blur-sm shadow transition-all duration-200 hover:scale-110 touch-manipulation active:scale-95 ${
                  isInCompare(product.id) 
                    ? 'bg-primary/20' 
                    : 'bg-card/90 hover:bg-card'
                }`}
                title={language === 'de' ? 'Vergleichen' : 'Compare'}
              >
                <GitCompare className={`w-3.5 h-3.5 transition-colors ${isInCompare(product.id) ? 'text-primary' : 'text-foreground/60'}`} />
              </button>
            </div>

            {/* Quick Add Button - Hover (Desktop) */}
            {showAddToCart && product.inStock && (
              <button
                onClick={handleAddToCart}
                className="absolute bottom-2 left-2 right-2 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 shadow-lg hidden md:flex"
              >
                <ShoppingCart className="w-3 h-3" />
                {language === 'de' ? 'In den Warenkorb' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
        
        <div className="p-3">
          <div onClick={handleClick} className="cursor-pointer touch-manipulation">
            {/* Category Tag */}
            <p className="text-[9px] uppercase tracking-wider text-primary font-semibold mb-1">
              {product.category}
            </p>
            
            {/* Product Name */}
            <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors min-h-[2.25rem]">
              {product.name}
            </h3>
          </div>
          
          {/* Rating - Real data from reviews table */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center">
              {[1,2,3,4,5].map(i => (
                <Star 
                  key={i} 
                  className={`w-2.5 h-2.5 ${
                    i <= Math.round(displayRating) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'fill-muted text-muted'
                  }`} 
                />
              ))}
            </div>
            <span className="text-[9px] text-muted-foreground">
              {displayCount > 0 ? `(${displayRating.toFixed(1)})` : language === 'de' ? '(Keine)' : '(None)'}
            </span>
          </div>
          
          {/* Price Section */}
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-bold text-base text-foreground">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-muted-foreground line-through">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          {/* Savings indicator */}
          {savings && (
            <p className="text-[10px] text-success font-medium mt-1">
              {language === 'de' ? 'Spare' : 'Save'} {savings} €
            </p>
          )}
          
          {/* Add to Cart Button - Mobile */}
          {showAddToCart && product.inStock && (
            <button
              onClick={handleAddToCart}
              className="w-full mt-2 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all touch-manipulation active:scale-[0.98] md:hidden"
            >
              <ShoppingCart className="w-3 h-3" />
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