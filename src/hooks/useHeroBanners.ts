import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string;
  position: number;
  is_active: boolean;
}

export const useHeroBanners = () => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadBanners = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error loading banners:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const addBanner = useCallback(async (banner: Omit<HeroBanner, 'id' | 'position' | 'is_active'>) => {
    try {
      const maxPosition = Math.max(...banners.map(b => b.position), 0);
      const { data, error } = await supabase
        .from('hero_banners')
        .insert({
          ...banner,
          position: maxPosition + 1,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setBanners(prev => [...prev, data]);
      toast({
        title: 'Hinzugefügt',
        description: 'Banner wurde erstellt.',
      });
      return data;
    } catch (error: any) {
      console.error('Error adding banner:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Banner konnte nicht erstellt werden.',
        variant: 'destructive',
      });
      return null;
    }
  }, [banners, toast]);

  const updateBanner = useCallback(async (id: string, updates: Partial<HeroBanner>) => {
    try {
      const { error } = await supabase
        .from('hero_banners')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      toast({
        title: 'Aktualisiert',
        description: 'Banner wurde aktualisiert.',
      });
    } catch (error) {
      console.error('Error updating banner:', error);
      toast({
        title: 'Fehler',
        description: 'Banner konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const deleteBanner = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_banners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBanners(prev => prev.filter(b => b.id !== id));
      toast({
        title: 'Gelöscht',
        description: 'Banner wurde gelöscht.',
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Fehler',
        description: 'Banner konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const reorderBanners = useCallback(async (fromIndex: number, toIndex: number) => {
    const newOrder = [...banners];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    
    setBanners(newOrder);
    
    try {
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('hero_banners')
          .update({ position: i + 1 })
          .eq('id', newOrder[i].id);
      }

      toast({
        title: 'Gespeichert',
        description: 'Banner-Reihenfolge wurde aktualisiert.',
      });
    } catch (error) {
      console.error('Error saving banner order:', error);
      loadBanners();
      toast({
        title: 'Fehler',
        description: 'Reihenfolge konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    }
  }, [banners, toast, loadBanners]);

  return {
    banners,
    isLoading,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    refreshBanners: loadBanners,
  };
};
