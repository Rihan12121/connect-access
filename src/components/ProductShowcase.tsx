import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
  isLoading?: boolean;
  viewAllLink?: string;
  showAddToCart?: boolean;
}

const ProductShowcase = ({
  title,
  subtitle,
  products,
  isLoading = false,
  viewAllLink,
  showAddToCart = false,
}: ProductShowcaseProps) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (products.length === 0 && !isLoading) return null;

  return (
    <section className="container max-w-[1400px] mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          {subtitle && (
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Scroll Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
          
          {viewAllLink && (
            <Link 
              to={viewAllLink} 
              className="premium-link hidden md:flex items-center gap-2 group"
            >
              {t('categories.viewAll')}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Products Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[160px] md:w-[200px] flex-shrink-0 aspect-[4/5] bg-muted animate-pulse rounded-xl"
              />
            ))
          : products.map((product) => (
              <div key={product.id} className="w-[160px] md:w-[200px] flex-shrink-0">
                <ProductCard product={product} showAddToCart={showAddToCart} />
              </div>
            ))}
      </div>

      {/* Mobile View All */}
      {viewAllLink && (
        <div className="mt-4 text-center md:hidden">
          <Link 
            to={viewAllLink} 
            className="premium-link inline-flex items-center gap-2"
          >
            {t('categories.viewAll')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProductShowcase;
