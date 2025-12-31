import { useState, useEffect } from 'react';
import { categories, products, banners } from '@/data/products';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryIcon from '@/components/CategoryIcon';

const Index = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const { t, tCategory } = useLanguage();

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.discount);
  const featuredProducts = dealProducts.slice(0, 8);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <Link 
              key={banner.id}
              to={banner.link}
              className="w-full flex-shrink-0 relative h-48 md:h-72 lg:h-80"
            >
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container max-w-6xl mx-auto px-4">
                  <p className="text-primary font-bold text-sm md:text-base">{banner.subtitle}</p>
                  <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mt-2">{banner.title}</h2>
                  <span className="inline-flex items-center gap-2 mt-4 text-white text-sm font-medium hover:text-primary transition-colors">
                    {t('categories.viewAll')} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Banner Navigation */}
        <button 
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Banner Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentBanner ? 'bg-primary' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container max-w-6xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('categories.browse')}</h2>
          <Link to="/categories" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              to={`/category/${category.slug}`}
              className="category-chip min-w-[100px]"
            >
              <CategoryIcon slug={category.slug} size="sm" />
              <span className="text-xs font-medium text-center">{tCategory(category.slug)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Deals */}
      <section className="container max-w-6xl mx-auto mt-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('products.hotDeals')}</h2>
          <Link to="/products?filter=deals" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container max-w-6xl mx-auto mt-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('products.popular')}</h2>
          <Link to="/products" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Discover All Products Button */}
      <section className="container max-w-6xl mx-auto mt-12 px-4 text-center">
        <Link 
          to="/products" 
          className="btn-primary inline-flex items-center gap-2 px-8 py-3"
        >
          {t('products.discoverAll')}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-muted-foreground text-xs mt-4">
          Alle Preise inklusive gesetzlicher MwSt, zzgl Versandkosten
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
