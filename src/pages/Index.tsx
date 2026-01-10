import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
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
  const { t } = useLanguage();

  const { products: dealProducts, isLoading: dealsLoading } = useDealProducts(8);
  const { products: popularProducts, isLoading: popularLoading } = useProducts({ limit: 8 });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Noor — E-Commerce Plattform"
        description="Entdecken Sie exklusive Qualitätsprodukte für Baby, Schönheit, Elektronik und mehr. Noor - Ihre E-Commerce Plattform für erstklassige Produkte."
      />
      <Header />

      {/* Hero Banner Carousel */}
      <HeroSection />

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
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Entdecken Sie unser gesamtes Sortiment
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-sm md:text-base">
            Hunderte von Produkten warten auf Sie. Von Premium-Qualität bis hin zu unschlagbaren Preisen.
          </p>
          <Link 
            to="/products" 
            className="btn-primary inline-flex items-center gap-3"
          >
            {t('products.discoverAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <div className="pb-8 md:pb-12" />
      
      <VatNotice />

      <Footer />
    </div>
  );
};

export default Index;
