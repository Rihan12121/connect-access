import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  name: string;
  value: number;
  type: 'timing' | 'counter' | 'gauge';
  metadata?: Record<string, any>;
}

export const useMonitoring = () => {
  // Track page load performance
  const trackPageLoad = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const metrics: PerformanceMetric[] = [
      {
        name: 'page_load_time',
        value: navigation.loadEventEnd - navigation.startTime,
        type: 'timing',
      },
      {
        name: 'dom_content_loaded',
        value: navigation.domContentLoadedEventEnd - navigation.startTime,
        type: 'timing',
      },
      {
        name: 'first_byte',
        value: navigation.responseStart - navigation.requestStart,
        type: 'timing',
      },
    ];

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance]', metrics);
    }

    // Store in database for analysis
    metrics.forEach(async (metric) => {
      try {
        await supabase.from('performance_metrics').insert({
          metric_name: metric.name,
          metric_value: metric.value,
          metric_type: metric.type,
          metadata: { url: window.location.pathname },
        });
      } catch (error) {
        // Silently fail - don't break the app for monitoring
      }
    });
  }, []);

  // Track Core Web Vitals
  const trackWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('[Web Vitals] LCP:', lastEntry.startTime);
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // Not supported
    }

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('[Web Vitals] FID:', entry.processingStart - entry.startTime);
      });
    });

    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // Not supported
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('[Web Vitals] CLS:', clsValue);
    });

    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Not supported
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Track API response times
  const trackApiCall = useCallback(async (
    endpoint: string,
    duration: number,
    status: 'success' | 'error'
  ) => {
    try {
      await supabase.from('performance_metrics').insert({
        metric_name: 'api_response_time',
        metric_value: duration,
        metric_type: 'timing',
        metadata: { endpoint, status },
      });
    } catch (error) {
      // Silently fail
    }
  }, []);

  // Track errors
  const trackError = useCallback(async (error: Error, context?: Record<string, any>) => {
    console.error('[Error Tracking]', error, context);
    
    try {
      await supabase.from('audit_logs').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id || '00000000-0000-0000-0000-000000000000',
        action: 'error',
        entity_type: 'frontend_error',
        entity_id: null,
        user_role: 'user',
        new_values: {
          message: error.message,
          stack: error.stack,
          ...context,
        },
      });
    } catch (e) {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    // Track page load on mount
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    const cleanup = trackWebVitals();

    return () => {
      window.removeEventListener('load', trackPageLoad);
      cleanup?.();
    };
  }, [trackPageLoad, trackWebVitals]);

  return {
    trackApiCall,
    trackError,
  };
};

export default useMonitoring;
