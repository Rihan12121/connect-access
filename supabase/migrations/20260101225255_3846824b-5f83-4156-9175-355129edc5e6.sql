-- Create table for categories (managed by admin)
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'Home',
  image text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view active categories
CREATE POLICY "Categories are viewable by everyone"
ON public.categories
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default categories
INSERT INTO public.categories (slug, name, icon, image, position) VALUES
  ('baby', 'Baby', 'Baby', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop&q=80', 1),
  ('schoenheit', 'Schönheit', 'Sparkles', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80', 2),
  ('elektronik', 'Elektronik', 'Smartphone', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop&q=80', 3),
  ('beleuchtung', 'Beleuchtung', 'Lightbulb', 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop&q=80', 4),
  ('haus-kueche', 'Haus & Küche', 'Home', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80', 5),
  ('garten', 'Garten', 'Flower2', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80', 6),
  ('schmuck', 'Schmuck', 'Gem', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&q=80', 7),
  ('spielzeug', 'Spielzeug', 'Gamepad2', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop&q=80', 8),
  ('kleidung', 'Kleidung', 'Shirt', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80', 9),
  ('sport-outdoor', 'Sport & Outdoor', 'Dumbbell', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80', 10),
  ('sex-sinnlichkeit', 'Sex & Sinnlichkeit', 'Heart', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80', 11),
  ('speisen-getraenke', 'Speisen & Getränke', 'Wine', 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&q=80', 12);

-- Drop old category_order table as we now have full categories table
DROP TABLE IF EXISTS public.category_order;