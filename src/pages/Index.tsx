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
  const { products: popularProducts, isLoading: popularLoading } = useProducts({ limit: 4 });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Noor — E-Commerce Plattform"
        description="Entdecken Sie exklusive Qualitätsprodukte für Baby, Schönheit, Elektronik und mehr. Noor - Ihre E-Commerce Plattform für erstklassige Produkte."
      />
      <Header />

      {/* Hero Banner Carousel - Now managed by admins */}
      <HeroSection />

      {/* Categories Section */}
      <ModernCategoriesSection />

      {/* Hot Deals Section */}
      <section className="container max-w-6xl mx-auto mt-20 px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">{t('products.hotDeals')}</h2>
          </div>
          <Link to="/products?filter=deals" className="premium-link hidden md:flex items-center gap-2 group">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-children">
          {dealsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))
          ) : (
            dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="container max-w-6xl mx-auto mt-20 px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">{t('products.popular')}</h2>
          </div>
          <Link to="/products" className="premium-link hidden md:flex items-center gap-2 group">
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-children">
          {popularLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))
          ) : (
            popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Discover All Products Button */}
      <section className="container max-w-6xl mx-auto mt-16 px-6 text-center pb-12">
        <div className="divider mx-auto mb-12" />
        <Link 
          to="/products" 
          className="btn-primary inline-flex items-center gap-3 text-base"
        >
          <Sparkles className="w-5 h-5" />
          {t('products.discoverAll')}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <VatNotice />

      <Footer />
    </div>
  );
};

export default Index;
