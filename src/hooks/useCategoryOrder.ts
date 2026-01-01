import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  position: number;
  is_active: boolean;
}

export const useCategoryOrder = () => {
  const [categories, setCategories] = useState<DatabaseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const reorderCategories = useCallback(async (fromIndex: number, toIndex: number) => {
    const newOrder = [...categories];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    
    // Optimistic update
    setCategories(newOrder);
    
    try {
      // Update all positions in database
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('categories')
          .update({ position: i + 1 })
          .eq('id', newOrder[i].id);
      }

      toast({
        title: 'Gespeichert',
        description: 'Kategorien-Reihenfolge wurde aktualisiert.',
      });
    } catch (error) {
      console.error('Error saving category order:', error);
      loadCategories(); // Revert on error
      toast({
        title: 'Fehler',
        description: 'Reihenfolge konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    }
  }, [categories, toast, loadCategories]);

  const addCategory = useCallback(async (category: Omit<DatabaseCategory, 'id' | 'position' | 'is_active'>) => {
    try {
      const maxPosition = Math.max(...categories.map(c => c.position), 0);
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...category,
          position: maxPosition + 1,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      toast({
        title: 'Hinzugefügt',
        description: `Kategorie "${category.name}" wurde erstellt.`,
      });
      return data;
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Kategorie konnte nicht erstellt werden.',
        variant: 'destructive',
      });
      return null;
    }
  }, [categories, toast]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Gelöscht',
        description: 'Kategorie wurde gelöscht.',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Fehler',
        description: 'Kategorie konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateCategory = useCallback(async (id: string, updates: Partial<DatabaseCategory>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      toast({
        title: 'Aktualisiert',
        description: 'Kategorie wurde aktualisiert.',
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Fehler',
        description: 'Kategorie konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    categories,
    isLoading,
    reorderCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    refreshCategories: loadCategories,
  };
};
