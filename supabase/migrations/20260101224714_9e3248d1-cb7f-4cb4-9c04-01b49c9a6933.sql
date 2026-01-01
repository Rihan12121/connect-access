-- Create table for category order (global for all users, managed by admin)
CREATE TABLE public.category_order (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  position integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.category_order ENABLE ROW LEVEL SECURITY;

-- Everyone can view category order
CREATE POLICY "Category order is viewable by everyone"
ON public.category_order
FOR SELECT
USING (true);

-- Only admins can manage category order
CREATE POLICY "Admins can insert category order"
ON public.category_order
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update category order"
ON public.category_order
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete category order"
ON public.category_order
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default order
INSERT INTO public.category_order (slug, position) VALUES
  ('baby', 1),
  ('schoenheit', 2),
  ('elektronik', 3),
  ('beleuchtung', 4),
  ('haus-kueche', 5),
  ('garten', 6),
  ('schmuck', 7),
  ('spielzeug', 8),
  ('kleidung', 9),
  ('sport-outdoor', 10),
  ('sex-sinnlichkeit', 11),
  ('speisen-getraenke', 12);