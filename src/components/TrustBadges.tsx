import { Shield, Truck, RotateCcw, CreditCard, Clock, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TrustBadges = () => {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: language === 'de' ? 'Käuferschutz' : 'Buyer Protection',
      description: language === 'de' ? '100% sicher' : '100% secure',
    },
    {
      icon: Truck,
      title: language === 'de' ? 'Expressversand' : 'Express Shipping',
      description: language === 'de' ? '1-3 Werktage' : '1-3 days',
    },
    {
      icon: RotateCcw,
      title: language === 'de' ? 'Rückgabe' : 'Returns',
      description: language === 'de' ? '14 Tage kostenlos' : '14 days free',
    },
    {
      icon: CreditCard,
      title: language === 'de' ? 'Sichere Zahlung' : 'Secure Payment',
      description: 'SSL',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-4 md:p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/15 transition-all">
            <badge.icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-sm mb-1">{badge.title}</h3>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
