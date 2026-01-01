-- Allow clients to call role check function
GRANT USAGE ON TYPE public.app_role TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO anon, authenticated;