import { useState, useEffect, useCallback } from 'react';
import { Category, categories as defaultCategories } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'category_order';

export const useCategoryOrder = () => {
  const [orderedCategories, setOrderedCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);

  // Load order from localStorage (or could be from Supabase later)
  useEffect(() => {
    const loadOrder = () => {
      try {
        const savedOrder = localStorage.getItem(STORAGE_KEY);
        if (savedOrder) {
          const orderArray: string[] = JSON.parse(savedOrder);
          const reordered = orderArray
            .map(slug => defaultCategories.find(c => c.slug === slug))
            .filter((c): c is Category => c !== undefined);
          
          // Add any new categories that weren't in the saved order
          const existingSlugs = new Set(orderArray);
          const newCategories = defaultCategories.filter(c => !existingSlugs.has(c.slug));
          
          setOrderedCategories([...reordered, ...newCategories]);
        }
      } catch (error) {
        console.error('Error loading category order:', error);
      }
      setIsLoading(false);
    };

    loadOrder();
  }, []);

  const saveOrder = useCallback((categories: Category[]) => {
    const orderArray = categories.map(c => c.slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orderArray));
    setOrderedCategories(categories);
  }, []);

  const reorderCategories = useCallback((fromIndex: number, toIndex: number) => {
    const newOrder = [...orderedCategories];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    saveOrder(newOrder);
  }, [orderedCategories, saveOrder]);

  const resetOrder = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setOrderedCategories(defaultCategories);
  }, []);

  return {
    categories: orderedCategories,
    isLoading,
    reorderCategories,
    resetOrder,
  };
};
