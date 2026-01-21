import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Review {
  rating: number;
}

interface ReviewHistogramProps {
  reviews: Review[];
  averageRating: number;
}

const ReviewHistogram = ({ reviews, averageRating }: ReviewHistogramProps) => {
  const { language } = useLanguage();
  
  const totalReviews = reviews.length;
  
  // Calculate distribution
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  if (totalReviews === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Average Rating */}
        <div className="text-center md:text-left shrink-0">
          <div className="text-5xl font-bold text-foreground mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {totalReviews} {language === 'de' ? 'Bewertungen' : 'Reviews'}
          </p>
        </div>

        {/* Histogram */}
        <div className="flex-1 space-y-2">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16 shrink-0">
                <span className="text-sm font-medium text-foreground">{star}</span>
                <Star className="w-4 h-4 fill-[hsl(var(--deal))] text-[hsl(var(--deal))]" />
              </div>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[hsl(var(--deal))] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewHistogram;
