import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, TrendingUp, TrendingDown, Loader2, Check, X, MessageSquare, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SellerRating {
  id: string;
  seller_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

interface SellerStats {
  seller_id: string;
  avg_rating: number;
  total_reviews: number;
  verified_reviews: number;
}

const AdminSellerRatings = () => {
  const { language } = useLanguage();
  const [ratings, setRatings] = useState<SellerRating[]>([]);
  const [sellerStats, setSellerStats] = useState<SellerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_ratings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRatings(data || []);

      // Calculate seller stats
      const statsMap = new Map<string, { total: number; sum: number; verified: number }>();
      (data || []).forEach(rating => {
        const current = statsMap.get(rating.seller_id) || { total: 0, sum: 0, verified: 0 };
        statsMap.set(rating.seller_id, {
          total: current.total + 1,
          sum: current.sum + rating.rating,
          verified: current.verified + (rating.is_verified_purchase ? 1 : 0),
        });
      });

      const stats: SellerStats[] = Array.from(statsMap.entries()).map(([seller_id, data]) => ({
        seller_id,
        avg_rating: data.sum / data.total,
        total_reviews: data.total,
        verified_reviews: data.verified,
      }));

      setSellerStats(stats.sort((a, b) => b.avg_rating - a.avg_rating));
    } catch (error) {
      console.error('Error fetching ratings:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seller_ratings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(language === 'de' ? 'Bewertung gelöscht' : 'Rating deleted');
      fetchRatings();
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    );
  };

  const overallStats = {
    totalRatings: ratings.length,
    avgRating: ratings.length > 0 
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) 
      : 0,
    verifiedPurchases: ratings.filter(r => r.is_verified_purchase).length,
    totalSellers: sellerStats.length,
  };

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Seller-Bewertungen' : 'Seller Ratings'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Star className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Seller-Bewertungen' : 'Seller Ratings'}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{overallStats.totalRatings}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Bewertungen' : 'Reviews'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{overallStats.avgRating}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ø Bewertung' : 'Avg Rating'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Check className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{overallStats.verifiedPurchases}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Verifiziert' : 'Verified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{overallStats.totalSellers}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Seller' : 'Sellers'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Seller Leaderboard */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {language === 'de' ? 'Top Seller' : 'Top Sellers'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sellerStats.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      {language === 'de' ? 'Keine Daten' : 'No data'}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {sellerStats.slice(0, 10).map((seller, index) => (
                        <div key={seller.seller_id} className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm truncate">
                              {seller.seller_id.slice(0, 8)}...
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{seller.avg_rating.toFixed(1)}</span>
                          </div>
                          <Badge variant="secondary">{seller.total_reviews}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {language === 'de' ? 'Letzte Bewertungen' : 'Recent Reviews'}
                  </CardTitle>
                </CardHeader>
                {ratings.length === 0 ? (
                  <CardContent>
                    <p className="text-muted-foreground text-center py-4">
                      {language === 'de' ? 'Keine Bewertungen' : 'No reviews'}
                    </p>
                  </CardContent>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'de' ? 'Seller' : 'Seller'}</TableHead>
                        <TableHead>{language === 'de' ? 'Bewertung' : 'Rating'}</TableHead>
                        <TableHead>{language === 'de' ? 'Kommentar' : 'Comment'}</TableHead>
                        <TableHead>{language === 'de' ? 'Verifiziert' : 'Verified'}</TableHead>
                        <TableHead>{language === 'de' ? 'Datum' : 'Date'}</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ratings.slice(0, 20).map((rating) => (
                        <TableRow key={rating.id}>
                          <TableCell className="font-mono text-sm">
                            {rating.seller_id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{renderStars(rating.rating)}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {rating.comment || '-'}
                          </TableCell>
                          <TableCell>
                            {rating.is_verified_purchase ? (
                              <Badge className="bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                {language === 'de' ? 'Verifiziert' : 'Verified'}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                {language === 'de' ? 'Nicht verifiziert' : 'Not verified'}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(rating.created_at).toLocaleDateString('de-DE')}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteRating(rating.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
};

export default AdminSellerRatings;
