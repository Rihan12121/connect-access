
-- Affiliates table for tracking partners
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC NOT NULL DEFAULT 5,
  total_earnings NUMERIC NOT NULL DEFAULT 0,
  pending_payout NUMERIC NOT NULL DEFAULT 0,
  total_paid NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliate referrals tracking
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  visitor_ip TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_at TIMESTAMP WITH TIME ZONE,
  commission_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'clicked'
);

-- Affiliate payouts
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_details JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- A/B Tests table
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  test_type TEXT NOT NULL DEFAULT 'content',
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  traffic_split JSONB NOT NULL DEFAULT '{"control": 50, "variant": 50}'::jsonb,
  target_entity TEXT,
  target_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  winner_variant TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- A/B Test results/impressions
CREATE TABLE IF NOT EXISTS public.ab_test_impressions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id UUID,
  converted BOOLEAN NOT NULL DEFAULT false,
  conversion_value NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order events for event-driven architecture
CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Search analytics for improving search
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  clicked_product_id UUID,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Affiliates policies
CREATE POLICY "Users can view their own affiliate" ON public.affiliates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage affiliates" ON public.affiliates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own affiliate" ON public.affiliates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Affiliate referrals policies
CREATE POLICY "Affiliates can view their referrals" ON public.affiliate_referrals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.affiliates WHERE id = affiliate_id AND user_id = auth.uid())
);
CREATE POLICY "System can insert referrals" ON public.affiliate_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage referrals" ON public.affiliate_referrals FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Affiliate payouts policies
CREATE POLICY "Affiliates can view their payouts" ON public.affiliate_payouts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.affiliates WHERE id = affiliate_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage payouts" ON public.affiliate_payouts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- A/B Tests policies
CREATE POLICY "Admins can manage A/B tests" ON public.ab_tests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Active tests viewable by everyone" ON public.ab_tests FOR SELECT USING (is_active = true);

-- A/B Test impressions policies
CREATE POLICY "Anyone can record impressions" ON public.ab_test_impressions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view impressions" ON public.ab_test_impressions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Order events policies
CREATE POLICY "Admins can manage order events" ON public.order_events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert events" ON public.order_events FOR INSERT WITH CHECK (true);

-- Rate limits policies
CREATE POLICY "System can manage rate limits" ON public.rate_limits FOR ALL USING (true);

-- Search analytics policies
CREATE POLICY "Anyone can record search analytics" ON public.search_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view search analytics" ON public.search_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Performance metrics policies
CREATE POLICY "System can insert metrics" ON public.performance_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view metrics" ON public.performance_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for order_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_events;

-- Create order event trigger
CREATE OR REPLACE FUNCTION public.create_order_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.order_events (order_id, event_type, event_data)
  VALUES (
    NEW.id,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'order_created'
      WHEN OLD.status != NEW.status THEN 'status_changed'
      WHEN OLD.payment_status != NEW.payment_status THEN 'payment_updated'
      ELSE 'order_updated'
    END,
    jsonb_build_object(
      'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
      'new_status', NEW.status,
      'old_payment_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.payment_status ELSE NULL END,
      'new_payment_status', NEW.payment_status,
      'total', NEW.total
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_order_change ON public.orders;
CREATE TRIGGER on_order_change
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.create_order_event();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate ON public.affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_impressions_test ON public.ab_test_impressions(test_id);
CREATE INDEX IF NOT EXISTS idx_order_events_order ON public.order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_events_processed ON public.order_events(processed) WHERE processed = false;
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON public.search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(to_tsvector('german', name || ' ' || COALESCE(description, '')));
