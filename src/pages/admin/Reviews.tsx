import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  Star, 
  Loader2,
  Trash2,
  User
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { products } from '@/data/products';

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

const AdminReviews = () => {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm(language === 'de' ? 'Bewertung wirklich löschen?' : 'Really delete this review?')) {
      return;
    }

    setDeleting(reviewId);

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } else {
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success(language === 'de' ? 'Bewertung gelöscht' : 'Review deleted');
    }

    setDeleting(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || productId;
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={language === 'de' ? 'Bewertungen verwalten' : 'Manage Reviews'}
        description="Admin - Bewertungen verwalten"
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === 'de' ? 'Bewertungen' : 'Reviews'}
            </h1>
            <span className="text-muted-foreground">({reviews.length})</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>{language === 'de' ? 'Keine Bewertungen vorhanden' : 'No reviews yet'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {review.user_name || (language === 'de' ? 'Anonym' : 'Anonymous')}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/product/${review.product_id}`}
                      className="text-sm text-primary hover:underline block mb-2"
                    >
                      {getProductName(review.product_id)}
                    </Link>

                    <StarRating rating={review.rating} />
                    
                    <h4 className="font-semibold text-foreground mt-3">{review.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{review.content}</p>
                  </div>

                  <button
                    onClick={() => deleteReview(review.id)}
                    disabled={deleting === review.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title={language === 'de' ? 'Löschen' : 'Delete'}
                  >
                    {deleting === review.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminReviews;
