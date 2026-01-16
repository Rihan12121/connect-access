import { useState, useMemo } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp, Sparkles, Tag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/context/LanguageContext';
import { useCategoryOrder } from '@/hooks/useCategoryOrder';
import { Product } from '@/hooks/useProducts';

export interface ProductFilters {
  priceRange: [number, number];
  categories: string[];
  tags: string[];
  onlyInStock: boolean;
  onlyDeals: boolean;
}

interface ProductFilterSidebarProps {
  allProducts: Product[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  maxPrice: number;
}

const ProductFilterSidebar = ({ allProducts, filters, onFiltersChange, maxPrice }: ProductFilterSidebarProps) => {
  const { language } = useLanguage();
  const { categories } = useCategoryOrder();
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    tags: false,
    availability: true,
  });

  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allProducts.forEach(product => {
      product.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [allProducts]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleCategoryToggle = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter(c => c !== categorySlug)
      : [...filters.categories, categorySlug];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleStockToggle = (checked: boolean) => {
    onFiltersChange({ ...filters, onlyInStock: checked });
  };

  const handleDealsToggle = (checked: boolean) => {
    onFiltersChange({ ...filters, onlyDeals: checked });
  };

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, maxPrice],
      categories: [],
      tags: [],
      onlyInStock: false,
      onlyDeals: false,
    });
  };

  const activeFiltersCount = 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    filters.categories.length +
    filters.tags.length +
    (filters.onlyInStock ? 1 : 0) +
    (filters.onlyDeals ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button 
          onClick={clearFilters} 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
          {language === 'de' ? 'Filter zurücksetzen' : 'Clear filters'} ({activeFiltersCount})
        </button>
      )}

      {/* Price Range */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-sm font-semibold"
        >
          {language === 'de' ? 'Preisspanne' : 'Price Range'}
          {expandedSections.price ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-4 pt-4">
            <Slider
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={handlePriceChange}
              min={0}
              max={maxPrice}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <div className="px-3 py-1.5 bg-muted rounded-lg text-sm font-medium">
                {filters.priceRange[0]} €
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="px-3 py-1.5 bg-muted rounded-lg text-sm font-medium">
                {filters.priceRange[1]} €
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-sm font-semibold"
        >
          {language === 'de' ? 'Kategorien' : 'Categories'}
          {expandedSections.categories ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2 pt-4 max-h-56 overflow-y-auto">
            {categories.map(category => (
              <label 
                key={category.id} 
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                  filters.categories.includes(category.slug) 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted'
                }`}
              >
                <Checkbox
                  id={`category-${category.slug}`}
                  checked={filters.categories.includes(category.slug)}
                  onCheckedChange={() => handleCategoryToggle(category.slug)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm flex-1">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      {uniqueTags.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-sm font-semibold"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              Tags
            </span>
            {expandedSections.tags ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {expandedSections.tags && (
            <div className="flex flex-wrap gap-2 pt-4">
              {uniqueTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                    filters.tags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-muted border-transparent hover:border-primary/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Availability */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-sm font-semibold"
        >
          {language === 'de' ? 'Verfügbarkeit' : 'Availability'}
          {expandedSections.availability ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.availability && (
          <div className="space-y-2 pt-4">
            <label className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
              filters.onlyInStock ? 'bg-success/10 border border-success/20' : 'hover:bg-muted'
            }`}>
              <Checkbox
                id="only-in-stock"
                checked={filters.onlyInStock}
                onCheckedChange={handleStockToggle}
                className="data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
              <span className="text-sm flex-1">
                {language === 'de' ? 'Nur verfügbar' : 'In stock only'}
              </span>
              {filters.onlyInStock && <Check className="w-4 h-4 text-success" />}
            </label>
            <label className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
              filters.onlyDeals ? 'bg-deal/10 border border-deal/20' : 'hover:bg-muted'
            }`}>
              <Checkbox
                id="only-deals"
                checked={filters.onlyDeals}
                onCheckedChange={handleDealsToggle}
                className="data-[state=checked]:bg-deal data-[state=checked]:border-deal"
              />
              <span className="text-sm flex-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-deal" />
                {language === 'de' ? 'Nur Angebote' : 'Deals only'}
              </span>
              {filters.onlyDeals && <Check className="w-4 h-4 text-deal" />}
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-28 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
            {language === 'de' ? 'Filter & Sortieren' : 'Filter & Sort'}
          </h3>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden gap-2 w-full justify-center rounded-xl h-12">
            <SlidersHorizontal className="w-4 h-4" />
            {language === 'de' ? 'Filter' : 'Filters'}
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] sm:w-[380px]">
          <SheetHeader>
            <SheetTitle className="text-left">{language === 'de' ? 'Filter' : 'Filters'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductFilterSidebar;
