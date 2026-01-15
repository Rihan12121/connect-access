import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import TrustBadges from '@/components/TrustBadges';
import FlashDealsSection from '@/components/FlashDealsSection';
import FeaturedBanner from '@/components/FeaturedBanner';
import PopularCategoriesGrid from '@/components/PopularCategoriesGrid';
import ProductShowcase from '@/components/ProductShowcase';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';
import NewsletterSection from '@/components/NewsletterSection';

const Index = () => {
  const { t, language } = useLanguage();

  // Fetch different product sets - no duplicates
  const { products: allProducts, isLoading: productsLoading } = useProducts({ limit: 24 });
  
  // Split products into different sections to avoid repetition
  const popularProducts = allProducts.slice(0, 8);
  const newArrivals = allProducts.slice(8, 16);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Noor — Marktplatz für Premium-Produkte"
        description="Entdecken Sie tausende Produkte von verifizierten Anbietern. Noor - Ihr Marktplatz für Qualität, Vielfalt und beste Preise."
      />
      <Header />

      {/* Hero Banner Carousel */}
      <HeroSection />

      {/* Trust Badges - Right after hero for credibility */}
      <section className="container max-w-6xl mx-auto mt-8 md:mt-12 px-4 md:px-6">
        <TrustBadges />
      </section>

      {/* Flash Deals with Countdown */}
      <div className="mt-12 md:mt-16">
        <FlashDealsSection />
      </div>

      {/* Popular Categories Grid - Visual hierarchy */}
      <div className="mt-12 md:mt-20">
        <PopularCategoriesGrid />
      </div>

      {/* Featured Banner - New Arrivals */}
      <section className="container max-w-6xl mx-auto mt-12 md:mt-16 px-4 md:px-6">
        <FeaturedBanner variant="primary" />
      </section>

      {/* Popular Products Carousel */}
      <div className="mt-12 md:mt-16">
        <ProductShowcase
          title={t('products.popular')}
          subtitle={language === 'de' ? 'Bestseller' : 'Bestsellers'}
          products={popularProducts}
          isLoading={productsLoading}
          viewAllLink="/products"
          showAddToCart
        />
      </div>

      {/* Featured Banner - Trending */}
      <section className="container max-w-6xl mx-auto mt-12 md:mt-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FeaturedBanner variant="secondary" />
          <FeaturedBanner variant="accent" />
        </div>
      </section>

      {/* New Arrivals */}
      <div className="mt-12 md:mt-16">
        <ProductShowcase
          title={language === 'de' ? 'Neu eingetroffen' : 'New Arrivals'}
          subtitle={language === 'de' ? 'Frisch für Sie' : 'Fresh for You'}
          products={newArrivals}
          isLoading={productsLoading}
          viewAllLink="/products"
        />
      </div>

      {/* Recently Viewed - Personalized */}
      <div className="mt-12 md:mt-16">
        <RecentlyViewedSection />
      </div>

      {/* Newsletter Signup */}
      <div className="mt-12 md:mt-20">
        <NewsletterSection />
      </div>

      {/* CTA Section */}
      <section className="container max-w-6xl mx-auto mt-12 md:mt-20 px-4 md:px-6">
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
