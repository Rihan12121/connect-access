import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ChevronDown, SlidersHorizontal, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCategoryProducts, SortOption } from '@/hooks/useProducts';
import { categories, subcategories } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import CategoryIcon from '@/components/CategoryIcon';
import SEO from '@/components/SEO';

type FilterOption = 'all' | 'deals' | 'inStock';

const Category = () => {
  const { slug } = useParams();
  const category = categories.find(c => c.slug === slug);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { t, tCategory } = useLanguage();

  const categorySubcategories = subcategories.filter(s => s.category === slug);

  const { products: allCategoryProducts, isLoading } = useCategoryProducts(slug || '', {
    sortBy,
    onlyDeals: filter === 'deals',
    onlyInStock: filter === 'inStock',
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-4">{t('categories.notFound')}</h1>
          <Link to="/categories" className="premium-link inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Alle Kategorien
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${tCategory(category.slug)} — Noor`}
        description={`Entdecken Sie unsere ${tCategory(category.slug)} Kollektion bei Noor.`}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={category.image} 
          alt={tCategory(category.slug)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/30" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container max-w-6xl mx-auto px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-3 text-xs text-primary-foreground/60 mb-6 tracking-wide uppercase">
              <Link to="/" className="hover:text-primary-foreground transition-colors">{t('nav.home')}</Link>
              <span>/</span>
              <Link to="/categories" className="hover:text-primary-foreground transition-colors">Kategorien</Link>
              <span>/</span>
              <span className="text-primary-foreground">{tCategory(category.slug)}</span>
            </nav>
            
            <div className="flex items-center gap-4">
              <CategoryIcon slug={category.slug} size="lg" className="shadow-xl" />
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground">
                  {tCategory(category.slug)}
                </h1>
                <p className="text-primary-foreground/70 mt-2">
                  {allCategoryProducts.length} Produkte
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-6 py-10">
        {/* Subcategories */}
        {categorySubcategories.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
              {t('categories.subcategories')}
            </p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {categorySubcategories.map(sub => (
                <button 
                  key={sub.slug}
                  className="px-5 py-2.5 bg-card border border-border text-foreground rounded-md text-sm font-medium whitespace-nowrap hover:border-primary hover:text-primary transition-all duration-300"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300
                ${showFilters 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border text-foreground hover:border-primary'
                }
              `}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('filter.title')}
            </button>
            
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-medium"
              >
                {filter === 'deals' ? t('filter.dealsOnly') : t('filter.inStock')}
                <X className="w-3 h-3" />
              </button>
            )}
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

        {/* Filter Options */}
        {showFilters && (
          <div className="py-6 border-b border-border animate-in">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Filter
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: t('filter.all') },
                { value: 'deals', label: t('filter.dealsOnly') },
                { value: 'inStock', label: t('filter.inStock') },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as FilterOption)}
                  className={`
                    px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300
                    ${filter === option.value 
                      ? 'bg-primary text-primary-foreground shadow-glow' 
                      : 'bg-card border border-border text-foreground hover:border-primary'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : allCategoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 mt-10 stagger-children">
            {allCategoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t('search.noResults')}</p>
            <button
              onClick={() => setFilter('all')}
              className="premium-link mt-4 inline-block"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Category;
