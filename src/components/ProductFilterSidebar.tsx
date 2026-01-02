import { useState, useMemo } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
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
  const { t } = useLanguage();
  const { categories } = useCategoryOrder();
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    tags: true,
    availability: true,
  });

  // Get unique tags from all products
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
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full gap-2">
          <X className="w-4 h-4" />
          Filter zurücksetzen ({activeFiltersCount})
        </Button>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-sm font-medium"
        >
          Preisspanne
          {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-4 pt-2">
            <Slider
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={handlePriceChange}
              min={0}
              max={maxPrice}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filters.priceRange[0]}€</span>
              <span>{filters.priceRange[1]}€</span>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-sm font-medium"
        >
          Kategorien
          {expandedSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.slug}`}
                  checked={filters.categories.includes(category.slug)}
                  onCheckedChange={() => handleCategoryToggle(category.slug)}
                />
                <Label
                  htmlFor={`category-${category.slug}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      {uniqueTags.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-sm font-medium"
          >
            Tags
            {expandedSections.tags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.tags && (
            <div className="flex flex-wrap gap-2 pt-2">
              {uniqueTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.tags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50'
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
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-sm font-medium"
        >
          Verfügbarkeit
          {expandedSections.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.availability && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-in-stock"
                checked={filters.onlyInStock}
                onCheckedChange={handleStockToggle}
              />
              <Label htmlFor="only-in-stock" className="text-sm cursor-pointer">
                Nur verfügbare Artikel
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-deals"
                checked={filters.onlyDeals}
                onCheckedChange={handleDealsToggle}
              />
              <Label htmlFor="only-deals" className="text-sm cursor-pointer">
                Nur Angebote
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Filter
          </h3>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductFilterSidebar;
