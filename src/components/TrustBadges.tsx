import { Shield, Truck, RotateCcw, CreditCard, Clock, Award, CheckCircle, Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TrustBadges = () => {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Truck,
      title: language === 'de' ? 'Gratis Versand' : 'Free Shipping',
      description: language === 'de' ? 'Ab 50€ Bestellwert' : 'Orders over €50',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Shield,
      title: language === 'de' ? 'Käuferschutz' : 'Buyer Protection',
      description: language === 'de' ? '100% sichere Zahlung' : '100% secure payment',
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-600',
    },
    {
      icon: RotateCcw,
      title: language === 'de' ? '14 Tage Rückgabe' : '14-Day Returns',
      description: language === 'de' ? 'Kostenlos & einfach' : 'Free & easy',
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-600',
    },
    {
      icon: Headphones,
      title: language === 'de' ? '24/7 Support' : '24/7 Support',
      description: language === 'de' ? 'Immer für Sie da' : 'Always here for you',
      color: 'from-violet-500/20 to-violet-500/5',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`relative overflow-hidden bg-gradient-to-br ${badge.color} rounded-2xl border border-border/50 p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 group`}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <badge.icon className="w-full h-full" />
          </div>
          
          <div className="relative z-10">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card shadow-sm flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <badge.icon className={`w-6 h-6 md:w-7 md:h-7 ${badge.iconColor}`} />
            </div>
            <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">{badge.title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
