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
import { ChevronDown, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

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
  }, [allProducts, filters, sortBy]);

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

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title="Alle Produkte — Noor"
        description="Entdecken Sie unsere exklusive Kollektion. Baby, Schönheit, Elektronik, Haushalt und mehr."
      />
      <Header />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Page Header - More compact and professional */}
        <div className="mb-6 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">{t('ui.collection')}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('products.discoverAll')}</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalProducts} {t('products.count')}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Button for Mobile - Centered */}
          <div className="flex justify-center lg:hidden">
            <ProductFilterSidebar
              allProducts={allProducts}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              maxPrice={maxPrice}
            />
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <ProductFilterSidebar
              allProducts={allProducts}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              maxPrice={maxPrice}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground hidden lg:inline">
                {t('ui.showAllProducts')}
              </span>
              <div className="relative ml-auto lg:ml-0">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-background text-foreground text-sm pr-6 cursor-pointer focus:outline-none font-medium min-h-[44px] touch-manipulation"
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
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Keine Produkte gefunden</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} showAddToCart />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 md:gap-2 mt-8 md:mt-12">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      className="h-11 w-11 md:h-10 md:w-10 touch-manipulation"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) => (
                        typeof page === 'number' ? (
                          <Button
                            key={index}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className="h-11 w-11 md:h-10 md:w-10 touch-manipulation"
                          >
                            {page}
                          </Button>
                        ) : (
                          <span key={index} className="px-1 md:px-2 text-muted-foreground">
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
                      className="h-11 w-11 md:h-10 md:w-10 touch-manipulation"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {totalPages > 1 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Seite {currentPage} von {totalPages}
                  </p>
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
