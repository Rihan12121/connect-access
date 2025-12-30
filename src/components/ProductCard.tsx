import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.discount && (
            <span className="absolute top-2 left-2 badge-deal">-{product.discount}%</span>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product);
              toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 text-sm hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-primary">{product.price.toFixed(2)} €</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</span>
          )}
        </div>
        <button 
          onClick={() => {
            addItem(product);
            toast.success(t('products.addedToCart'));
          }}
          className="w-full mt-3 btn-primary text-sm py-2"
        >
          {t('products.addToCart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
