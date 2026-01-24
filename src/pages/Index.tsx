import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Shield, Users, TrendingUp, Settings2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import FlashDealsSection from '@/components/FlashDealsSection';
import FeaturedBanner from '@/components/FeaturedBanner';
import PopularCategoriesGrid from '@/components/PopularCategoriesGrid';
import ProductShowcase from '@/components/ProductShowcase';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import AIRecommendations from '@/components/AIRecommendations';
import HomepageEditor from '@/components/admin/HomepageEditor';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { t, language } = useLanguage();
  const { isAdmin } = useIsAdmin();
  const [showEditor, setShowEditor] = useState(false);

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

      {/* Admin Edit Mode Button */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowEditor(true)}
            size="lg"
            className="rounded-full shadow-lg gap-2"
          >
            <Settings2 className="w-5 h-5" />
            {language === 'de' ? 'Seite bearbeiten' : 'Edit Page'}
          </Button>
        </div>
      )}

      {/* Homepage Editor Sheet */}
      <HomepageEditor isOpen={showEditor} onClose={() => setShowEditor(false)} />

      {/* Hero Banner Carousel */}
      <HeroSection />


      {/* Flash Deals with Countdown */}
      <div className="mt-12 md:mt-20">
        <FlashDealsSection />
      </div>

      {/* Popular Categories Grid - Visual hierarchy */}
      <div className="mt-16 md:mt-24">
        <PopularCategoriesGrid />
      </div>

      {/* Featured Banner - New Arrivals */}
      <section className="container max-w-6xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
        <FeaturedBanner variant="primary" />
      </section>

      {/* Popular Products Carousel */}
      <div className="mt-16 md:mt-24">
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
      <section className="container max-w-6xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FeaturedBanner variant="secondary" />
          <FeaturedBanner variant="accent" />
        </div>
      </section>

      {/* New Arrivals */}
      <div className="mt-16 md:mt-24">
        <ProductShowcase
          title={language === 'de' ? 'Neu eingetroffen' : 'New Arrivals'}
          subtitle={language === 'de' ? 'Frisch für Sie' : 'Fresh for You'}
          products={newArrivals}
          isLoading={productsLoading}
          viewAllLink="/products"
        />
      </div>

      {/* AI-Powered Recommendations */}
      <div className="mt-16 md:mt-24">
        <AIRecommendations />
      </div>

      {/* Personalized Recommendations */}
      <div className="mt-16 md:mt-24">
        <PersonalizedRecommendations />
      </div>

      {/* Recently Viewed - Personalized */}
      <div className="mt-16 md:mt-24">
        <RecentlyViewedSection />
      </div>

      {/* CTA Section - Premium Design */}
      <section className="container max-w-6xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
        <div className="relative overflow-hidden bg-header text-header-foreground rounded-3xl">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(var(--primary)/0.2),transparent_40%)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative p-10 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                    {language === 'de' ? 'Premium Marktplatz' : 'Premium Marketplace'}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">
                  {language === 'de' 
                    ? 'Erleben Sie Shopping auf einem neuen Level'
                    : 'Experience Shopping on a New Level'}
                </h2>
                <p className="text-header-foreground/70 text-lg mb-8 leading-relaxed max-w-lg">
                  {language === 'de'
                    ? 'Tausende Premium-Produkte von verifizierten Händlern. Beste Qualität, faire Preise und schneller Versand.'
                    : 'Thousands of premium products from verified merchants. Best quality, fair prices and fast shipping.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    {language === 'de' ? 'Jetzt entdecken' : 'Explore Now'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/categories" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-header-foreground/10 border border-header-foreground/20 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-header-foreground/20 transition-colors"
                  >
                    {language === 'de' ? 'Kategorien' : 'Categories'}
                  </Link>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-header-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-header-foreground/10">
                  <TrendingUp className="w-8 h-8 text-primary mb-4" />
                  <p className="font-display text-3xl font-bold">1000+</p>
                  <p className="text-header-foreground/60 text-sm">
                    {language === 'de' ? 'Produkte' : 'Products'}
                  </p>
                </div>
                <div className="bg-header-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-header-foreground/10">
                  <Users className="w-8 h-8 text-emerald-400 mb-4" />
                  <p className="font-display text-3xl font-bold">50K+</p>
                  <p className="text-header-foreground/60 text-sm">
                    {language === 'de' ? 'Kunden' : 'Customers'}
                  </p>
                </div>
                <div className="bg-header-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-header-foreground/10">
                  <Star className="w-8 h-8 text-amber-400 mb-4" />
                  <p className="font-display text-3xl font-bold">4.9</p>
                  <p className="text-header-foreground/60 text-sm">
                    {language === 'de' ? 'Bewertung' : 'Rating'}
                  </p>
                </div>
                <div className="bg-header-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-header-foreground/10">
                  <Shield className="w-8 h-8 text-blue-400 mb-4" />
                  <p className="font-display text-3xl font-bold">100%</p>
                  <p className="text-header-foreground/60 text-sm">
                    {language === 'de' ? 'Sicher' : 'Secure'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12 md:pb-16" />
      
      <VatNotice />

      <Footer />
    </div>
  );
};

export default Index;
