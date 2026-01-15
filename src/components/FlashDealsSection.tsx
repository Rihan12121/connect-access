import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useDealProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

const FlashDealsSection = () => {
  const { language, t } = useLanguage();
  const { products: dealProducts, isLoading } = useDealProducts(6);
  
  // Countdown timer (ends at midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (dealProducts.length === 0 && !isLoading) return null;

  return (
    <section className="container max-w-6xl mx-auto px-4 md:px-6">
      <div className="bg-gradient-to-r from-deal/10 via-deal/5 to-transparent rounded-2xl p-6 md:p-8 border border-deal/20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-deal/20 rounded-xl">
              <Flame className="w-6 h-6 text-deal" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                {language === 'de' ? 'Blitzangebote' : 'Flash Deals'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Endet heute um Mitternacht' : 'Ends today at midnight'}
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-deal" />
            <div className="flex gap-2">
              {[
                { value: timeLeft.hours, label: 'h' },
                { value: timeLeft.minutes, label: 'm' },
                { value: timeLeft.seconds, label: 's' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="bg-foreground text-background font-mono font-bold text-lg px-2 py-1 rounded">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-xl" />
              ))
            : dealProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {/* View All */}
        <div className="mt-6 text-center">
          <Link
            to="/products?filter=deals"
            className="inline-flex items-center gap-2 text-deal hover:text-deal/80 font-semibold transition-colors"
          >
            {language === 'de' ? 'Alle Angebote anzeigen' : 'View all deals'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashDealsSection;
