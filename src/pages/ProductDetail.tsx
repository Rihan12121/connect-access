import { useParams, Link } from 'react-router-dom';
import { products, categories } from '@/data/products';
import { Heart, ShoppingCart, ChevronLeft, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t, tCategory } = useLanguage();

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">{t('products.notFound')}</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            {t('nav.backToHome')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const category = categories.find(c => c.slug === product.category);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${quantity}x ${product.name} ${t('products.addedToCart')}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-primary">
            {category ? tCategory(category.slug) : product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-card">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <span className="absolute top-4 left-4 badge-deal text-lg px-3 py-1">
                -{product.discount}%
              </span>
            )}
            <button 
              onClick={() => {
                toggleFavorite(product);
                toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
              }}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
            >
              <Heart className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
            </button>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-primary">{product.price.toFixed(2)} €</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</span>
              )}
            </div>

            <p className="text-muted-foreground mt-6 leading-relaxed">{product.description}</p>

            {product.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:bg-background rounded-lg transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:bg-background rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('products.addToCart')}
              </button>
            </div>

            <div className="mt-6 p-4 bg-card rounded-xl border border-border">
              <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? t('products.inStock') : t('products.outOfStock')}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">{t('products.related')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
