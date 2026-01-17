import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Shield, Truck, Award, Users, TrendingUp, ChevronRight } from 'lucide-react';
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

  // Stats for social proof
  const stats = [
    { 
      icon: Users, 
      value: '50.000+', 
      label: language === 'de' ? 'Zufriedene Kunden' : 'Happy Customers',
      color: 'text-primary'
    },
    { 
      icon: Star, 
      value: '4.9/5', 
      label: language === 'de' ? 'Durchschnittliche Bewertung' : 'Average Rating',
      color: 'text-amber-500'
    },
    { 
      icon: Shield, 
      value: '100%', 
      label: language === 'de' ? 'Sichere Zahlung' : 'Secure Payment',
      color: 'text-emerald-500'
    },
    { 
      icon: Truck, 
      value: '2-3', 
      label: language === 'de' ? 'Tage Lieferzeit' : 'Days Delivery',
      color: 'text-blue-500'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Noor — Marktplatz für Premium-Produkte"
        description="Entdecken Sie tausende Produkte von verifizierten Anbietern. Noor - Ihr Marktplatz für Qualität, Vielfalt und beste Preise."
      />
      <Header />

      {/* Hero Banner Carousel */}
      <HeroSection />

      {/* Stats Bar - Social Proof */}
      <section className="bg-card border-y border-border">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-center gap-3 py-6 md:py-8">
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                <div>
                  <p className="font-display text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges - Right after hero for credibility */}
      <section className="container max-w-6xl mx-auto mt-10 md:mt-16 px-4 md:px-6">
        <TrustBadges />
      </section>

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

      {/* Value Proposition Section */}
      <section className="container max-w-6xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 border border-primary/20 group hover:border-primary/40 transition-all">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
              {language === 'de' ? 'Premium Qualität' : 'Premium Quality'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === 'de' 
                ? 'Nur geprüfte Produkte von verifizierten Händlern. Jeder Artikel durchläuft unsere Qualitätskontrolle.'
                : 'Only verified products from trusted sellers. Every item goes through our quality control.'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl p-8 border border-emerald-500/20 group hover:border-emerald-500/40 transition-all">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
              {language === 'de' ? 'Käuferschutz' : 'Buyer Protection'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === 'de' 
                ? 'Geld-zurück-Garantie bei allen Bestellungen. Ihr Einkauf ist bei uns vollständig abgesichert.'
                : 'Money-back guarantee on all orders. Your purchase is fully protected with us.'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-2xl p-8 border border-blue-500/20 group hover:border-blue-500/40 transition-all">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
              {language === 'de' ? 'Schneller Versand' : 'Fast Shipping'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === 'de' 
                ? 'Kostenloser Versand ab 50€. Express-Lieferung in 2-3 Werktagen direkt zu Ihnen.'
                : 'Free shipping over €50. Express delivery in 2-3 business days directly to you.'}
            </p>
          </div>
        </div>
      </section>

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

      {/* Recently Viewed - Personalized */}
      <div className="mt-16 md:mt-24">
        <RecentlyViewedSection />
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 md:mt-24">
        <NewsletterSection />
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
