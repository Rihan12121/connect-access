import { Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div onClick={handleClick} className="block cursor-pointer">
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
      </div>
      <div className="p-4">
        <div onClick={handleClick} className="cursor-pointer">
          <h3 className="font-medium text-foreground line-clamp-2 text-sm hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
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
