import { useState, useEffect } from 'react';
import { Clock, Zap, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DynamicPricingProps {
  basePrice: number;
  productId: string;
  category: string;
}

interface PriceModifier {
  type: 'time' | 'demand' | 'flash';
  discount: number;
  label: string;
  expiresAt?: Date;
}

const DynamicPricing = ({ basePrice, productId, category }: DynamicPricingProps) => {
  const { language } = useLanguage();
  const [modifier, setModifier] = useState<PriceModifier | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Simulate dynamic pricing logic
    const hour = new Date().getHours();
    
    // Night discount (22:00 - 06:00)
    if (hour >= 22 || hour < 6) {
      setModifier({
        type: 'time',
        discount: 5,
        label: language === 'de' ? 'Nacht-Rabatt' : 'Night Discount',
      });
    }
    // Weekend flash sale
    else if (new Date().getDay() === 0 || new Date().getDay() === 6) {
      const expiresAt = new Date();
      expiresAt.setHours(23, 59, 59, 999);
      setModifier({
        type: 'flash',
        discount: 10,
        label: language === 'de' ? 'Wochenend-Deal' : 'Weekend Deal',
        expiresAt,
      });
    }
  }, [language]);

  // Countdown timer
  useEffect(() => {
    if (!modifier?.expiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = modifier.expiresAt!.getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('');
        setModifier(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [modifier?.expiresAt]);

  if (!modifier) return null;

  const discountedPrice = basePrice * (1 - modifier.discount / 100);

  const icons = {
    time: Clock,
    demand: TrendingUp,
    flash: Zap,
  };

  const Icon = icons[modifier.type];

  return (
    <div className="bg-deal/10 border border-deal/20 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-deal" />
          <span className="text-sm font-medium text-deal">{modifier.label}</span>
          <span className="bg-deal text-deal-foreground text-xs font-bold px-2 py-0.5 rounded">
            -{modifier.discount}%
          </span>
        </div>
        {timeLeft && (
          <div className="text-xs font-mono text-deal">
            {language === 'de' ? 'Endet in' : 'Ends in'} {timeLeft}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPricing;
