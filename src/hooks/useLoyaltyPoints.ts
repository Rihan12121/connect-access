import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface LoyaltyInfo {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierName: string;
  nextTier: string | null;
  pointsToNextTier: number;
  discount: number;
  totalSpent: number;
  ordersCount: number;
}

const TIER_THRESHOLDS = {
  bronze: { minPoints: 0, discount: 0, name: 'Bronze' },
  silver: { minPoints: 500, discount: 5, name: 'Silver' },
  gold: { minPoints: 2000, discount: 10, name: 'Gold' },
  platinum: { minPoints: 5000, discount: 15, name: 'Platinum' },
};

const calculateTier = (points: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
  if (points >= TIER_THRESHOLDS.platinum.minPoints) return 'platinum';
  if (points >= TIER_THRESHOLDS.gold.minPoints) return 'gold';
  if (points >= TIER_THRESHOLDS.silver.minPoints) return 'silver';
  return 'bronze';
};

const getNextTier = (currentTier: string): { name: string | null; pointsNeeded: number } => {
  switch (currentTier) {
    case 'bronze':
      return { name: 'Silver', pointsNeeded: TIER_THRESHOLDS.silver.minPoints };
    case 'silver':
      return { name: 'Gold', pointsNeeded: TIER_THRESHOLDS.gold.minPoints };
    case 'gold':
      return { name: 'Platinum', pointsNeeded: TIER_THRESHOLDS.platinum.minPoints };
    default:
      return { name: null, pointsNeeded: 0 };
  }
};

export const useLoyaltyPoints = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);

  const fetchLoyaltyInfo = useCallback(async () => {
    if (!user) {
      setLoyaltyInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch user's orders to calculate points (1€ = 1 point)
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total, payment_status')
        .eq('user_id', user.id)
        .eq('payment_status', 'paid');

      if (error) throw error;

      const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const ordersCount = orders?.length || 0;
      const points = Math.floor(totalSpent); // 1€ = 1 point

      const tier = calculateTier(points);
      const tierInfo = TIER_THRESHOLDS[tier];
      const nextTierInfo = getNextTier(tier);

      setLoyaltyInfo({
        points,
        tier,
        tierName: tierInfo.name,
        nextTier: nextTierInfo.name,
        pointsToNextTier: nextTierInfo.name ? nextTierInfo.pointsNeeded - points : 0,
        discount: tierInfo.discount,
        totalSpent,
        ordersCount,
      });
    } catch (error) {
      console.error('Error fetching loyalty info:', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLoyaltyInfo();
  }, [fetchLoyaltyInfo]);

  return {
    loyaltyInfo,
    loading,
    refetch: fetchLoyaltyInfo,
  };
};

export default useLoyaltyPoints;
