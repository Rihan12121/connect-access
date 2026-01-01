-- Create hero_banners table for admin-managed hero section
CREATE TABLE public.hero_banners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    image TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT '/products',
    position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Everyone can view active banners
CREATE POLICY "Hero banners are viewable by everyone"
ON public.hero_banners
FOR SELECT
USING ((is_active = true) OR has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert
CREATE POLICY "Admins can insert hero banners"
ON public.hero_banners
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update hero banners"
ON public.hero_banners
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete hero banners"
ON public.hero_banners
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default banners
INSERT INTO public.hero_banners (title, subtitle, image, link, position) VALUES
('Elegante Schönheit', 'Neue Kollektion', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80', '/category/beauty', 1),
('Smart Living', 'Technologie für Ihr Zuhause', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80', '/category/electronics', 2),
('Baby Essentials', 'Alles für die Kleinen', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1920&q=80', '/category/baby', 3);

-- Add trigger for updated_at
CREATE TRIGGER update_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();