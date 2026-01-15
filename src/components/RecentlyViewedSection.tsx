import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, History } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useProduct } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

// Simple hook to get recently viewed product IDs from localStorage
const useRecentlyViewed = () => {
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setProductIds(JSON.parse(stored).slice(0, 8));
      } catch {
        setProductIds([]);
      }
    }
  }, []);

  return productIds;
};

// Export helper to add product to recently viewed
export const addToRecentlyViewed = (productId: string) => {
  const stored = localStorage.getItem('recentlyViewed');
  let recent: string[] = [];
  
  try {
    recent = stored ? JSON.parse(stored) : [];
  } catch {
    recent = [];
  }

  // Remove if exists, add to front
  recent = recent.filter(id => id !== productId);
  recent.unshift(productId);
  
  // Keep max 20
  localStorage.setItem('recentlyViewed', JSON.stringify(recent.slice(0, 20)));
};

interface RecentProductCardProps {
  productId: string;
}

const RecentProductCard = ({ productId }: RecentProductCardProps) => {
  const { product, isLoading } = useProduct(productId);

  if (isLoading || !product) return null;

  return <ProductCard product={product} />;
};

const RecentlyViewedSection = () => {
  const { language } = useLanguage();
  const recentIds = useRecentlyViewed();

  if (recentIds.length === 0) return null;

  return (
    <section className="container max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-xl">
            <History className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              {language === 'de' ? 'Kürzlich angesehen' : 'Recently Viewed'}
            </h2>
            <p className="text-sm text-muted-foreground hidden md:block">
              {language === 'de' ? 'Dort weitermachen, wo Sie aufgehört haben' : 'Pick up where you left off'}
            </p>
          </div>
        </div>
        <Link
          to="/products"
          className="premium-link hidden md:flex items-center gap-2"
        >
          {language === 'de' ? 'Alle Produkte' : 'All Products'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {recentIds.slice(0, 6).map((id) => (
          <RecentProductCard key={id} productId={id} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
