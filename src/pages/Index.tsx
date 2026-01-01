import { useState, useEffect } from 'react';
import { products, banners } from '@/data/products';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ModernCategoriesSection from '@/components/ModernCategoriesSection';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

const Index = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const { t, tCategory } = useLanguage();

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.discount);
  const featuredProducts = dealProducts.slice(0, 8);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Noor — E-Commerce Plattform"
        description="Entdecken Sie exklusive Qualitätsprodukte für Baby, Schönheit, Elektronik und mehr. Noor - Ihre E-Commerce Plattform für erstklassige Produkte."
      />
      <Header />

      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <Link 
              key={banner.id}
              to={banner.link}
              className="w-full flex-shrink-0 relative h-[50vh] md:h-[60vh] lg:h-[70vh]"
            >
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container max-w-6xl mx-auto px-6">
                  <div className="max-w-xl">
                    <p className="section-subheading text-primary-foreground/80 mb-4">{banner.subtitle}</p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground leading-tight">{banner.title}</h2>
                    <div className="mt-8">
                      <span className="inline-flex items-center gap-3 text-primary-foreground/90 text-sm font-medium tracking-widest uppercase hover:text-primary-foreground transition-colors group">
                        {t('categories.viewAll')} 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Banner Navigation */}
        <button 
          onClick={prevBanner}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-card/20 backdrop-blur-sm hover:bg-card/40 rounded-full text-primary-foreground transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextBanner}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-card/20 backdrop-blur-sm hover:bg-card/40 rounded-full text-primary-foreground transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Banner Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentBanner ? 'bg-primary-foreground w-8' : 'bg-primary-foreground/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <ModernCategoriesSection />

      {/* Hot Deals Section */}
      <section className="container max-w-6xl mx-auto mt-14 px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-subheading mb-2">{t('ui.limitedOffers')}</p>
            <h2 className="section-heading">{t('products.hotDeals')}</h2>
          </div>
          <Link to="/products?filter=deals" className="premium-link hidden md:flex items-center gap-2 hover-underline">
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-children">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="container max-w-6xl mx-auto mt-14 px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-subheading mb-2">{t('ui.bestseller')}</p>
            <h2 className="section-heading">{t('products.popular')}</h2>
          </div>
          <Link to="/products" className="premium-link hidden md:flex items-center gap-2 hover-underline">
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-children">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Discover All Products Button */}
      <section className="container max-w-6xl mx-auto mt-12 px-6 text-center pb-12">
        <div className="divider mx-auto mb-10" />
        <Link 
          to="/products" 
          className="btn-primary inline-flex items-center gap-3"
        >
          {t('products.discoverAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <VatNotice />

      <Footer />
    </div>
  );
};

export default Index;
