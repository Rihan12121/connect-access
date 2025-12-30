import { useState, useMemo } from 'react';
import { categories, products } from '@/data/products';
import { ChevronRight, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'sonner';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, tCategory } = useLanguage();
  const { addItem, getItemCount } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

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
  const featuredProducts = searchQuery ? filteredProducts : dealProducts.slice(0, 6);
  const cartCount = getItemCount();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-header text-header-foreground shadow-elevated">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Noor</span>
            </Link>

            <div className="flex items-center gap-2">
              <button className="icon-btn text-header-foreground hover:bg-header-foreground/10 relative">
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-favorite text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button className="icon-btn text-header-foreground hover:bg-header-foreground/10 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="pb-3">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-header-foreground/10 rounded-xl px-4 py-3 text-header-foreground placeholder:text-header-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="container max-w-6xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('categories.browse')}</h2>
          <span className="text-primary text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline">
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.slice(0, 8).map((category) => (
            <div key={category.slug} className="category-chip min-w-[100px]">
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium text-center">{tCategory(category.slug)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          {searchQuery ? `${t('search.resultsFor')} "${searchQuery}"` : t('products.hotDeals')}
        </h2>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="relative aspect-square">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.discount && (
                    <span className="absolute top-2 left-2 badge-deal">-{product.discount}%</span>
                  )}
                  <button 
                    onClick={() => {
                      toggleFavorite(product);
                      toast.success(isFavorite(product.id) ? t('favorites.removed') : t('favorites.added'));
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-favorite text-favorite' : 'text-muted-foreground'}`} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground line-clamp-2 text-sm">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-primary">{product.price.toFixed(2)} €</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</span>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      addItem(product);
                      toast.success(t('products.addedToCart'));
                    }}
                    className="w-full mt-3 btn-primary text-sm py-2"
                  >
                    {t('products.addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t('search.noResults')} "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-2xl font-bold text-foreground">Noor</p>
          <p className="text-muted-foreground text-sm mt-2">{t('footer.description')}</p>
          <p className="text-sm text-muted-foreground mt-4">© 2024 Noor. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
