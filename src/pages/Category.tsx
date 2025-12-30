import { useParams, Link } from 'react-router-dom';
import { products, categories, subcategories } from '@/data/products';
import { useState, useMemo } from 'react';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'discount';

const Category = () => {
  const { slug } = useParams();
  const category = categories.find(c => c.slug === slug);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);
  const { t, tCategory } = useLanguage();

  const categorySubcategories = subcategories.filter(s => s.category === slug);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.category === slug);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result = [...result].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }

    return result;
  }, [slug, searchQuery, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header showSearch={false} />
        <div className="container max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">{t('categories.notFound')}</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            {t('nav.backToHome')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        showSearch={true}
      />

      {/* Hero */}
      <div 
        className="relative h-40 md:h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="container max-w-6xl mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-2">
            <Link to="/" className="hover:text-white">{t('nav.home')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{tCategory(category.slug)}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">{category.icon}</span>
            {tCategory(category.slug)}
          </h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Subcategories */}
        {categorySubcategories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
            {categorySubcategories.map(sub => (
              <button 
                key={sub.slug}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Filters & Sort */}
        <div className="flex items-center justify-between py-4 border-b border-border">
          <p className="text-muted-foreground text-sm">
            {filteredProducts.length} {t('products.count')}
          </p>
          <div className="flex items-center gap-3">
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
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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

export default Category;
