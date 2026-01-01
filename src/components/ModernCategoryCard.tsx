import { useState, useRef } from 'react';
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
  GripVertical,
  Trash2,
  Pencil,
  X
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DatabaseCategory } from '@/hooks/useCategoryOrder';
import { products } from '@/data/products';

interface ModernCategoryCardProps {
  category: DatabaseCategory;
  index: number;
  isAdmin?: boolean;
  isDragging?: boolean;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDragEnd?: () => void;
  onTouchStart?: (index: number, e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
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

// Icon background colors
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
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onEdit,
  onDelete
}: ModernCategoryCardProps) => {
  const { tCategory } = useLanguage();
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const Icon = iconMap[category.icon] || Home;
  const iconBg = iconBgMap[category.slug] || 'bg-gradient-to-br from-gray-400 to-gray-500 text-white';

  // Get products for this category (max 3)
  const categoryProducts = products.filter(p => p.category === category.slug).slice(0, 3);

  const handleMouseEnter = () => {
    if (!isAdmin) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowPreview(false);
  };

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
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <>
          <div 
            className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4 text-gray-600" />
          </div>
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white transition-all"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-2">
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
        <span className="text-sm font-semibold text-white leading-tight drop-shadow-md">
          {tCategory(category.slug) || category.name}
        </span>
      </div>

      {/* Product Preview Popup */}
      {showPreview && categoryProducts.length > 0 && (
        <div 
          className="absolute left-full top-0 ml-2 z-50 w-64 bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200"
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <div className="p-3 bg-muted/50 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Produkte</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowPreview(false);
              }}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="p-2 space-y-2 max-h-[280px] overflow-y-auto">
            {categoryProducts.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-primary font-semibold">{product.price.toFixed(2)} €</p>
                </div>
              </Link>
            ))}
          </div>
          <Link 
            to={`/category/${category.slug}`}
            className="block p-3 text-center text-sm text-primary hover:bg-muted transition-colors border-t border-border"
          >
            Alle anzeigen →
          </Link>
        </div>
      )}
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
        onTouchStart={(e) => onTouchStart?.(index, e)}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="animate-in touch-none"
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
