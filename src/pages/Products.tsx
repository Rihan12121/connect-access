import { useState, useMemo } from 'react';
import { products } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'discount';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const { t } = useLanguage();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result = result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }

    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        showSearch={true}
      />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('products.discoverAll')}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredProducts.length} {t('products.count')}
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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t('search.noResults')} "{searchQuery}"</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
