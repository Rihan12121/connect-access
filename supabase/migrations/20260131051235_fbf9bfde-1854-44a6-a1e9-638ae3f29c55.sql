-- Create sellers table for extended seller information
CREATE TABLE public.sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name text NOT NULL,
  owner_name text,
  email text,
  country text DEFAULT 'Deutschland',
  iban text,
  account_holder text,
  vat_id text,
  is_small_business boolean DEFAULT false,
  shipping_method text DEFAULT 'own_shipping',
  accepts_terms boolean DEFAULT false,
  accepts_platform_fee boolean DEFAULT false,
  accepts_return_policy boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Sellers are viewable by everyone"
ON public.sellers FOR SELECT
USING (status = 'active' OR auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own seller profile"
ON public.sellers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile"
ON public.sellers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all sellers"
ON public.sellers FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_sellers_updated_at
BEFORE UPDATE ON public.sellers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing seller rihan into sellers table
INSERT INTO public.sellers (user_id, shop_name, status)
SELECT '72bb0991-ce82-44c8-8e80-df1726ca269b', 'rihan', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.sellers WHERE user_id = '72bb0991-ce82-44c8-8e80-df1726ca269b'
);

-- Add more products for seller rihan to test pagination
INSERT INTO public.products (name, price, image, category, in_stock, seller_id, description) VALUES
('Premium Wireless Kopfhörer', 89.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Hochwertige kabellose Kopfhörer'),
('Vintage Lederarmband', 24.99, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', 'fashion', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Elegantes Lederarmband'),
('Smart Watch Pro', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Smartwatch mit vielen Funktionen'),
('Nachhaltige Tragetasche', 34.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', 'fashion', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Umweltfreundliche Tasche'),
('Bluetooth Lautsprecher', 59.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Tragbarer Lautsprecher'),
('Designer Sonnenbrillen', 79.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 'fashion', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Modische Sonnenbrillen'),
('Laptop Tasche', 49.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Professionelle Laptoptasche'),
('Fitness Tracker', 69.99, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Aktivitätstracker'),
('Kabellose Maus', 29.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Ergonomische Maus'),
('USB-C Hub', 39.99, 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Multiport Adapter'),
('Mechanische Tastatur', 119.99, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Gaming Tastatur'),
('Webcam HD', 45.99, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Full HD Webcam'),
('Handyhülle Premium', 19.99, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Hochwertige Schutzhülle'),
('Powerbank 20000mAh', 44.99, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'Große Kapazität'),
('Kabellose Ohrhörer', 79.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 'electronics', true, '72bb0991-ce82-44c8-8e80-df1726ca269b', 'True Wireless Earbuds');