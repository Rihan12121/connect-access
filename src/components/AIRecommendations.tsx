import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Brain, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

const AIRecommendations = () => {
  const { language } = useLanguage();
  const { recommendations, loading, reasoning, hasBrowsingHistory } = useAIRecommendations(8);

  // Don't show if no browsing history and no recommendations
  if (!loading && recommendations.length === 0) {
    return null;
  }

  return (
    <section className="container max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-primary/20 rounded-xl">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                {language === 'de' ? 'KI-Empfehlungen' : 'AI Recommendations'}
              </h2>
              <Badge variant="secondary" className="hidden md:flex items-center gap-1 text-xs">
                <Sparkles className="w-3 h-3" />
                {language === 'de' ? 'Personalisiert' : 'Personalized'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">
              {reasoning || (language === 'de' 
                ? 'Basierend auf KI-Analyse Ihres Verhaltens' 
                : 'Based on AI analysis of your behavior')}
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {recommendations.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* AI Badge */}
          {hasBrowsingHistory && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-primary/10 rounded-full text-xs text-muted-foreground">
                <Zap className="w-3 h-3" />
                {language === 'de' 
                  ? 'Empfehlungen werden kontinuierlich durch KI optimiert' 
                  : 'Recommendations are continuously optimized by AI'}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AIRecommendations;
