-- Create blocked_users table for permanently blocking users
CREATE TABLE public.blocked_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  bank_account TEXT,
  reason TEXT,
  blocked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view blocked users
CREATE POLICY "Admins can view blocked users"
ON public.blocked_users
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert blocked users
CREATE POLICY "Admins can insert blocked users"
ON public.blocked_users
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update blocked users
CREATE POLICY "Admins can update blocked users"
ON public.blocked_users
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete blocked users
CREATE POLICY "Admins can delete blocked users"
ON public.blocked_users
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(check_email TEXT, check_name TEXT DEFAULT NULL, check_bank TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.blocked_users
    WHERE 
      (email IS NOT NULL AND LOWER(email) = LOWER(check_email))
      OR (check_name IS NOT NULL AND display_name IS NOT NULL AND LOWER(display_name) = LOWER(check_name))
      OR (check_bank IS NOT NULL AND bank_account IS NOT NULL AND bank_account = check_bank)
  )
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_user_blocked TO anon, authenticated;