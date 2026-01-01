import { useState, useEffect } from 'react';
import { Star, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string;
  content: string;
  user_name: string | null;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().trim().min(1, 'Titel erforderlich').max(100, 'Titel zu lang'),
  content: z.string().trim().min(10, 'Mindestens 10 Zeichen').max(1000, 'Maximal 1000 Zeichen'),
  user_name: z.string().trim().max(50).optional(),
});

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    user_name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      toast.error(language === 'de' ? 'Bitte melden Sie sich an' : 'Please sign in');
      return;
    }

    // Validate form
    const result = reviewSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      product_id: productId,
      rating: formData.rating,
      title: formData.title.trim(),
      content: formData.content.trim(),
      user_name: formData.user_name.trim() || null,
    });

    if (error) {
      console.error('Error submitting review:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving review');
    } else {
      toast.success(language === 'de' ? 'Bewertung gespeichert!' : 'Review submitted!');
      setFormData({ rating: 5, title: '', content: '', user_name: '' });
      setShowForm(false);
      fetchReviews();
    }

    setSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const StarRating = ({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive && onChange ? () => onChange(star) : undefined}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-muted text-muted'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-16 pt-10 border-t border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {language === 'de' ? 'Kundenbewertungen' : 'Customer Reviews'}
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({reviews.length} {language === 'de' ? 'Bewertungen' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            {language === 'de' ? 'Bewertung schreiben' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {language === 'de' ? 'Ihre Bewertung' : 'Your Review'}
          </h3>

          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                {language === 'de' ? 'Bewertung' : 'Rating'}
              </label>
              <StarRating
                rating={formData.rating}
                interactive
                onChange={(r) => setFormData({ ...formData, rating: r })}
              />
            </div>

            {/* Name (optional) */}
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                {language === 'de' ? 'Name (optional)' : 'Name (optional)'}
              </label>
              <input
                type="text"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                placeholder={language === 'de' ? 'Anonym' : 'Anonymous'}
                maxLength={50}
                className="w-full px-4 py-2.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                {language === 'de' ? 'Titel' : 'Title'} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={100}
                className="w-full px-4 py-2.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                {language === 'de' ? 'Bewertung' : 'Review'} *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={4}
                maxLength={1000}
                placeholder={language === 'de' ? 'Was hat Ihnen gefallen oder nicht gefallen?' : 'What did you like or dislike?'}
                className="w-full px-4 py-2.5 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 resize-none"
              />
              {errors.content && <p className="text-destructive text-xs mt-1">{errors.content}</p>}
              <p className="text-xs text-muted-foreground mt-1">{formData.content.length}/1000</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {language === 'de' ? 'Absenden' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Sign in prompt */}
      {!user && (
        <div className="bg-muted/50 rounded-xl p-6 mb-8 text-center">
          <p className="text-muted-foreground mb-3">
            {language === 'de' 
              ? 'Melden Sie sich an, um eine Bewertung zu schreiben'
              : 'Sign in to write a review'}
          </p>
          <a href="/auth" className="text-primary hover:underline font-medium">
            {language === 'de' ? 'Jetzt anmelden' : 'Sign in now'}
          </a>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{language === 'de' ? 'Noch keine Bewertungen' : 'No reviews yet'}</p>
          <p className="text-sm mt-1">
            {language === 'de' ? 'Seien Sie der Erste!' : 'Be the first to review!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {review.user_name || (language === 'de' ? 'Anonym' : 'Anonymous')}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              
              <h4 className="font-semibold text-foreground mt-4">{review.title}</h4>
              <p className="text-muted-foreground mt-2 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
