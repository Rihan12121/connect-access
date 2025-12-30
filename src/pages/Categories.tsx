import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Categories = () => {
  const { t, tCategory } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t('categories.all')}</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(category => (
            <Link 
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group relative aspect-square rounded-2xl overflow-hidden"
            >
              <img 
                src={category.image} 
                alt={tCategory(category.slug)} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{category.icon}</span>
                  <span className="text-white font-bold text-lg">{tCategory(category.slug)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
