import { useState, useMemo } from 'react';
import { categories, products } from '@/data/products';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, tCategory } = useLanguage();

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const dealProducts = products.filter(p => p.discount);
  const featuredProducts = searchQuery ? filteredProducts : dealProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        showSearch={true}
      />

      {/* Categories */}
      <section className="container max-w-6xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('categories.browse')}</h2>
          <Link to="/categories" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.slice(0, 8).map((category) => (
            <Link 
              key={category.slug} 
              to={`/category/${category.slug}`}
              className="category-chip min-w-[100px]"
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium text-center">{tCategory(category.slug)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Deals / Search Results */}
      <section className="container max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          {searchQuery ? `${t('search.resultsFor')} "${searchQuery}"` : t('products.hotDeals')}
        </h2>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t('search.noResults')} "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Discover All Products */}
      {!searchQuery && (
        <section className="container max-w-6xl mx-auto mt-16 px-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('products.discoverAll')}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t('products.discoverDescription')}
            </p>
            <Link 
              to="/categories" 
              className="btn-primary inline-flex items-center gap-2 px-8 py-3"
            >
              {t('categories.viewAll')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Popular Products */}
      {!searchQuery && (
        <section className="container max-w-6xl mx-auto mt-12 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('products.popular')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
