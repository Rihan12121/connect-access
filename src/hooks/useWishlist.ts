import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlistIds();
    } else {
      setWishlistIds(new Set());
    }
  }, [user]);

  const fetchWishlistIds = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistIds(new Set(data?.map(w => w.product_id) || []));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToWishlist = useCallback(async (productId: string, notifyWhenAvailable = false) => {
    if (!user) {
      toast.error('Bitte anmelden');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId,
          notify_when_available: notifyWhenAvailable,
        });

      if (error) {
        if (error.code === '23505') {
          toast.info('Bereits auf der Wunschliste');
          return false;
        }
        throw error;
      }

      setWishlistIds(prev => new Set([...prev, productId]));
      toast.success('Zur Wunschliste hinzugefügt');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Fehler beim Hinzufügen');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setWishlistIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      toast.success('Von Wunschliste entfernt');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Fehler beim Entfernen');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (wishlistIds.has(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  }, [wishlistIds, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  return {
    wishlistIds,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    refetch: fetchWishlistIds,
  };
};
