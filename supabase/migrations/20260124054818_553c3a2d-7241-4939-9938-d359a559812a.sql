-- Table for storing translations that admins can edit
CREATE TABLE public.translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key text NOT NULL UNIQUE,
  de text NOT NULL,
  en text NOT NULL,
  category text DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Everyone can read translations
CREATE POLICY "Translations are viewable by everyone" 
ON public.translations FOR SELECT 
USING (true);

-- Admins can manage translations
CREATE POLICY "Admins can manage translations" 
ON public.translations FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();