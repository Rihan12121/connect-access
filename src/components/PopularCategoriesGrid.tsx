import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCategoryOrder } from '@/hooks/useCategoryOrder';

const PopularCategoriesGrid = () => {
  const { language, tCategory } = useLanguage();
  const { categories, isLoading } = useCategoryOrder();

  if (isLoading || categories.length < 4) return null;

  // Take first 4 categories for the grid
  const gridCategories = categories.slice(0, 4);
  const mainCategory = gridCategories[0];
  const sideCategories = gridCategories.slice(1, 4);

  return (
    <section className="container max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">
            {language === 'de' ? 'Shoppen nach Kategorie' : 'Shop by Category'}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {language === 'de' ? 'Beliebte Kategorien' : 'Popular Categories'}
          </h2>
        </div>
        <Link 
          to="/categories" 
          className="premium-link hidden md:flex items-center gap-2"
        >
          {language === 'de' ? 'Alle Kategorien' : 'All Categories'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Large Category */}
        <Link
          to={`/category/${mainCategory.slug}`}
          className="relative col-span-1 md:col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px] rounded-2xl overflow-hidden group"
        >
          <img
            src={mainCategory.image}
            alt={mainCategory.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-xs uppercase tracking-widest text-white/70 font-medium">
              {language === 'de' ? 'Entdecken' : 'Discover'}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-1 group-hover:translate-x-1 transition-transform">
              {tCategory(mainCategory.slug) || mainCategory.name}
            </h3>
            <span className="inline-flex items-center gap-2 text-white/90 text-sm mt-3 font-medium group-hover:gap-3 transition-all">
              {language === 'de' ? 'Jetzt shoppen' : 'Shop Now'}
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Side Categories */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {sideCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="relative aspect-[16/9] rounded-2xl overflow-hidden group"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-bold text-white group-hover:translate-x-1 transition-transform">
                  {tCategory(category.slug) || category.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-white/80 text-xs mt-1 font-medium">
                  {language === 'de' ? 'Entdecken' : 'Explore'}
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile View All */}
      <div className="mt-6 text-center md:hidden">
        <Link 
          to="/categories" 
          className="premium-link inline-flex items-center gap-2"
        >
          {language === 'de' ? 'Alle Kategorien' : 'All Categories'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default PopularCategoriesGrid;
