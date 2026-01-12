import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus, Truck, Shield, ArrowLeft, Loader2, Check, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { useProduct, useCategoryProducts } from '@/hooks/useProducts';
import { categories } from '@/data/products';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductReviews from '@/components/ProductReviews';
import { Button } from '@/components/ui/button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const { addItem, getItemCount } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t, tCategory, language } = useLanguage();

  const { products: relatedProducts } = useCategoryProducts(product?.category || '', { limit: 4 });
  const filteredRelated = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

  const cartItemCount = getItemCount();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-6xl mx-auto px-6 py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product as any);
    }
    toast.success(`${quantity}x ${product.name} ${t('products.addedToCart')}`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product as any);
    }
    navigate('/checkout');
  };

  const savings = product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : null;

  // Professional product features
  const productFeatures = [
    { icon: Check, text: language === 'de' ? 'Premium-Qualität' : 'Premium Quality' },
    { icon: Shield, text: language === 'de' ? 'Geprüft & Zertifiziert' : 'Verified & Certified' },
    { icon: Package, text: language === 'de' ? 'Sichere Verpackung' : 'Secure Packaging' },
  ];

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
                -{product.discount}%
              </div>
            )}
            
            {/* Favorite Button */}
            <button 
              onClick={() => {
                toggleFavorite(product as any);
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
              className="text-xs uppercase tracking-widest text-primary font-medium hover:text-primary/80 transition-colors mb-3 w-fit"
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

            {/* Stock Status */}
            <div className="flex items-center gap-2 mt-4">
              <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-success' : 'bg-destructive'}`} />
              <span className={`text-sm font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                {product.inStock ? t('products.inStock') : t('products.outOfStock')}
              </span>
            </div>

            {/* Divider */}
            <div className="divider my-6" />

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {language === 'de' ? 'Produktbeschreibung' : 'Product Description'}
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Features */}
            <div className="flex flex-wrap gap-3 mt-6">
              {productFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
                  <feature.icon className="w-3.5 h-3.5 text-success" />
                  {feature.text}
                </div>
              ))}
            </div>

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
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 bg-secondary rounded-lg px-4 py-3">
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

              {/* Buy Now / Checkout Button */}
              <Button 
                onClick={handleBuyNow}
                variant="outline"
                size="lg"
                className="w-full py-4 text-base font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {language === 'de' ? 'Jetzt kaufen' : 'Buy Now'}
              </Button>

              {/* Cart Status */}
              {cartItemCount > 0 && (
                <Link 
                  to="/checkout" 
                  className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemCount} {language === 'de' ? 'Artikel im Warenkorb' : 'items in cart'} — {language === 'de' ? 'Zur Kasse' : 'Checkout'}
                </Link>
              )}
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-border">
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
        {filteredRelated.length > 0 && (
          <section className="mt-24">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">{t('ui.mayAlsoLike')}</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{t('products.related')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {filteredRelated.map(product => (
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
