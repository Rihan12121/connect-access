import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Clock, Zap, ArrowRight } from 'lucide-react';
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
    <section className="container max-w-[1400px] mx-auto px-4 md:px-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-deal/15 via-deal/5 to-transparent rounded-3xl border border-deal/20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--deal)/0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,hsl(var(--deal)/0.1),transparent_40%)]" />
        
        <div className="relative p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-deal/20 rounded-2xl animate-pulse">
                <Flame className="w-8 h-8 text-deal" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-deal" />
                  <span className="text-xs font-bold text-deal uppercase tracking-widest">
                    {language === 'de' ? 'Limitierte Zeit' : 'Limited Time'}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {language === 'de' ? 'Blitzangebote' : 'Flash Deals'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'de' ? 'Bis zu 50% Rabatt - nur heute!' : 'Up to 50% off - today only!'}
                </p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border">
              <Clock className="w-5 h-5 text-deal hidden sm:block" />
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                {language === 'de' ? 'Endet in:' : 'Ends in:'}
              </span>
              <div className="flex gap-2">
                {[
                  { value: timeLeft.hours, label: language === 'de' ? 'Std' : 'hrs' },
                  { value: timeLeft.minutes, label: 'min' },
                  { value: timeLeft.seconds, label: 'sec' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-foreground text-background font-mono font-bold text-xl md:text-2xl px-3 py-2 rounded-lg min-w-[3rem] text-center shadow-lg">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted/50 animate-pulse rounded-xl" />
                ))
              : dealProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} showAddToCart />
                ))}
          </div>

          {/* View All CTA */}
          <div className="mt-8 text-center">
            <Link
              to="/products?filter=deals"
              className="inline-flex items-center gap-3 px-8 py-4 bg-deal text-white rounded-xl font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-deal/30"
            >
              {language === 'de' ? 'Alle Angebote entdecken' : 'View All Deals'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashDealsSection;
