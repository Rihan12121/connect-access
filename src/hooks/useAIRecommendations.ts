import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Product, useProducts } from './useProducts';

interface UserContext {
  browsedCategories: Record<string, number>;
  purchasedCategories: string[];
  recentlyViewed: string[];
  searchQueries: string[];
}

// Track search queries in localStorage
export const trackSearchQuery = (query: string) => {
  if (!query || query.length < 2) return;
  
  const stored = localStorage.getItem('searchQueries');
  let queries: string[] = [];
  
  try {
    queries = stored ? JSON.parse(stored) : [];
  } catch {
    queries = [];
  }
  
  // Add to front, dedupe, limit to 20
  queries = [query, ...queries.filter(q => q !== query)].slice(0, 20);
  localStorage.setItem('searchQueries', JSON.stringify(queries));
};

// Get browsing history from localStorage
const getUserContext = (): UserContext => {
  const context: UserContext = {
    browsedCategories: {},
    purchasedCategories: [],
    recentlyViewed: [],
    searchQueries: [],
  };
  
  try {
    const catData = localStorage.getItem('categoryBrowsing');
    if (catData) {
      context.browsedCategories = JSON.parse(catData);
    }
    
    const recentViewed = localStorage.getItem('recentlyViewed');
    if (recentViewed) {
      context.recentlyViewed = JSON.parse(recentViewed);
    }
    
    const searchQueries = localStorage.getItem('searchQueries');
    if (searchQueries) {
      context.searchQueries = JSON.parse(searchQueries);
    }
  } catch {
    // Ignore parse errors
  }
  
  return context;
};

export const useAIRecommendations = (limit = 8) => {
  const { user } = useAuth();
  const { products: allProducts, isLoading: productsLoading } = useProducts({ limit: 100 });
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasoning, setReasoning] = useState<string>('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (productsLoading || allProducts.length === 0) return;

      setLoading(true);
      
      const userContext = getUserContext();
      
      // Fetch purchase history for logged-in users
      if (user) {
        try {
          const { data: orders } = await supabase
            .from('orders')
            .select('id')
            .eq('user_id', user.id);

          if (orders && orders.length > 0) {
            const orderIds = orders.map(o => o.id);
            
            const { data: orderItems } = await supabase
              .from('order_items')
              .select('product_id')
              .in('order_id', orderIds);

            if (orderItems && orderItems.length > 0) {
              const productIds = orderItems.map(i => i.product_id);
              
              const { data: products } = await supabase
                .from('products')
                .select('category')
                .in('id', productIds);

              if (products) {
                userContext.purchasedCategories = [...new Set(products.map(p => p.category))];
              }
            }
          }
        } catch (error) {
          console.error('Error fetching purchase history:', error);
        }
      }

      try {
        const { data, error } = await supabase.functions.invoke('ai-recommendations', {
          body: {
            products: allProducts,
            userContext,
            limit,
          },
        });

        if (error) {
          console.error('AI recommendations error:', error);
          setAiRecommendations([]);
        } else {
          setAiRecommendations(data.recommendations || []);
          setReasoning(data.reasoning || '');
        }
      } catch (error) {
        console.error('Failed to fetch AI recommendations:', error);
        setAiRecommendations([]);
      }
      
      setLoading(false);
    };

    fetchRecommendations();
  }, [user, allProducts, productsLoading, limit]);

  // Similar products based on AI analysis
  const getSimilarProducts = useMemo(() => {
    return (productId: string, count = 4): Product[] => {
      const product = allProducts.find(p => p.id === productId);
      if (!product) return [];

      // Find products in same category with similar price range
      const priceRange = product.price * 0.3;
      
      return allProducts
        .filter(p => 
          p.id !== productId &&
          (p.category === product.category ||
           (product.tags && p.tags && product.tags.some(t => p.tags?.includes(t))))
        )
        .sort((a, b) => {
          // Score by category match and price similarity
          const aScore = (a.category === product.category ? 10 : 0) +
            (1 / (1 + Math.abs(a.price - product.price) / priceRange));
          const bScore = (b.category === product.category ? 10 : 0) +
            (1 / (1 + Math.abs(b.price - product.price) / priceRange));
          return bScore - aScore;
        })
        .slice(0, count);
    };
  }, [allProducts]);

  // "Frequently bought together" simulation
  const frequentlyBoughtTogether = useMemo(() => {
    return (productId: string, count = 3): Product[] => {
      const product = allProducts.find(p => p.id === productId);
      if (!product) return [];

      // Find complementary products (different category but similar tags or price range)
      return allProducts
        .filter(p => 
          p.id !== productId &&
          p.category !== product.category &&
          p.price < product.price * 1.5
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
    };
  }, [allProducts]);

  return {
    recommendations: aiRecommendations,
    loading: loading || productsLoading,
    reasoning,
    getSimilarProducts,
    frequentlyBoughtTogether,
    hasBrowsingHistory: Object.keys(getUserContext().browsedCategories).length > 0,
  };
};
