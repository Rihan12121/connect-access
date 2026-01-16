import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts } from '@/hooks/useProducts';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SEARCH_HISTORY_KEY = 'noor-search-history';
const MAX_HISTORY = 5;

const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { allProducts } = useProducts({});
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load search history');
      }
    }
  }, []);

  // Save search to history
  const saveToHistory = (term: string) => {
    if (!term.trim()) return;
    
    const searchTerm = term.trim();
    const newHistory = [searchTerm, ...searchHistory.filter(h => h.toLowerCase() !== searchTerm.toLowerCase())].slice(0, MAX_HISTORY);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  // Get suggestions based on input
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allProducts
      .filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      )
      .slice(0, 6);
  }, [searchQuery, allProducts]);

  // Popular searches
  const popularSearches = useMemo(() => {
    const categories = [...new Set(allProducts.map(p => p.category))].slice(0, 4);
    return categories;
  }, [allProducts]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (productName: string) => {
    if (searchQuery.trim()) {
      saveToHistory(searchQuery.trim());
    }
    onSearchChange('');
    setIsFocused(false);
  };

  const handleSelectHistory = (term: string) => {
    onSearchChange(term);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      saveToHistory(searchQuery.trim());
      setIsFocused(false);
      // Navigate to products page with search
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const showDropdown = isFocused && (searchQuery.trim() || searchHistory.length > 0 || popularSearches.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-header-foreground/40 group-focus-within:text-primary transition-colors" />
        <input
          ref={inputRef}
          type="text"
          placeholder={language === 'de' ? 'Was suchen Sie heute?' : 'What are you looking for?'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-header-foreground/5 border border-header-foreground/10 rounded-xl pl-12 pr-12 py-3.5 text-sm text-header-foreground placeholder:text-header-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-header-foreground/10 focus:ring-2 focus:ring-primary/10 transition-all duration-300"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-header-foreground/40 hover:text-header-foreground hover:bg-header-foreground/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-header-foreground/5 text-header-foreground/30 text-[10px] font-medium">
            ⌘K
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Suggestions */}
          {searchQuery.trim() && suggestions.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
                <Sparkles className="w-3 h-3" />
                {language === 'de' ? 'Vorschläge' : 'Suggestions'}
              </div>
              <div className="space-y-1">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => handleSelectSuggestion(product.name)}
                    className="flex items-center gap-4 px-3 py-3 hover:bg-muted rounded-xl transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{product.price.toFixed(2)} €</p>
                      {product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* View All Results */}
              <Link
                to={`/products?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setIsFocused(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 mt-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
              >
                {language === 'de' ? 'Alle Ergebnisse anzeigen' : 'View all results'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* No results */}
          {searchQuery.trim() && suggestions.length === 0 && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {language === 'de' ? 'Keine Ergebnisse für' : 'No results for'} "{searchQuery}"
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {language === 'de' ? 'Versuchen Sie einen anderen Suchbegriff' : 'Try a different search term'}
              </p>
            </div>
          )}

          {/* Search History & Popular */}
          {!searchQuery.trim() && (
            <div className="p-3 space-y-4">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
                      <Clock className="w-3 h-3" />
                      {language === 'de' ? 'Letzte Suchen' : 'Recent Searches'}
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-[10px] text-primary hover:underline uppercase tracking-wider font-medium"
                    >
                      {language === 'de' ? 'Löschen' : 'Clear'}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectHistory(term)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors text-left group"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              {popularSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
                    <TrendingUp className="w-3 h-3" />
                    {language === 'de' ? 'Beliebte Kategorien' : 'Popular Categories'}
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 py-2">
                    {popularSearches.map((category, idx) => (
                      <Link
                        key={idx}
                        to={`/category/${category}`}
                        onClick={() => setIsFocused(false)}
                        className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
