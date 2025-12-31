import { 
  Baby, 
  Sparkles, 
  Smartphone, 
  Lightbulb, 
  Home, 
  Flower2, 
  Gem, 
  Gamepad2, 
  Shirt, 
  Dumbbell, 
  Heart, 
  Wine 
} from 'lucide-react';

interface CategoryIconProps {
  slug: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'baby': Baby,
  'schoenheit': Sparkles,
  'elektronik': Smartphone,
  'beleuchtung': Lightbulb,
  'haus-kueche': Home,
  'garten': Flower2,
  'schmuck': Gem,
  'spielzeug': Gamepad2,
  'kleidung': Shirt,
  'sport-outdoor': Dumbbell,
  'sex-sinnlichkeit': Heart,
  'speisen-getraenke': Wine,
};

const colorMap: Record<string, string> = {
  'baby': 'bg-pink-100 text-pink-500',
  'schoenheit': 'bg-purple-100 text-purple-500',
  'elektronik': 'bg-blue-100 text-blue-500',
  'beleuchtung': 'bg-yellow-100 text-yellow-600',
  'haus-kueche': 'bg-orange-100 text-orange-500',
  'garten': 'bg-green-100 text-green-500',
  'schmuck': 'bg-cyan-100 text-cyan-500',
  'spielzeug': 'bg-red-100 text-red-500',
  'kleidung': 'bg-indigo-100 text-indigo-500',
  'sport-outdoor': 'bg-emerald-100 text-emerald-500',
  'sex-sinnlichkeit': 'bg-rose-100 text-rose-500',
  'speisen-getraenke': 'bg-amber-100 text-amber-600',
};

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
};

const iconSizeMap = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
};

const CategoryIcon = ({ slug, size = 'md', className = '' }: CategoryIconProps) => {
  const Icon = iconMap[slug] || Home;
  const colors = colorMap[slug] || 'bg-gray-100 text-gray-500';
  
  return (
    <div 
      className={`
        ${sizeMap[size]} 
        ${colors} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        shadow-sm
        transition-transform
        hover:scale-110
        ${className}
      `}
    >
      <Icon className={iconSizeMap[size]} strokeWidth={1.5} />
    </div>
  );
};

export default CategoryIcon;
