import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles, Store, Users, TrendingUp, Shield } from 'lucide-react';
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

      {/* Multi-Vendor Stats Banner */}
      <section className="container max-w-6xl mx-auto mt-6 md:mt-10 px-4 md:px-6">
        <div className="bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-2xl p-4 md:p-6 border border-primary/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Store className="w-5 h-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">500+</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                {language === 'de' ? 'Verifizierte Anbieter' : 'Verified Vendors'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">10K+</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                {language === 'de' ? 'Produkte' : 'Products'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">50K+</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                {language === 'de' ? 'Zufriedene Kunden' : 'Happy Customers'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">100%</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                {language === 'de' ? 'Käuferschutz' : 'Buyer Protection'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <ModernCategoriesSection />

      {/* Hot Deals Section */}
      <section className="container max-w-6xl mx-auto mt-10 md:mt-16 px-4 md:px-6">
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <div>
            <p className="section-subheading mb-1">{t('products.limitedOffer') || 'Limitierte Angebote'}</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{t('products.hotDeals')}</h2>
          </div>
          <Link to="/products?filter=deals" className="premium-link hidden md:flex items-center gap-2 group">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 stagger-children">
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

      {/* Features Banner */}
      <section className="container max-w-6xl mx-auto mt-12 md:mt-20 px-4 md:px-6">
        <div className="bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base">Premium Qualität</h3>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">Nur das Beste</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base">Schneller Versand</h3>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">1-3 Werktage</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base">Sicher bezahlen</h3>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">SSL verschlüsselt</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base">14 Tage Rückgabe</h3>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">Kostenlos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="container max-w-6xl mx-auto mt-12 md:mt-20 px-4 md:px-6">
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <div>
            <p className="section-subheading mb-1">{t('products.trending') || 'Beliebt'}</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{t('products.popular')}</h2>
          </div>
          <Link to="/products" className="premium-link hidden md:flex items-center gap-2 group">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 stagger-children">
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
      <section className="container max-w-6xl mx-auto mt-12 md:mt-20 px-4 md:px-6">
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {language === 'de' ? 'Marktplatz' : 'Marketplace'}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
                {language === 'de' 
                  ? 'Entdecken Sie die Vielfalt unserer Anbieter'
                  : 'Discover the variety of our vendors'}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm md:text-base">
                {language === 'de'
                  ? 'Hunderte verifizierter Händler bieten Ihnen eine riesige Auswahl an Qualitätsprodukten. Von Premium-Qualität bis hin zu unschlagbaren Preisen.'
                  : 'Hundreds of verified merchants offer you a huge selection of quality products. From premium quality to unbeatable prices.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/products" 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {t('products.discoverAll')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/categories" 
                  className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {language === 'de' ? 'Kategorien ansehen' : 'View Categories'}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'de' ? 'Händler' : 'Vendors'}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">10K+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'de' ? 'Produkte' : 'Products'}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'de' ? 'Kunden' : 'Customers'}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'de' ? 'Sicher' : 'Secure'}
                </p>
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
