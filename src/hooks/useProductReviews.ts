import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductReviewStats {
  avgRating: number | null;
  totalReviews: number;
  distribution: { [key: number]: number };
}

export const useProductReviews = (productId: string) => {
  const [stats, setStats] = useState<ProductReviewStats>({
    avgRating: null,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setStats({
          avgRating: null,
          totalReviews: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
        setLoading(false);
        return;
      }

      const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;

      data.forEach(review => {
        const rating = Math.min(5, Math.max(1, Math.round(review.rating)));
        distribution[rating] = (distribution[rating] || 0) + 1;
        sum += review.rating;
      });

      setStats({
        avgRating: sum / data.length,
        totalReviews: data.length,
        distribution
      });
      setLoading(false);
    };

    fetchReviews();
  }, [productId]);

  return { ...stats, loading };
};

// Standalone function for quick rating lookup (used in ProductCard)
export const getProductRating = async (productId: string): Promise<{ avg: number | null; count: number }> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId);

  if (error || !data || data.length === 0) {
    return { avg: null, count: 0 };
  }

  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return { avg: sum / data.length, count: data.length };
};