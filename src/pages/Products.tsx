import { useState } from 'react';
import { products } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import { ChevronDown } from 'lucide-react';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'discount';

const Products = () => {
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const { t } = useLanguage();

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Alle Produkte — Noor"
        description="Entdecken Sie unsere exklusive Kollektion. Baby, Schönheit, Elektronik, Haushalt und mehr."
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-12 md:mb-16">
          <p className="section-subheading mb-3">{t('ui.collection')}</p>
          <h1 className="section-heading">{t('products.discoverAll')}</h1>
          <p className="text-muted-foreground text-sm mt-3">
            {sortedProducts.length} {t('products.count')}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div className="text-sm text-muted-foreground">
            {t('ui.showAllProducts')}
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-transparent text-foreground text-sm pr-6 cursor-pointer focus:outline-none font-medium"
            >
              <option value="default">{t('sort.default')}</option>
              <option value="price-asc">{t('sort.priceAsc')}</option>
              <option value="price-desc">{t('sort.priceDesc')}</option>
              <option value="discount">{t('sort.discount')}</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-children">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Products;
