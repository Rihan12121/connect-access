import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import { useCategoryOrder } from '@/hooks/useCategoryOrder';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import CategoryIcon from '@/components/CategoryIcon';
import SEO from '@/components/SEO';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  const { t, tCategory } = useLanguage();
  const { categories, isLoading } = useCategoryOrder();

  // Get product count per category
  const getCategoryProductCount = (slug: string) => {
    return products.filter(p => p.category === slug).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Kategorien — Noor"
        description="Entdecken Sie alle Kategorien bei Noor. Von Baby bis Elektronik - finden Sie was Sie suchen."
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="section-subheading mb-3">{t('ui.discover')}</p>
          <h1 className="section-heading">{t('categories.all')}</h1>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            {t('ui.browseCategories')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden animate-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <img 
                src={category.image} 
                alt={tCategory(category.slug)} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent transition-opacity duration-300" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <CategoryIcon slug={category.slug} size="sm" />
                  <span className="text-xs text-primary-foreground/70 font-medium uppercase tracking-widest">
                    {getCategoryProductCount(category.slug)} Produkte
                  </span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-primary-foreground mb-2">
                  {tCategory(category.slug) || category.name}
                </h2>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm group-hover:text-primary-foreground transition-colors">
                  <span className="uppercase tracking-wider text-xs font-medium">Entdecken</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
