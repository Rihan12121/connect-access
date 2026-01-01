import { Link } from 'react-router-dom';
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
  Wine,
  GripVertical
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/data/products';

interface ModernCategoryCardProps {
  category: Category;
  index: number;
  isAdmin?: boolean;
  isDragging?: boolean;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDragEnd?: () => void;
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

// Modern pastel gradient colors
const gradientMap: Record<string, string> = {
  'baby': 'from-pink-100 via-pink-50 to-rose-50',
  'schoenheit': 'from-purple-100 via-violet-50 to-fuchsia-50',
  'elektronik': 'from-blue-100 via-sky-50 to-cyan-50',
  'beleuchtung': 'from-amber-100 via-yellow-50 to-orange-50',
  'haus-kueche': 'from-orange-100 via-amber-50 to-yellow-50',
  'garten': 'from-green-100 via-emerald-50 to-teal-50',
  'schmuck': 'from-cyan-100 via-teal-50 to-sky-50',
  'spielzeug': 'from-red-100 via-rose-50 to-pink-50',
  'kleidung': 'from-indigo-100 via-blue-50 to-violet-50',
  'sport-outdoor': 'from-emerald-100 via-green-50 to-lime-50',
  'sex-sinnlichkeit': 'from-rose-100 via-pink-50 to-red-50',
  'speisen-getraenke': 'from-amber-100 via-orange-50 to-yellow-50',
};

// Icon background colors (soft pastels)
const iconBgMap: Record<string, string> = {
  'baby': 'bg-gradient-to-br from-pink-200 to-pink-300 text-pink-600',
  'schoenheit': 'bg-gradient-to-br from-purple-200 to-purple-300 text-purple-600',
  'elektronik': 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-600',
  'beleuchtung': 'bg-gradient-to-br from-amber-200 to-amber-300 text-amber-600',
  'haus-kueche': 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-600',
  'garten': 'bg-gradient-to-br from-green-200 to-green-300 text-green-600',
  'schmuck': 'bg-gradient-to-br from-cyan-200 to-cyan-300 text-cyan-600',
  'spielzeug': 'bg-gradient-to-br from-red-200 to-red-300 text-red-600',
  'kleidung': 'bg-gradient-to-br from-indigo-200 to-indigo-300 text-indigo-600',
  'sport-outdoor': 'bg-gradient-to-br from-emerald-200 to-emerald-300 text-emerald-600',
  'sex-sinnlichkeit': 'bg-gradient-to-br from-rose-200 to-rose-300 text-rose-600',
  'speisen-getraenke': 'bg-gradient-to-br from-amber-200 to-amber-300 text-amber-600',
};

const ModernCategoryCard = ({ 
  category, 
  index, 
  isAdmin = false,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDragEnd
}: ModernCategoryCardProps) => {
  const { tCategory } = useLanguage();
  const Icon = iconMap[category.slug] || Home;
  const gradient = gradientMap[category.slug] || 'from-gray-100 to-gray-50';
  const iconBg = iconBgMap[category.slug] || 'bg-gray-200 text-gray-600';

  const cardContent = (
    <div 
      className={`
        relative flex flex-col items-center justify-center
        min-w-[140px] md:min-w-[160px] p-5 md:p-6
        bg-gradient-to-br ${gradient}
        rounded-2xl md:rounded-3xl
        shadow-sm hover:shadow-lg
        border border-white/50
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        cursor-pointer
        group
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      style={{
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Admin drag handle */}
      {isAdmin && (
        <div 
          className="absolute top-2 right-2 p-1 rounded-lg bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Icon container with soft gradient */}
      <div 
        className={`
          w-14 h-14 md:w-16 md:h-16
          ${iconBg}
          rounded-2xl
          flex items-center justify-center
          shadow-md
          group-hover:scale-110 group-hover:shadow-lg
          transition-all duration-300
          mb-3 md:mb-4
        `}
      >
        <Icon className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
      </div>

      {/* Category name */}
      <span className="text-sm md:text-base font-medium text-center text-foreground/90 leading-tight">
        {tCategory(category.slug)}
      </span>
    </div>
  );

  if (isAdmin) {
    return (
      <div
        draggable
        onDragStart={() => onDragStart?.(index)}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver?.(index);
        }}
        onDragEnd={onDragEnd}
        className="animate-in"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link 
      to={`/category/${category.slug}`}
      className="animate-in"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => window.scrollTo(0, 0)}
    >
      {cardContent}
    </Link>
  );
};

export default ModernCategoryCard;
