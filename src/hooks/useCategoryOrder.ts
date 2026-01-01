import { useState, useEffect, useCallback } from 'react';
import { Category, categories as defaultCategories } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCategoryOrder = () => {
  const [orderedCategories, setOrderedCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load order from database
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('category_order')
          .select('slug, position')
          .order('position', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const reordered = data
            .map(item => defaultCategories.find(c => c.slug === item.slug))
            .filter((c): c is Category => c !== undefined);
          
          // Add any new categories that weren't in the saved order
          const existingSlugs = new Set(data.map(d => d.slug));
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

  const saveOrder = useCallback(async (categories: Category[]) => {
    setOrderedCategories(categories);
    
    try {
      // Update all positions in database
      const updates = categories.map((cat, index) => ({
        slug: cat.slug,
        position: index + 1,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('category_order')
          .update({ position: update.position })
          .eq('slug', update.slug);
        
        if (error) throw error;
      }

      toast({
        title: 'Gespeichert',
        description: 'Kategorien-Reihenfolge wurde aktualisiert.',
      });
    } catch (error) {
      console.error('Error saving category order:', error);
      toast({
        title: 'Fehler',
        description: 'Reihenfolge konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const reorderCategories = useCallback((fromIndex: number, toIndex: number) => {
    const newOrder = [...orderedCategories];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    saveOrder(newOrder);
  }, [orderedCategories, saveOrder]);

  const resetOrder = useCallback(async () => {
    try {
      const updates = defaultCategories.map((cat, index) => ({
        slug: cat.slug,
        position: index + 1,
      }));

      for (const update of updates) {
        await supabase
          .from('category_order')
          .update({ position: update.position })
          .eq('slug', update.slug);
      }

      setOrderedCategories(defaultCategories);
      toast({
        title: 'Zurückgesetzt',
        description: 'Kategorien-Reihenfolge wurde zurückgesetzt.',
      });
    } catch (error) {
      console.error('Error resetting order:', error);
    }
  }, [toast]);

  return {
    categories: orderedCategories,
    isLoading,
    reorderCategories,
    resetOrder,
  };
};
