import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceEntry {
  name: string;
  duration: number;
  startTime: number;
}

// Simple in-memory rate limiter for client-side
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Singleton rate limiter
const rateLimiter = new RateLimiter();

export const usePerformanceMetrics = () => {
  const metricsQueue = useRef<any[]>([]);
  const flushTimeout = useRef<NodeJS.Timeout | null>(null);

  // Collect Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          trackMetric('web_vital', 'FCP', entry.startTime);
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      trackMetric('web_vital', 'LCP', lastEntry.startTime);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        trackMetric('web_vital', 'FID', fidEntry.processingStart - fidEntry.startTime);
      }
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as any;
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // Report CLS on page hide
    const reportCLS = () => {
      trackMetric('web_vital', 'CLS', clsValue * 1000); // Convert to ms-like value
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Batch and flush metrics
  const flushMetrics = useCallback(async () => {
    if (metricsQueue.current.length === 0) return;

    const metrics = [...metricsQueue.current];
    metricsQueue.current = [];

    try {
      await supabase.from('performance_metrics').insert(metrics);
    } catch (error) {
      console.error('Error flushing metrics:', error);
      // Re-add failed metrics to queue
      metricsQueue.current.push(...metrics);
    }
  }, []);

  // Schedule flush
  const scheduleFlush = useCallback(() => {
    if (flushTimeout.current) {
      clearTimeout(flushTimeout.current);
    }
    flushTimeout.current = setTimeout(flushMetrics, 5000);
  }, [flushMetrics]);

  // Track a metric
  const trackMetric = useCallback((type: string, name: string, value: number, metadata?: any) => {
    metricsQueue.current.push({
      metric_type: type,
      metric_name: name,
      metric_value: value,
      metadata: metadata || null,
    });

    // Flush immediately if queue is large
    if (metricsQueue.current.length >= 10) {
      flushMetrics();
    } else {
      scheduleFlush();
    }
  }, [flushMetrics, scheduleFlush]);

  // Measure function execution time
  const measureAsync = useCallback(async <T>(
    name: string, 
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      trackMetric('function', name, performance.now() - start);
      return result;
    } catch (error) {
      trackMetric('error', name, performance.now() - start, { error: String(error) });
      throw error;
    }
  }, [trackMetric]);

  // Track page load
  const trackPageLoad = useCallback((pageName: string) => {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      trackMetric('page_load', pageName, navigation.loadEventEnd - navigation.startTime, {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      });
    }
  }, [trackMetric]);

  return {
    trackMetric,
    measureAsync,
    trackPageLoad,
    flushMetrics,
    rateLimiter,
  };
};

// Export rate limiter for use in other hooks
export { RateLimiter };
export const globalRateLimiter = rateLimiter;
