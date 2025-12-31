import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Favoriten — Noor" description="Ihre Lieblings-Produkte bei Noor" />
        <Header />
        <div className="container max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">{t('favorites.empty')}</h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">{t('favorites.emptyDescription')}</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-3">
              {t('favorites.discoverProducts')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Favoriten — Noor" description="Ihre Lieblings-Produkte bei Noor" />
      <Header />

      <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <p className="section-subheading mb-2">{t('favorites.yourSelection')}</p>
          <h1 className="section-heading">
            {t('favorites.title')} <span className="text-muted-foreground">({favorites.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-children">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} showAddToCart={true} />
          ))}
        </div>
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
