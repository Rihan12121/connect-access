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

// Real category images
const imageMap: Record<string, string> = {
  'baby': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop&q=80',
  'schoenheit': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80',
  'elektronik': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop&q=80',
  'beleuchtung': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop&q=80',
  'haus-kueche': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80',
  'garten': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80',
  'schmuck': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&q=80',
  'spielzeug': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop&q=80',
  'kleidung': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80',
  'sport-outdoor': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80',
  'sex-sinnlichkeit': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80',
  'speisen-getraenke': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&q=80',
};

// Icon background colors (soft pastels)
const iconBgMap: Record<string, string> = {
  'baby': 'bg-gradient-to-br from-pink-400 to-pink-500 text-white',
  'schoenheit': 'bg-gradient-to-br from-purple-400 to-purple-500 text-white',
  'elektronik': 'bg-gradient-to-br from-blue-400 to-blue-500 text-white',
  'beleuchtung': 'bg-gradient-to-br from-amber-400 to-amber-500 text-white',
  'haus-kueche': 'bg-gradient-to-br from-orange-400 to-orange-500 text-white',
  'garten': 'bg-gradient-to-br from-green-400 to-green-500 text-white',
  'schmuck': 'bg-gradient-to-br from-cyan-400 to-cyan-500 text-white',
  'spielzeug': 'bg-gradient-to-br from-red-400 to-red-500 text-white',
  'kleidung': 'bg-gradient-to-br from-indigo-400 to-indigo-500 text-white',
  'sport-outdoor': 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white',
  'sex-sinnlichkeit': 'bg-gradient-to-br from-rose-400 to-rose-500 text-white',
  'speisen-getraenke': 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
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
  const iconBg = iconBgMap[category.slug] || 'bg-gray-400 text-white';
  const image = imageMap[category.slug] || category.image;

  const cardContent = (
    <div 
      className={`
        relative flex flex-col
        w-[160px] h-[200px] flex-shrink-0
        rounded-2xl
        overflow-hidden
        shadow-md hover:shadow-xl
        transition-all duration-300 ease-out
        hover:-translate-y-2
        cursor-pointer
        group
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={tCategory(category.slug)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Admin drag handle */}
      {isAdmin && (
        <div 
          className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-2">
        {/* Icon */}
        <div 
          className={`
            w-10 h-10
            ${iconBg}
            rounded-xl
            flex items-center justify-center
            shadow-lg
            group-hover:scale-110
            transition-transform duration-300
          `}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>

        {/* Category name */}
        <span className="text-sm font-semibold text-white leading-tight drop-shadow-md">
          {tCategory(category.slug)}
        </span>
      </div>
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
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link 
      to={`/category/${category.slug}`}
      className="animate-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => window.scrollTo(0, 0)}
    >
      {cardContent}
    </Link>
  );
};

export default ModernCategoryCard;
