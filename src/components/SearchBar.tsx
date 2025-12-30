import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SEARCH_HISTORY_KEY = 'noor-search-history';
const MAX_HISTORY = 5;

const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  const { t } = useLanguage();
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

  // Save search to history - saves the search term only
  const saveToHistory = (term: string) => {
    if (!term.trim()) return;
    
    // Save only the search term, not product names
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
  const suggestions = searchQuery.trim()
    ? products
        .filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

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
    // Save the current search query to history, not the product name
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
    }
  };

  const showDropdown = isFocused && (searchQuery.trim() || searchHistory.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-header-foreground/50" />
        <input
          ref={inputRef}
          type="text"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-header-foreground/10 rounded-xl pl-12 pr-10 py-3 text-header-foreground placeholder:text-header-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-header-foreground/50 hover:text-header-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50">
          {/* Suggestions */}
          {searchQuery.trim() && suggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground uppercase font-medium">
                <TrendingUp className="w-4 h-4" />
                {t('search.suggestions')}
              </div>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => handleSelectSuggestion(product.name)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.price.toFixed(2)} €</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No results */}
          {searchQuery.trim() && suggestions.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {t('search.noResults')} "{searchQuery}"
            </div>
          )}

          {/* Search History */}
          {!searchQuery.trim() && searchHistory.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-medium">
                  <Clock className="w-4 h-4" />
                  {t('search.history')}
                </span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-primary hover:underline"
                >
                  {t('search.clearHistory')}
                </button>
              </div>
              {searchHistory.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectHistory(term)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
