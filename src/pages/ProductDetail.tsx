import { useParams, Link } from 'react-router-dom';
import { products, categories } from '@/data/products';
import { Heart, ShoppingCart, Minus, Plus, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductReviews from '@/components/ProductReviews';

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
        <div className="container max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">{t('products.notFound')}</h1>
          <Link to="/" className="premium-link mt-6 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
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

  const savings = product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${product.name} — Noor`}
        description={product.description || `Kaufen Sie ${product.name} bei Noor. Qualitätsprodukte zu fairen Preisen.`}
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-xs text-muted-foreground mb-10 tracking-wide">
          <Link to="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
          <span className="text-border">/</span>
          <Link to={`/category/${product.category}`} className="hover:text-foreground transition-colors">
            {category ? tCategory(category.slug) : product.category}
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground/60 line-clamp-1 max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Section */}
          <div className="relative group">
            <ProductImageGallery 
              images={product.images || [product.image]} 
              productName={product.name} 
            />
            
            {/* Badges */}
            {product.discount && (
              <div className="absolute top-4 left-4 bg-deal text-deal-foreground text-xs font-semibold px-3 py-1.5 rounded-md uppercase tracking-wider z-10">
                -{product.discount}% Rabatt
              </div>
            )}
            
            {/* Favorite Button */}
            <button 
              onClick={() => {
                toggleFavorite(product);
                toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
              }}
              className="absolute top-4 right-4 p-3 rounded-full bg-card/95 backdrop-blur-sm hover:bg-card shadow-card transition-all duration-300 hover:scale-110 z-10"
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex flex-col lg:py-4">
            {/* Category */}
            <Link 
              to={`/category/${product.category}`}
              className="section-subheading text-primary hover:text-primary/80 transition-colors mb-4 w-fit"
            >
              {category ? tCategory(category.slug) : product.category}
            </Link>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-tight">
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-4 mt-6">
              <span className="font-display text-4xl font-semibold text-foreground">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Savings */}
            {savings && (
              <p className="text-sm text-success font-medium mt-2">
                {t('ui.youSave')} {savings} €
              </p>
            )}

            {/* Divider */}
            <div className="divider my-8" />

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs rounded-md font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-10">
              <div className="flex items-center justify-center gap-4 bg-secondary rounded-lg px-4 py-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:bg-background rounded-md transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-display text-xl font-semibold w-10 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:bg-background rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-4 flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-4 h-4" />
                {t('products.addToCart')}
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mt-6">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-destructive'}`} />
              <span className={`text-sm font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                {product.inStock ? t('products.inStock') : t('products.outOfStock')}
              </span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 pt-8 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Truck className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('ui.freeShippingFrom')}</p>
                  <p className="text-xs text-muted-foreground">{t('ui.from50')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Shield className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('ui.securePaymentTitle')}</p>
                  <p className="text-xs text-muted-foreground">{t('ui.sslEncryption')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <div className="mb-10">
              <p className="section-subheading mb-2">{t('ui.mayAlsoLike')}</p>
              <h2 className="section-heading">{t('products.related')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 stagger-children">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Product Reviews */}
        <ProductReviews productId={product.id} />

        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
