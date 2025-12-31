import { useState } from 'react';
import { products } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

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
        title="Alle Produkte"
        description="Entdecke alle Produkte bei Noor Shop - Baby, Schönheit, Elektronik, Haushalt und mehr zu fairen Preisen."
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('products.discoverAll')}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {sortedProducts.length} {t('products.count')}
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border-none outline-none cursor-pointer"
          >
            <option value="default">{t('sort.default')}</option>
            <option value="price-asc">{t('sort.priceAsc')}</option>
            <option value="price-desc">{t('sort.priceDesc')}</option>
            <option value="discount">{t('sort.discount')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
