import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ModernCategoriesSection from '@/components/ModernCategoriesSection';
import HeroSection from '@/components/HeroSection';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import { products } from '@/data/products';

const Index = () => {
  const { t } = useLanguage();

  const dealProducts = products.filter(p => p.discount);
  const featuredProducts = dealProducts.slice(0, 8);

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
