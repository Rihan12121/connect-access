import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useDealProducts, useProducts } from '@/hooks/useProducts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ModernCategoriesSection from '@/components/ModernCategoriesSection';
import HeroSection from '@/components/HeroSection';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

const Index = () => {
  const { t, language } = useLanguage();

  const { products: dealProducts, isLoading: dealsLoading } = useDealProducts(8);
  const { products: popularProducts, isLoading: popularLoading } = useProducts({ limit: 8 });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Noor — Marktplatz für Premium-Produkte"
        description="Entdecken Sie tausende Produkte von verifizierten Anbietern. Noor - Ihr Marktplatz für Qualität, Vielfalt und beste Preise."
      />
      <Header />

      {/* Hero Banner Carousel */}
      <HeroSection />

      {/* Categories Section */}
      <ModernCategoriesSection />

      {/* Hot Deals Section */}
      <section className="container max-w-6xl mx-auto mt-12 md:mt-20 px-4 md:px-6">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">
              {language === 'de' ? 'Limitierte Angebote' : 'Limited Offers'}
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{t('products.hotDeals')}</h2>
          </div>
          <Link to="/products?filter=deals" className="premium-link hidden md:flex items-center gap-2 group">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {dealsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-xl" />
            ))
          ) : (
            dealProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link to="/products?filter=deals" className="premium-link inline-flex items-center gap-2">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature Banner - Unified */}
      <section className="container max-w-6xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/20 rounded-2xl border border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
          <div className="relative p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'de' ? 'Käuferschutz' : 'Buyer Protection'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? '100% sicher einkaufen' : '100% safe shopping'}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'de' ? 'Schneller Versand' : 'Fast Shipping'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? '1-3 Werktage' : '1-3 business days'}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'de' ? '14 Tage Rückgabe' : '14 Days Return'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Kostenlos' : 'Free of charge'}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'de' ? 'Sichere Zahlung' : 'Secure Payment'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'SSL verschlüsselt' : 'SSL encrypted'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="container max-w-6xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">
              {language === 'de' ? 'Beliebt' : 'Trending'}
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{t('products.popular')}</h2>
          </div>
          <Link to="/products" className="premium-link hidden md:flex items-center gap-2 group">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {popularLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-xl" />
            ))
          ) : (
            popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link to="/products" className="premium-link inline-flex items-center gap-2">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-6xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-accent/20 border border-border rounded-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="relative p-8 md:p-14">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-widest">
                  {language === 'de' ? 'Marktplatz' : 'Marketplace'}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                {language === 'de' 
                  ? 'Entdecken Sie Premium-Produkte'
                  : 'Discover Premium Products'}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {language === 'de'
                  ? 'Tausende Produkte von verifizierten Händlern warten auf Sie. Premium-Qualität, faire Preise und schneller Versand.'
                  : 'Thousands of products from verified merchants await you. Premium quality, fair prices and fast shipping.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {language === 'de' ? 'Alle Produkte' : 'All Products'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/categories" 
                  className="px-5 py-2.5 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  {language === 'de' ? 'Kategorien' : 'Categories'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-8 md:pb-12" />
      
      <VatNotice />

      <Footer />
    </div>
  );
};

export default Index;
