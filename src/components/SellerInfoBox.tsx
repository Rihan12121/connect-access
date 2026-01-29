import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, MessageCircle, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useStartConversation } from "@/hooks/useStartConversation";
import { supabase } from "@/integrations/supabase/client";

interface SellerInfoBoxProps {
  sellerId: string;
}

const SellerInfoBox = ({ sellerId }: SellerInfoBoxProps) => {
  const { language } = useLanguage();
  const { startConversation } = useStartConversation();
  const [loading, setLoading] = useState(true);
  const [sellerName, setSellerName] = useState<string | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      setLoading(true);
      
      // Fetch profile and ratings in parallel
      const [profileRes, ratingsRes] = await Promise.all([
        supabase
          .from("profiles_public")
          .select("display_name")
          .eq("user_id", sellerId)
          .maybeSingle(),
        supabase
          .from("seller_ratings")
          .select("rating")
          .eq("seller_id", sellerId),
      ]);

      if (profileRes.data?.display_name) {
        setSellerName(profileRes.data.display_name);
      }

      if (ratingsRes.data && ratingsRes.data.length > 0) {
        const sum = ratingsRes.data.reduce((s, r) => s + Number(r.rating), 0);
        setAvgRating(sum / ratingsRes.data.length);
        setRatingCount(ratingsRes.data.length);
      }

      setLoading(false);
    };

    if (sellerId) {
      fetchSellerInfo();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <div className="border border-border rounded-xl p-4 mb-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayName = sellerName || `Seller ${sellerId.slice(0, 8).toUpperCase()}`;

  return (
    <div className="border border-border rounded-xl p-4 mb-6 space-y-3">
      <Link 
        to={`/seller/${sellerId}`}
        className="flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold group-hover:text-primary transition-colors">
              {displayName}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {avgRating !== null ? (
                <>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{avgRating.toFixed(1)}</span>
                  <span>({ratingCount} {language === 'de' ? 'Bewertungen' : 'reviews'})</span>
                </>
              ) : (
                <span>{language === 'de' ? 'Neu auf Noor' : 'New on Noor'}</span>
              )}
            </div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
      <Button 
        onClick={() => startConversation(sellerId)}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {language === 'de' ? 'Verkäufer kontaktieren' : 'Contact Seller'}
      </Button>
    </div>
  );
};

export default SellerInfoBox;
