import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Star, Loader2, ChevronRight, Store } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

type SellerInfo = {
  user_id: string;
  shop_name: string;
  display_name: string | null;
  avatar_url: string | null;
  status: string;
};

type SellerRatingRow = {
  seller_id: string;
  rating: number;
};

type SellerListItem = {
  id: string;
  name: string;
  avatarUrl: string | null;
  avgRating: number | null;
  totalRatings: number;
  productCount: number;
};

const Sellers = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<SellerListItem[]>([]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      // 1) Get active sellers from sellers table
      const { data: sellersData, error: sellersError } = await supabase
        .from("sellers")
        .select("user_id, shop_name, status")
        .eq("status", "active");

      // 2) Also get sellers from user_roles as fallback
      const { data: sellerRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "seller");

      if (sellersError) console.error("Error loading sellers:", sellersError);
      if (rolesError) console.error("Error loading seller roles:", rolesError);

      // Combine seller IDs from both sources
      const sellerMap = new Map<string, { shopName?: string }>();
      
      // Add from sellers table (preferred)
      (sellersData || []).forEach((s) => {
        sellerMap.set(s.user_id, { shopName: s.shop_name });
      });
      
      // Add from user_roles (fallback for legacy)
      (sellerRoles || []).forEach((r) => {
        if (!sellerMap.has(r.user_id)) {
          sellerMap.set(r.user_id, {});
        }
      });

      const sellerIds = Array.from(sellerMap.keys());

      if (sellerIds.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      // 3) Load public profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles_public")
        .select("user_id, display_name, avatar_url")
        .in("user_id", sellerIds);

      if (profilesError) console.error("Error loading seller profiles:", profilesError);

      const profileMap = new Map<string, { display_name: string | null; avatar_url: string | null }>();
      (profiles || []).forEach((p) => {
        profileMap.set(p.user_id as string, { 
          display_name: p.display_name, 
          avatar_url: p.avatar_url 
        });
      });

      // 4) Product counts
      const { data: products } = await supabase
        .from("products")
        .select("seller_id")
        .in("seller_id", sellerIds);

      const productCount = new Map<string, number>();
      (products || []).forEach((p) => {
        if (!p.seller_id) return;
        productCount.set(p.seller_id as string, (productCount.get(p.seller_id as string) || 0) + 1);
      });

      // 5) Ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from("seller_ratings")
        .select("seller_id, rating")
        .in("seller_id", sellerIds);

      if (ratingsError) console.error("Error loading seller ratings:", ratingsError);

      const ratingAgg = new Map<string, { sum: number; count: number }>();
      (ratings as SellerRatingRow[] | null | undefined)?.forEach((r) => {
        const cur = ratingAgg.get(r.seller_id) || { sum: 0, count: 0 };
        ratingAgg.set(r.seller_id, { sum: cur.sum + Number(r.rating), count: cur.count + 1 });
      });

      // Build items list
      const nextItems: SellerListItem[] = sellerIds
        .map((sellerId) => {
          const sellerInfo = sellerMap.get(sellerId);
          const profile = profileMap.get(sellerId);
          const agg = ratingAgg.get(sellerId);
          
          // Prioritize shop_name from sellers table, then display_name from profile
          const name = sellerInfo?.shopName || profile?.display_name || `Seller ${sellerId.slice(0, 8).toUpperCase()}`;
          
          return {
            id: sellerId,
            name,
            avatarUrl: profile?.avatar_url || null,
            avgRating: agg ? agg.sum / agg.count : null,
            totalRatings: agg ? agg.count : 0,
            productCount: productCount.get(sellerId) || 0,
          };
        })
        .sort((a, b) => {
          const ar = a.avgRating ?? -1;
          const br = b.avgRating ?? -1;
          if (br !== ar) return br - ar;
          return b.productCount - a.productCount;
        });

      setItems(nextItems);
      setLoading(false);
    };

    run();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => 
      s.name.toLowerCase().includes(q) || 
      s.id.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={language === "de" ? "Verkäufer" : "Sellers"}
        description={
          language === "de"
            ? "Finde Verkäufer und bewerte deine Erfahrung."
            : "Find sellers and rate your experience."
        }
      />
      <Header />

      <main className="container max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold">{language === "de" ? "Verkäufer" : "Sellers"}</h1>
            <span className="text-muted-foreground">({items.length})</span>
          </div>
          <Link to="/become-seller">
            <Button>
              <Store className="w-4 h-4 mr-2" />
              {language === "de" ? "Verkäufer werden" : "Become a Seller"}
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "de" ? "Nach Verkäufer suchen (Name oder ID)…" : "Search sellers (name or ID)…"}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>{language === "de" ? "Keine Verkäufer gefunden." : "No sellers found."}</p>
              {search && (
                <p className="text-sm mt-2">
                  {language === "de" 
                    ? `Keine Ergebnisse für "${search}"` 
                    : `No results for "${search}"`}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Link key={s.id} to={`/seller/${s.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                        {s.avatarUrl ? (
                          <img
                            src={s.avatarUrl}
                            alt={s.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Store className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.productCount} {language === "de" ? "Produkte" : "products"}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className={`w-4 h-4 ${s.avgRating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                      <span className="font-medium">
                        {s.avgRating ? s.avgRating.toFixed(1) : "—"}
                      </span>
                      <span className="text-muted-foreground">
                        ({s.totalRatings} {language === "de" ? "Bewertungen" : "ratings"})
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Sellers;