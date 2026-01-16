-- Drop the insecure public read policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure policies for profiles table
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a public view for non-sensitive profile data (for features like showing seller names, message participants)
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT 
  user_id,
  display_name,
  avatar_url
FROM public.profiles;