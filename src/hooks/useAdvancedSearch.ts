import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SearchResult {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string;
  category: string;
  score: number;
}

// Generate unique session ID for analytics
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('search_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('search_session_id', sessionId);
  }
  return sessionId;
};

export const useAdvancedSearch = () => {
  const { user } = useAuth();

  // Fuzzy search with scoring
  const fuzzySearch = useCallback((products: any[], query: string): SearchResult[] => {
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    
    if (searchTerms.length === 0) return [];

    const results: SearchResult[] = [];

    products.forEach((product) => {
      const name = (product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const tags = (product.tags || []).join(' ').toLowerCase();
      
      let score = 0;

      searchTerms.forEach((term) => {
        // Exact match in name (highest weight)
        if (name === term) score += 100;
        else if (name.startsWith(term)) score += 50;
        else if (name.includes(term)) score += 25;

        // Match in description
        if (description.includes(term)) score += 10;

        // Match in category
        if (category === term) score += 30;
        else if (category.includes(term)) score += 15;

        // Match in tags
        if (tags.includes(term)) score += 20;

        // Fuzzy matching using Levenshtein-like approach
        const words = name.split(/\s+/);
        words.forEach((word) => {
          if (word.length > 2 && term.length > 2) {
            const similarity = calculateSimilarity(word, term);
            if (similarity > 0.7) {
              score += Math.floor(similarity * 30);
            }
          }
        });
      });

      if (score > 0) {
        results.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          score,
        });
      }
    });

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
  }, []);

  // Simple string similarity calculation
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    // Count matching characters
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }
    
    return matches / longer.length;
  };

  // Track search analytics
  const trackSearch = useCallback(async (
    query: string, 
    resultsCount: number, 
    clickedProductId?: string
  ) => {
    try {
      await supabase.from('search_analytics').insert({
        query: query.trim().toLowerCase(),
        results_count: resultsCount,
        clicked_product_id: clickedProductId || null,
        user_id: user?.id || null,
        session_id: getSessionId(),
      });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }, [user]);

  // Track product click from search
  const trackClick = useCallback(async (query: string, productId: string) => {
    await trackSearch(query, -1, productId); // -1 indicates this is a click event
  }, [trackSearch]);

  // Get search suggestions based on history
  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    if (query.length < 2) return [];

    const { data } = await supabase
      .from('search_analytics')
      .select('query')
      .ilike('query', `${query}%`)
      .limit(5);

    if (!data) return [];

    // Get unique queries
    const unique = [...new Set(data.map((d) => d.query))];
    return unique.slice(0, 5);
  }, []);

  return {
    fuzzySearch,
    trackSearch,
    trackClick,
    getSuggestions,
  };
};

// Hook for caching with React Query-like behavior
export const useSearchCache = () => {
  const cache = useMemo(() => new Map<string, { data: any; timestamp: number }>(), []);
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const get = useCallback((key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return null;
  }, [cache]);

  const set = useCallback((key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
  }, [cache]);

  const invalidate = useCallback((key?: string) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }, [cache]);

  return { get, set, invalidate };
};
