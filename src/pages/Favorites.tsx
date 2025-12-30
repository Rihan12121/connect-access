import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header showSearch={false} />
        <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('favorites.empty')}</h1>
          <p className="text-muted-foreground mb-6">{t('favorites.emptyDescription')}</p>
          <Link to="/" className="btn-primary inline-block px-8 py-3">
            {t('favorites.discoverProducts')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          {t('favorites.title')} ({favorites.length})
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
