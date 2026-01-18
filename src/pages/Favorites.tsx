import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, SortAsc, Grid3X3, Grid2X2, Trash2, Share2, ShoppingCart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

type SortOption = 'added' | 'price-low' | 'price-high' | 'name' | 'discount';

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();
  const { t, language } = useLanguage();
  const [sortBy, setSortBy] = useState<SortOption>('added');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);

  const sortedFavorites = useMemo(() => {
    const sorted = [...favorites];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'discount':
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:
        return sorted;
    }
  }, [favorites, sortBy]);

  const handleAddAllToCart = () => {
    favorites.forEach(product => addItem(product as any));
    toast.success(language === 'de' 
      ? `${favorites.length} Artikel zum Warenkorb hinzugefügt` 
      : `${favorites.length} items added to cart`
    );
  };

  const handleClearAll = () => {
    favorites.forEach(product => removeFavorite(product.id));
    toast.success(language === 'de' ? 'Alle Favoriten entfernt' : 'All favorites removed');
  };

  const handleShare = async () => {
    const text = language === 'de' 
      ? `Schau dir meine Wunschliste bei Noor an!` 
      : `Check out my wishlist at Noor!`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Noor Wishlist', text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(language === 'de' ? 'Link kopiert!' : 'Link copied!');
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Favoriten — Noor" description="Ihre Lieblings-Produkte bei Noor" />
        <Header />
        
        <div className="container max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
              {language === 'de' ? 'Ihre Wunschliste ist leer' : 'Your wishlist is empty'}
            </h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              {language === 'de' 
                ? 'Speichern Sie Ihre Lieblingsprodukte, um sie später einfach wiederzufinden.' 
                : 'Save your favorite products to easily find them later.'}
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-3">
              {language === 'de' ? 'Produkte entdecken' : 'Discover Products'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recently Viewed Section */}
        <div className="py-12">
          <RecentlyViewedSection />
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Favoriten — Noor" description="Ihre Lieblings-Produkte bei Noor" />
      <Header />

      <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">
              {language === 'de' ? 'Ihre Auswahl' : 'Your Selection'}
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              {language === 'de' ? 'Wunschliste' : 'Wishlist'}
              <span className="text-muted-foreground ml-3">({favorites.length})</span>
            </h1>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              {language === 'de' ? 'Teilen' : 'Share'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              {language === 'de' ? 'Alle entfernen' : 'Clear All'}
            </Button>
            <Button
              size="sm"
              onClick={handleAddAllToCart}
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {language === 'de' ? 'Alle in den Warenkorb' : 'Add All to Cart'}
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="added">
                    {language === 'de' ? 'Zuletzt hinzugefügt' : 'Recently Added'}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {language === 'de' ? 'Preis: Aufsteigend' : 'Price: Low to High'}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {language === 'de' ? 'Preis: Absteigend' : 'Price: High to Low'}
                  </SelectItem>
                  <SelectItem value="name">
                    {language === 'de' ? 'Name: A-Z' : 'Name: A-Z'}
                  </SelectItem>
                  <SelectItem value="discount">
                    {language === 'de' ? 'Höchster Rabatt' : 'Biggest Discount'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setGridCols(2)}
              className={`p-2 rounded-md transition-colors ${gridCols === 2 ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`p-2 rounded-md transition-colors ${gridCols === 3 ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-2 rounded-md transition-colors ${gridCols === 4 ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-current rounded-[1px]" />
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-4 md:gap-6 ${
          gridCols === 2 ? 'grid-cols-2' : 
          gridCols === 3 ? 'grid-cols-2 md:grid-cols-3' : 
          'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {sortedFavorites.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-in fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} showAddToCart />
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {language === 'de' ? 'Gesamtwert Ihrer Wunschliste' : 'Wishlist Total Value'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {favorites.length} {language === 'de' ? 'Artikel' : 'items'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display font-bold text-foreground">
                {favorites.reduce((sum, p) => sum + p.price, 0).toFixed(2)} €
              </p>
              {favorites.some(p => p.originalPrice) && (
                <p className="text-sm text-success">
                  {language === 'de' ? 'Sie sparen' : 'You save'}: {favorites.reduce((sum, p) => sum + ((p.originalPrice || p.price) - p.price), 0).toFixed(2)} €
                </p>
              )}
            </div>
          </div>
        </div>

        <VatNotice />
      </div>

      {/* Continue Shopping Section */}
      <div className="bg-muted/30 py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <RecentlyViewedSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
