import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Product, useProducts } from './useProducts';

interface BrowsingData {
  categories: Record<string, number>;
  productIds: string[];
}

// Track category browsing in localStorage
export const trackCategoryView = (category: string) => {
  const stored = localStorage.getItem('categoryBrowsing');
  let data: Record<string, number> = {};
  
  try {
    data = stored ? JSON.parse(stored) : {};
  } catch {
    data = {};
  }
  
  data[category] = (data[category] || 0) + 1;
  localStorage.setItem('categoryBrowsing', JSON.stringify(data));
};

// Get browsing history from localStorage
const getBrowsingData = (): BrowsingData => {
  const categories: Record<string, number> = {};
  const productIds: string[] = [];
  
  try {
    const catData = localStorage.getItem('categoryBrowsing');
    if (catData) {
      Object.assign(categories, JSON.parse(catData));
    }
    
    const recentViewed = localStorage.getItem('recentlyViewed');
    if (recentViewed) {
      productIds.push(...JSON.parse(recentViewed));
    }
  } catch {
    // Ignore parse errors
  }
  
  return { categories, productIds };
};

export const usePersonalizedRecommendations = (limit = 8) => {
  const { user } = useAuth();
  const { products: allProducts, isLoading: productsLoading } = useProducts({ limit: 100 });
  const [purchasedCategories, setPurchasedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch purchase history for logged-in users
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

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
              const categories = [...new Set(products.map(p => p.category))];
              setPurchasedCategories(categories);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
      
      setLoading(false);
    };

    fetchPurchaseHistory();
  }, [user]);

  // Generate personalized recommendations
  const recommendations = useMemo(() => {
    if (productsLoading || allProducts.length === 0) return [];

    const browsingData = getBrowsingData();
    const recentlyViewedIds = new Set(browsingData.productIds);
    
    // Score each product based on personalization factors
    const scoredProducts = allProducts
      .filter(p => !recentlyViewedIds.has(p.id)) // Exclude recently viewed
      .map(product => {
        let score = 0;
        
        // Boost for categories user has browsed (weight: browsing frequency)
        const categoryBrowseCount = browsingData.categories[product.category] || 0;
        score += categoryBrowseCount * 10;
        
        // Boost for categories user has purchased from
        if (purchasedCategories.includes(product.category)) {
          score += 50;
        }
        
        // Boost for products with discount
        if (product.discount && product.discount > 0) {
          score += product.discount;
        }
        
        // Small random factor for variety
        score += Math.random() * 5;
        
        return { product, score };
      });

    // Sort by score and return top products
    scoredProducts.sort((a, b) => b.score - a.score);
    
    return scoredProducts.slice(0, limit).map(sp => sp.product);
  }, [allProducts, productsLoading, purchasedCategories, limit]);

  // Get "continue shopping" suggestion - products from most browsed category
  const continueShopping = useMemo(() => {
    if (productsLoading || allProducts.length === 0) return [];

    const browsingData = getBrowsingData();
    const categories = Object.entries(browsingData.categories);
    
    if (categories.length === 0) return [];
    
    // Find most browsed category
    categories.sort((a, b) => b[1] - a[1]);
    const topCategory = categories[0][0];
    
    const recentlyViewedIds = new Set(browsingData.productIds);
    
    return allProducts
      .filter(p => p.category === topCategory && !recentlyViewedIds.has(p.id))
      .slice(0, 4);
  }, [allProducts, productsLoading]);

  return {
    recommendations,
    continueShopping,
    loading: loading || productsLoading,
    hasBrowsingHistory: Object.keys(getBrowsingData().categories).length > 0,
  };
};
