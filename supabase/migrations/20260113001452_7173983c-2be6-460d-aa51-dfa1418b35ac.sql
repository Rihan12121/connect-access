-- Add seller_id column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);

-- Update RLS policies for products to allow sellers to manage their own products
DROP POLICY IF EXISTS "Sellers can insert their own products" ON public.products;
CREATE POLICY "Sellers can insert their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'seller'::app_role) AND seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Sellers can update their own products" ON public.products;
CREATE POLICY "Sellers can update their own products" 
ON public.products 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'seller'::app_role) AND seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Sellers can delete their own products" ON public.products;
CREATE POLICY "Sellers can delete their own products" 
ON public.products 
FOR DELETE 
USING (
  has_role(auth.uid(), 'seller'::app_role) AND seller_id = auth.uid()
);