import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ABTestVariant {
  name: string;
  value: string;
}

interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  traffic_split: Record<string, number>;
}

interface DBTest {
  id: string;
  name: string;
  variants: any;
  traffic_split: any;
  is_active: boolean;
}

// Generate unique session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('ab_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('ab_session_id', sessionId);
  }
  return sessionId;
};

// Get stored variant for a test
const getStoredVariant = (testId: string): string | null => {
  const stored = localStorage.getItem(`ab_test_${testId}`);
  return stored;
};

// Store variant for a test
const storeVariant = (testId: string, variant: string) => {
  localStorage.setItem(`ab_test_${testId}`, variant);
};

export const useABTest = (testName: string) => {
  const { user } = useAuth();
  const [test, setTest] = useState<ABTest | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [variantValue, setVariantValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, [testName]);

  const fetchTest = async () => {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('name', testName)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    const dbTest = data as DBTest;
    const parsedTest: ABTest = {
      id: dbTest.id,
      name: dbTest.name,
      variants: Array.isArray(dbTest.variants) ? dbTest.variants : [],
      traffic_split: typeof dbTest.traffic_split === 'object' ? dbTest.traffic_split : {},
    };
    
    setTest(parsedTest);

    // Check for stored variant
    const stored = getStoredVariant(parsedTest.id);
    if (stored) {
      setVariant(stored);
      const variantData = parsedTest.variants.find((v) => v.name === stored);
      setVariantValue(variantData?.value || null);
      setLoading(false);
      return;
    }

    // Assign variant based on traffic split
    const assignedVariant = assignVariant(parsedTest.traffic_split);
    setVariant(assignedVariant);
    storeVariant(parsedTest.id, assignedVariant);

    const variantData = parsedTest.variants.find((v) => v.name === assignedVariant);
    setVariantValue(variantData?.value || null);

    // Record impression
    await recordImpression(parsedTest.id, assignedVariant);
    setLoading(false);
  };

  const assignVariant = (trafficSplit: Record<string, number>): string => {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const [variant, percentage] of Object.entries(trafficSplit)) {
      cumulative += percentage;
      if (random <= cumulative) {
        return variant;
      }
    }

    // Default to first variant
    return Object.keys(trafficSplit)[0] || 'control';
  };

  const recordImpression = async (testId: string, variant: string) => {
    try {
      await supabase.from('ab_test_impressions').insert({
        test_id: testId,
        variant,
        session_id: getSessionId(),
        user_id: user?.id || null,
      });
    } catch (error) {
      console.error('Error recording impression:', error);
    }
  };

  const recordConversion = useCallback(async (value: number = 0) => {
    if (!test || !variant) return;

    try {
      // Find the impression and update it
      const sessionId = getSessionId();
      
      await supabase
        .from('ab_test_impressions')
        .update({
          converted: true,
          conversion_value: value,
        })
        .eq('test_id', test.id)
        .eq('session_id', sessionId)
        .eq('variant', variant);
    } catch (error) {
      console.error('Error recording conversion:', error);
    }
  }, [test, variant]);

  return {
    variant,
    variantValue,
    loading,
    isControl: variant === 'control',
    isVariant: variant === 'variant',
    recordConversion,
  };
};

// Hook for getting A/B test by specific test type
export const useABTestByType = (testType: string, targetId?: string) => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      let query = supabase
        .from('ab_tests')
        .select('*')
        .eq('test_type', testType)
        .eq('is_active', true);

      if (targetId) {
        query = query.eq('target_id', targetId);
      }

      const { data } = await query;
      const parsedTests: ABTest[] = (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        variants: Array.isArray(d.variants) ? d.variants : [],
        traffic_split: typeof d.traffic_split === 'object' ? d.traffic_split : {},
      }));
      setTests(parsedTests);
      setLoading(false);
    };

    fetchTests();
  }, [testType, targetId]);

  return { tests, loading };
};
