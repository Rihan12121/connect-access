import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = false }: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} ${t('products.addedToCart')}`);
  };

  return (
    <div className="product-card group">
      <div onClick={handleClick} className="block cursor-pointer touch-manipulation">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
          
          {product.discount && (
            <span className="absolute top-2 left-2 md:top-3 md:left-3 badge-deal text-[10px] md:text-xs">
              -{product.discount}%
            </span>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product);
              toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
            }}
            className="absolute top-2 right-2 md:top-3 md:right-3 p-3 md:p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card shadow-soft transition-all duration-300 hover:scale-110 touch-manipulation active:scale-95"
          >
            <Heart className={`w-5 h-5 md:w-4 md:h-4 transition-colors ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>
      <div className="p-3 md:p-5">
        <div onClick={handleClick} className="cursor-pointer touch-manipulation">
          <h3 className="font-body font-medium text-foreground line-clamp-2 text-sm md:text-base leading-relaxed group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </div>
        <div className="flex items-baseline gap-1.5 md:gap-2 mt-2 md:mt-3">
          <span className="font-display text-lg md:text-xl font-semibold text-foreground">{product.price.toFixed(2)} €</span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</span>
          )}
        </div>
        
        {/* Add to Cart Button - only shown when showAddToCart is true */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-4 py-3 md:py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity touch-manipulation active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            {t('products.addToCart')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
