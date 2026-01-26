
-- Seller Payouts Table (15% platform fee)
CREATE TABLE public.seller_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  net_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payout_method TEXT DEFAULT 'bank_transfer',
  bank_details JSONB,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seller Ratings Table
CREATE TABLE public.seller_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, order_id)
);

-- Returns Table
CREATE TABLE public.returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  refund_amount NUMERIC,
  return_label_url TEXT,
  tracking_number TEXT,
  notes TEXT,
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- GDPR Requests Table
CREATE TABLE public.gdpr_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion')),
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tax Settings Table (EU-OSS)
CREATE TABLE public.tax_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  vat_rate NUMERIC NOT NULL,
  is_eu_member BOOLEAN DEFAULT false,
  oss_applicable BOOLEAN DEFAULT false,
  threshold_amount NUMERIC DEFAULT 10000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seller Disputes Table
CREATE TABLE public.seller_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  seller_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Platform Metrics Table (SLA/Monitoring)
CREATE TABLE public.platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  metadata JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_payouts
CREATE POLICY "Sellers can view their payouts" ON public.seller_payouts
  FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Admins can manage payouts" ON public.seller_payouts
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for seller_ratings
CREATE POLICY "Anyone can view ratings" ON public.seller_ratings
  FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.seller_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage ratings" ON public.seller_ratings
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for returns
CREATE POLICY "Users can view their returns" ON public.returns
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create returns" ON public.returns
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage returns" ON public.returns
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for gdpr_requests
CREATE POLICY "Users can view their GDPR requests" ON public.gdpr_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create GDPR requests" ON public.gdpr_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage GDPR requests" ON public.gdpr_requests
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for tax_settings
CREATE POLICY "Anyone can view tax settings" ON public.tax_settings
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage tax settings" ON public.tax_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for seller_disputes
CREATE POLICY "Buyers can view their disputes" ON public.seller_disputes
  FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view their disputes" ON public.seller_disputes
  FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Users can create disputes" ON public.seller_disputes
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Admins can manage disputes" ON public.seller_disputes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for platform_metrics
CREATE POLICY "Admins can view metrics" ON public.platform_metrics
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert metrics" ON public.platform_metrics
  FOR INSERT WITH CHECK (true);

-- Insert default EU tax rates
INSERT INTO public.tax_settings (country_code, country_name, vat_rate, is_eu_member, oss_applicable) VALUES
  ('DE', 'Deutschland', 19, true, true),
  ('AT', 'Österreich', 20, true, true),
  ('FR', 'Frankreich', 20, true, true),
  ('IT', 'Italien', 22, true, true),
  ('ES', 'Spanien', 21, true, true),
  ('NL', 'Niederlande', 21, true, true),
  ('BE', 'Belgien', 21, true, true),
  ('PL', 'Polen', 23, true, true),
  ('SE', 'Schweden', 25, true, true),
  ('DK', 'Dänemark', 25, true, true),
  ('FI', 'Finnland', 24, true, true),
  ('IE', 'Irland', 23, true, true),
  ('PT', 'Portugal', 23, true, true),
  ('GR', 'Griechenland', 24, true, true),
  ('CZ', 'Tschechien', 21, true, true),
  ('RO', 'Rumänien', 19, true, true),
  ('HU', 'Ungarn', 27, true, true),
  ('SK', 'Slowakei', 20, true, true),
  ('BG', 'Bulgarien', 20, true, true),
  ('HR', 'Kroatien', 25, true, true),
  ('SI', 'Slowenien', 22, true, true),
  ('LT', 'Litauen', 21, true, true),
  ('LV', 'Lettland', 21, true, true),
  ('EE', 'Estland', 20, true, true),
  ('LU', 'Luxemburg', 17, true, true),
  ('MT', 'Malta', 18, true, true),
  ('CY', 'Zypern', 19, true, true),
  ('CH', 'Schweiz', 7.7, false, false),
  ('GB', 'Großbritannien', 20, false, false);

-- Add triggers for updated_at
CREATE TRIGGER update_seller_payouts_updated_at BEFORE UPDATE ON public.seller_payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seller_ratings_updated_at BEFORE UPDATE ON public.seller_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON public.returns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tax_settings_updated_at BEFORE UPDATE ON public.tax_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seller_disputes_updated_at BEFORE UPDATE ON public.seller_disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
