import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus, Truck, Shield, ArrowLeft, Loader2, Check, Package, MessageCircle, Star, RotateCcw, Clock, ChevronDown, ChevronUp, Users, Award, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import VatBreakdown from '@/components/VatBreakdown';
import SEO from '@/components/SEO';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductReviews from '@/components/ProductReviews';
import ReviewHistogram from '@/components/ReviewHistogram';
import { Button } from '@/components/ui/button';
import { useStartConversation } from '@/hooks/useStartConversation';
import { addToRecentlyViewed } from '@/components/RecentlyViewedSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const { addItem, getItemCount } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t, tCategory, language } = useLanguage();
  const { startConversation } = useStartConversation();

  const { products: relatedProducts } = useCategoryProducts(product?.category || '', { limit: 8 });
  const filteredRelated = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

  const cartItemCount = getItemCount();

  // Track recently viewed
  useEffect(() => {
    if (id) {
      addToRecentlyViewed(id);
    }
  }, [id]);

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
  const savingsPercent = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Delivery date calculation
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryDateStr = deliveryDate.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${product.name} — Noor`}
        description={product.description || `Kaufen Sie ${product.name} bei Noor. Qualitätsprodukte zu fairen Preisen.`}
        product={{
          name: product.name,
          price: product.price,
          currency: 'EUR',
          availability: product.inStock ? 'InStock' : 'OutOfStock',
          category: category ? tCategory(category.slug) : product.category,
          image: product.image,
          description: product.description || undefined,
        }}
        breadcrumbs={[
          { name: 'Home', url: 'https://noor-shop.de/' },
          { name: category ? tCategory(category.slug) : product.category, url: `https://noor-shop.de/category/${product.category}` },
          { name: product.name, url: `https://noor-shop.de/product/${product.id}` },
        ]}
      />
      <Header />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-foreground transition-colors whitespace-nowrap">{t('nav.home')}</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-foreground transition-colors whitespace-nowrap">
            {category ? tCategory(category.slug) : product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground/60 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="sticky top-24">
              <div className="relative">
                <ProductImageGallery 
                  images={product.images || [product.image]} 
                  productName={product.name} 
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.discount && (
                    <span className="bg-deal text-deal-foreground text-xs font-bold px-3 py-1.5 rounded-md">
                      -{product.discount}%
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-md">
                      {language === 'de' ? 'Ausverkauft' : 'Sold Out'}
                    </span>
                  )}
                </div>
                
                {/* Favorite Button */}
                <button 
                  onClick={() => {
                    toggleFavorite(product as any);
                    toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
                  }}
                  className="absolute top-4 right-4 p-3 rounded-full bg-card/95 backdrop-blur-sm hover:bg-card shadow-lg transition-all duration-300 hover:scale-110 z-10"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info - Scrollable */}
          <div className="lg:col-span-6 xl:col-span-5">
            {/* Category */}
            <Link 
              to={`/category/${product.category}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold hover:text-primary/80 transition-colors mb-3"
            >
              {category?.icon} {category ? tCategory(category.slug) : product.category}
            </Link>

            {/* Title */}
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating Placeholder */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(127 {language === 'de' ? 'Bewertungen' : 'Reviews'})</span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="text-sm text-success font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                1.2k+ {language === 'de' ? 'verkauft' : 'sold'}
              </span>
            </div>
            
            {/* Price Section */}
            <div className="p-5 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl mb-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-4xl font-bold text-foreground">
                  {product.price.toFixed(2)} €
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                    <span className="px-2 py-1 bg-deal/10 text-deal text-sm font-bold rounded-md">
                      -{savingsPercent}%
                    </span>
                  </>
                )}
              </div>
              {savings && (
                <p className="text-success font-semibold mt-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {language === 'de' ? 'Sie sparen' : 'You save'} {savings} €
                </p>
              )}
              <VatBreakdown price={product.price} />
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-3 p-3 rounded-lg mb-6 ${
              product.inStock ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
              <span className={`font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                {product.inStock 
                  ? (language === 'de' ? 'Auf Lager – Sofort lieferbar' : 'In Stock – Ships immediately')
                  : (language === 'de' ? 'Derzeit nicht verfügbar' : 'Currently unavailable')
                }
              </span>
            </div>

            {/* Quantity & Cart */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 bg-muted rounded-xl px-4 py-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 hover:bg-background rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-display text-xl font-bold w-10 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 hover:bg-background rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t('products.addToCart')}
                </button>
              </div>

              <Button 
                onClick={handleBuyNow}
                disabled={!product.inStock}
                size="lg"
                className="w-full py-6 text-base font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                {language === 'de' ? 'Jetzt kaufen' : 'Buy Now'}
              </Button>
            </div>

            {/* Cart Status */}
            {cartItemCount > 0 && (
              <Link 
                to="/checkout" 
                className="flex items-center justify-center gap-2 p-3 bg-primary/5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors mb-6"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartItemCount} {language === 'de' ? 'Artikel im Warenkorb' : 'items in cart'} — {language === 'de' ? 'Zur Kasse' : 'Checkout'} →
              </Link>
            )}

            {/* Delivery & Returns Box */}
            <div className="border border-border rounded-xl divide-y divide-border mb-6">
              <div className="p-4 flex items-start gap-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Truck className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {language === 'de' ? 'Kostenlose Lieferung' : 'Free Delivery'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' ? 'Lieferung bis' : 'Delivery by'} <span className="font-medium text-foreground">{deliveryDateStr}</span>
                  </p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {language === 'de' ? '14 Tage Rückgabe' : '14 Day Returns'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' ? 'Kostenlose Rücksendung' : 'Free return shipping'}
                  </p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {language === 'de' ? 'Sichere Zahlung' : 'Secure Payment'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' ? 'SSL-verschlüsselt' : 'SSL encrypted'}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Info Box */}
            {product.seller_id && (
              <div className="border border-border rounded-xl p-4 mb-6 space-y-3">
                <Link 
                  to={`/seller/${product.seller_id}`}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        {language === 'de' ? 'Verkäufer ansehen' : 'View Seller'}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ID: {product.seller_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <Button 
                  onClick={() => startConversation(product.seller_id!)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {language === 'de' ? 'Verkäufer kontaktieren' : 'Contact Seller'}
                </Button>
              </div>
            )}

            {/* Accordions */}
            <Accordion type="multiple" defaultValue={['description']} className="border border-border rounded-xl">
              <AccordionItem value="description" className="border-b border-border last:border-b-0">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50">
                  <span className="font-semibold">
                    {language === 'de' ? 'Produktbeschreibung' : 'Product Description'}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-foreground/80 leading-relaxed">
                    {product.description || (language === 'de' ? 'Keine Beschreibung verfügbar.' : 'No description available.')}
                  </p>
                  
                  {/* Product Features */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { icon: Check, text: language === 'de' ? 'Premium-Qualität' : 'Premium Quality' },
                      { icon: Award, text: language === 'de' ? 'Geprüft & Zertifiziert' : 'Verified & Certified' },
                      { icon: Package, text: language === 'de' ? 'Sichere Verpackung' : 'Secure Packaging' },
                    ].map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success text-sm rounded-full">
                        <feature.icon className="w-3.5 h-3.5" />
                        {feature.text}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-b border-border last:border-b-0">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50">
                  <span className="font-semibold">
                    {language === 'de' ? 'Versand & Lieferung' : 'Shipping & Delivery'}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span>{language === 'de' ? 'Kostenloser Versand ab 50€' : 'Free shipping over €50'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{language === 'de' ? 'Lieferzeit: 2-4 Werktage' : 'Delivery: 2-4 business days'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{language === 'de' ? 'Versand mit DHL/DPD' : 'Shipped via DHL/DPD'}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns" className="border-b-0">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50">
                  <span className="font-semibold">
                    {language === 'de' ? 'Rückgabe & Garantie' : 'Returns & Warranty'}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="w-4 h-4 text-muted-foreground" />
                    <span>{language === 'de' ? '14 Tage Widerrufsrecht' : '14-day return policy'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>{language === 'de' ? 'Volle Rückerstattung bei Mängeln' : 'Full refund for defects'}</span>
                  </div>
                  <Link to="/returns" className="text-sm text-primary hover:underline block mt-2">
                    {language === 'de' ? 'Mehr erfahren →' : 'Learn more →'}
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1.5 bg-muted text-muted-foreground text-xs rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                  {language === 'de' ? 'Das könnte Ihnen auch gefallen' : 'You May Also Like'}
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                  {language === 'de' ? 'Ähnliche Produkte' : 'Similar Products'}
                </h2>
              </div>
              <Link 
                to={`/category/${product.category}`}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {language === 'de' ? 'Alle ansehen' : 'View All'} →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
