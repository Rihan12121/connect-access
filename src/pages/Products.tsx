import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, SortOption } from '@/hooks/useProducts';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import ProductFilterSidebar, { ProductFilters } from '@/components/ProductFilterSidebar';
import { ChevronDown, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const { t, language } = useLanguage();

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  // Fetch all products for filtering
  const { products: allProducts, isLoading } = useProducts({});

  // Calculate max price for filter
  const maxPrice = useMemo(() => {
    if (allProducts.length === 0) return 500;
    return Math.ceil(Math.max(...allProducts.map(p => p.price)));
  }, [allProducts]);

  // Initialize filters
  const [filters, setFilters] = useState<ProductFilters>({
    priceRange: [0, 500],
    categories: [],
    tags: [],
    onlyInStock: false,
    onlyDeals: searchParams.get('filter') === 'deals',
  });

  // Update max price in filters when products load
  useEffect(() => {
    if (maxPrice > 0 && filters.priceRange[1] === 500) {
      setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
    }
  }, [maxPrice]);

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter(p => p.tags?.some(tag => filters.tags.includes(tag)));
    }

    // Filter by stock
    if (filters.onlyInStock) {
      result = result.filter(p => p.inStock);
    }

    // Filter by deals
    if (filters.onlyDeals) {
      result = result.filter(p => p.discount && p.discount > 0);
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, filters, sortBy, searchQuery]);

  // Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.categories.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.onlyInStock) count++;
    if (filters.onlyDeals) count++;
    return count;
  }, [filters, maxPrice]);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title={searchQuery ? `Suche: ${searchQuery} — Noor` : "Alle Produkte — Noor"}
        description="Entdecken Sie unsere exklusive Kollektion. Baby, Schönheit, Elektronik, Haushalt und mehr."
      />
      <Header />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">
              {searchQuery ? (language === 'de' ? 'Suchergebnisse' : 'Search Results') : t('ui.collection')}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {searchQuery ? `"${searchQuery}"` : t('products.discoverAll')}
            </h1>
          </div>
          
          {/* Stats & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{totalProducts}</span> {language === 'de' ? 'Produkte' : 'Products'}
              </span>
              {activeFiltersCount > 0 && (
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {activeFiltersCount} {language === 'de' ? 'Filter aktiv' : 'filters active'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Grid Toggle - Desktop */}
              <div className="hidden lg:flex items-center gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-2 rounded-md transition-colors ${gridCols === 2 ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded-md transition-colors ${gridCols === 3 ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded-md transition-colors ${gridCols === 4 ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-card border border-border text-foreground text-sm pl-4 pr-10 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-medium transition-all"
                >
                  <option value="default">{language === 'de' ? 'Empfohlen' : 'Recommended'}</option>
                  <option value="price-asc">{language === 'de' ? 'Preis: Niedrig → Hoch' : 'Price: Low → High'}</option>
                  <option value="price-desc">{language === 'de' ? 'Preis: Hoch → Niedrig' : 'Price: High → Low'}</option>
                  <option value="discount">{language === 'de' ? 'Größte Ersparnis' : 'Biggest Savings'}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Button for Mobile */}
          <div className="lg:hidden">
            <ProductFilterSidebar
              allProducts={allProducts}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              maxPrice={maxPrice}
            />
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block flex-shrink-0">
            <ProductFilterSidebar
              allProducts={allProducts}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              maxPrice={maxPrice}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Products Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground text-sm">
                  {language === 'de' ? 'Produkte werden geladen...' : 'Loading products...'}
                </p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  {searchQuery ? <Search className="w-10 h-10 text-muted-foreground" /> : <Package className="w-10 h-10 text-muted-foreground" />}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {language === 'de' ? 'Keine Produkte gefunden' : 'No products found'}
                </h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  {searchQuery 
                    ? (language === 'de' ? `Keine Ergebnisse für "${searchQuery}". Versuchen Sie andere Suchbegriffe.` : `No results for "${searchQuery}". Try different search terms.`)
                    : (language === 'de' ? 'Passen Sie Ihre Filter an, um mehr Produkte zu sehen.' : 'Adjust your filters to see more products.')
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ priceRange: [0, maxPrice], categories: [], tags: [], onlyInStock: false, onlyDeals: false })}
                >
                  {language === 'de' ? 'Filter zurücksetzen' : 'Reset Filters'}
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 md:gap-6 ${
                  gridCols === 2 ? 'grid-cols-2' : 
                  gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' : 
                  'grid-cols-2 lg:grid-cols-4'
                }`}>
                  {paginatedProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                    >
                      <ProductCard product={product} showAddToCart />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPrevPage}
                        className="h-11 w-11 rounded-xl"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          typeof page === 'number' ? (
                            <Button
                              key={index}
                              variant={currentPage === page ? 'default' : 'ghost'}
                              size="icon"
                              onClick={() => handlePageChange(page)}
                              className={`h-11 w-11 rounded-xl ${currentPage === page ? 'shadow-md' : ''}`}
                            >
                              {page}
                            </Button>
                          ) : (
                            <span key={index} className="px-2 text-muted-foreground">
                              {page}
                            </span>
                          )
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className="h-11 w-11 rounded-xl"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {language === 'de' ? 'Seite' : 'Page'} {currentPage} {language === 'de' ? 'von' : 'of'} {totalPages}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Products;
