import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Baby, Sparkles, Smartphone, Lightbulb, Home, Flower2, 
  Gem, Gamepad2, Shirt, Dumbbell, Heart, Wine, LucideIcon 
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'Baby': Baby,
  'Sparkles': Sparkles,
  'Smartphone': Smartphone,
  'Lightbulb': Lightbulb,
  'Home': Home,
  'Flower2': Flower2,
  'Gem': Gem,
  'Gamepad2': Gamepad2,
  'Shirt': Shirt,
  'Dumbbell': Dumbbell,
  'Heart': Heart,
  'Wine': Wine,
};

const CategoryChips = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories-chips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name, slug, icon')
        .eq('is_active', true)
        .order('position')
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Home;
        return (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-header-foreground/5 hover:bg-header-foreground/10 border border-header-foreground/10 rounded-full text-xs font-medium text-header-foreground/80 hover:text-header-foreground whitespace-nowrap transition-all duration-200 shrink-0"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{category.name}</span>
          </Link>
        );
      })}
      <Link
        to="/categories"
        className="flex items-center px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full text-xs font-medium text-primary whitespace-nowrap transition-all duration-200 shrink-0"
      >
        Alle →
      </Link>
    </div>
  );
};

export default CategoryChips;
