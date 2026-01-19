import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';

const PersonalizedRecommendations = () => {
  const { language } = useLanguage();
  const { recommendations, continueShopping, loading, hasBrowsingHistory } = usePersonalizedRecommendations(8);

  // Don't show if no browsing history and no recommendations
  if (!loading && recommendations.length === 0 && continueShopping.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* For You Section */}
      {(loading || recommendations.length > 0) && (
        <section className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  {language === 'de' ? 'Für Sie empfohlen' : 'Recommended for You'}
                </h2>
                <p className="text-sm text-muted-foreground hidden md:block">
                  {language === 'de' 
                    ? 'Basierend auf Ihrem Browsing-Verlauf und Einkäufen' 
                    : 'Based on your browsing history and purchases'}
                </p>
              </div>
            </div>
            <Link
              to="/products"
              className="premium-link hidden md:flex items-center gap-2"
            >
              {language === 'de' ? 'Alle ansehen' : 'View All'}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-3">
                  <Skeleton className="aspect-square rounded-xl mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {recommendations.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Continue Shopping Section */}
      {!loading && continueShopping.length > 0 && hasBrowsingHistory && (
        <section className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-secondary/50 via-secondary/30 to-transparent rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-foreground">
                    {language === 'de' ? 'Weitershoppen' : 'Continue Shopping'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' 
                      ? 'Mehr aus Ihrer Lieblingskategorie' 
                      : 'More from your favorite category'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {continueShopping.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
