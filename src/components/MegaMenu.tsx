import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Percent, TrendingUp, Star, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/products';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const promoItems = [
  { icon: Percent, label: { de: 'Bis zu 50% Rabatt', en: 'Up to 50% off' }, link: '/products?filter=deals', color: 'text-deal' },
  { icon: Sparkles, label: { de: 'Neuheiten', en: 'New Arrivals' }, link: '/products?sort=newest', color: 'text-primary' },
  { icon: TrendingUp, label: { de: 'Bestseller', en: 'Bestsellers' }, link: '/products?sort=popular', color: 'text-success' },
];

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const { language, tCategory } = useLanguage();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  // Split categories into columns
  const midpoint = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, midpoint);
  const rightCategories = categories.slice(midpoint);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Mega Menu */}
      <div 
        className="absolute left-0 right-0 top-full bg-card border-b border-border shadow-elevated z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        onMouseLeave={onClose}
      >
        <div className="container max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Categories - Left Column */}
            <div className="col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {language === 'de' ? 'Kategorien' : 'Categories'}
              </h3>
              <ul className="space-y-1">
                {leftCategories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      onClick={onClose}
                      onMouseEnter={() => setHoveredCategory(category.slug)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        hoveredCategory === category.slug
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        {tCategory(category.slug)}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories - Right Column */}
            <div className="col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                &nbsp;
              </h3>
              <ul className="space-y-1">
                {rightCategories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      onClick={onClose}
                      onMouseEnter={() => setHoveredCategory(category.slug)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        hoveredCategory === category.slug
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        {tCategory(category.slug)}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Promo Section */}
            <div className="col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {language === 'de' ? 'Highlights' : 'Highlights'}
              </h3>
              <div className="space-y-3">
                {promoItems.map((promo, idx) => (
                  <Link
                    key={idx}
                    to={promo.link}
                    onClick={onClose}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted hover:from-primary/10 hover:to-primary/5 transition-all group"
                  >
                    <div className={`p-2 rounded-lg bg-background ${promo.color}`}>
                      <promo.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {promo.label[language]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Banner */}
            <div className="col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {language === 'de' ? 'Empfohlen' : 'Featured'}
              </h3>
              <Link
                to="/products?filter=deals"
                onClick={onClose}
                className="block relative rounded-xl overflow-hidden group aspect-[4/3]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <Zap className="w-10 h-10 text-primary-foreground mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl font-bold text-primary-foreground mb-2">
                    {language === 'de' ? 'Flash Sale' : 'Flash Sale'}
                  </h4>
                  <p className="text-sm text-primary-foreground/80">
                    {language === 'de' ? 'Bis zu 50% sparen' : 'Save up to 50%'}
                  </p>
                  <span className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-primary-foreground group-hover:bg-white/30 transition-colors">
                    {language === 'de' ? 'Jetzt shoppen' : 'Shop Now'} →
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom Quick Links */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/products"
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <Star className="w-4 h-4" />
                {language === 'de' ? 'Alle Produkte ansehen' : 'View All Products'}
              </Link>
              <Link
                to="/categories"
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {language === 'de' ? 'Alle Kategorien' : 'All Categories'}
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'de' ? '✨ Kostenloser Versand ab 50€' : '✨ Free shipping over €50'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;
