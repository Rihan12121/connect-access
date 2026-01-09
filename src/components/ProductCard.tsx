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
        <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-t-lg">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
          
          {product.discount && (
            <span className="absolute top-3 left-3 badge-deal text-xs font-bold px-2.5 py-1">
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
            className="absolute top-3 right-3 p-3 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card shadow-soft transition-all duration-300 hover:scale-110 touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div onClick={handleClick} className="cursor-pointer touch-manipulation min-h-[48px] flex items-start">
          <h3 className="font-body font-medium text-foreground line-clamp-2 text-sm leading-relaxed group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </div>
        <div className="flex flex-col gap-0.5 mt-2">
          <span className="font-display text-xl font-bold text-foreground">{product.price.toFixed(2)} €</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</span>
          )}
        </div>
        
        {/* Add to Cart Button - only shown when showAddToCart is true */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-4 py-3.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity touch-manipulation active:scale-[0.98] min-h-[48px]"
          >
            <ShoppingCart className="w-5 h-5" />
            {t('products.addToCart')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
