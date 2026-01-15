import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BannerProps {
  variant?: 'primary' | 'secondary' | 'accent';
}

const FeaturedBanner = ({ variant = 'primary' }: BannerProps) => {
  const { language } = useLanguage();

  const banners = {
    primary: {
      icon: Sparkles,
      badge: language === 'de' ? 'Neu eingetroffen' : 'New Arrivals',
      title: language === 'de' ? 'Entdecken Sie die neuesten Trends' : 'Discover the Latest Trends',
      description: language === 'de' 
        ? 'Frische Styles und Bestseller für jeden Geschmack'
        : 'Fresh styles and bestsellers for every taste',
      cta: language === 'de' ? 'Jetzt entdecken' : 'Explore Now',
      link: '/products',
      gradient: 'from-primary/15 via-primary/5 to-accent/10',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary',
    },
    secondary: {
      icon: Star,
      badge: language === 'de' ? 'Bestseller' : 'Bestsellers',
      title: language === 'de' ? 'Von Kunden am meisten geliebt' : 'Most Loved by Customers',
      description: language === 'de'
        ? 'Die beliebtesten Produkte unserer Community'
        : 'The most popular products from our community',
      cta: language === 'de' ? 'Top-Produkte' : 'Top Products',
      link: '/products',
      gradient: 'from-amber-500/15 via-amber-500/5 to-orange-500/10',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-600',
    },
    accent: {
      icon: TrendingUp,
      badge: language === 'de' ? 'Trending' : 'Trending',
      title: language === 'de' ? 'Diese Woche im Trend' : 'Trending This Week',
      description: language === 'de'
        ? 'Die am schnellsten wachsenden Kategorien'
        : 'The fastest growing categories',
      cta: language === 'de' ? 'Trends ansehen' : 'View Trends',
      link: '/categories',
      gradient: 'from-emerald-500/15 via-emerald-500/5 to-teal-500/10',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-600',
    },
  };

  const banner = banners[variant];
  const Icon = banner.icon;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${banner.gradient} rounded-2xl border border-border group hover:shadow-lg transition-all duration-300`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,white/5,transparent_50%)]" />
      
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 ${banner.iconBg} rounded-xl shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${banner.iconColor}`} />
          </div>
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${banner.iconColor}`}>
              {banner.badge}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-foreground mt-1">
              {banner.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {banner.description}
            </p>
          </div>
        </div>

        <Link
          to={banner.link}
          className={`inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors shrink-0 group/btn`}
        >
          {banner.cta}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedBanner;
