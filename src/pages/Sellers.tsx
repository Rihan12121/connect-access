import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Star, Loader2, ChevronRight } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

type SellerPublicProfile = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
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

      // 1) Get all sellers from user_roles table (authoritative source)
      const { data: sellerRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "seller");

      if (rolesError) {
        console.error("Error loading sellers (roles):", rolesError);
        setItems([]);
        setLoading(false);
        return;
      }

      const sellerIds = (sellerRoles || []).map((r) => r.user_id).filter(Boolean) as string[];

      if (sellerIds.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      // 2) Also get sellers from products for product count
      const { data: products } = await supabase
        .from("products")
        .select("seller_id")
        .in("seller_id", sellerIds);

      // 2) Load public profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles_public")
        .select("user_id, display_name, avatar_url")
        .in("user_id", sellerIds);

      if (profilesError) {
        console.error("Error loading seller profiles:", profilesError);
      }

      const profileMap = new Map<string, SellerPublicProfile>();
      (profiles || []).forEach((p) => profileMap.set(p.user_id as string, p as SellerPublicProfile));

      // 3) Ratings (public)
      const { data: ratings, error: ratingsError } = await supabase
        .from("seller_ratings")
        .select("seller_id, rating")
        .in("seller_id", sellerIds);

      if (ratingsError) {
        console.error("Error loading seller ratings:", ratingsError);
      }

      const ratingAgg = new Map<string, { sum: number; count: number }>();
      (ratings as SellerRatingRow[] | null | undefined)?.forEach((r) => {
        const cur = ratingAgg.get(r.seller_id) || { sum: 0, count: 0 };
        ratingAgg.set(r.seller_id, { sum: cur.sum + Number(r.rating), count: cur.count + 1 });
      });

      // 4) Product counts
      const productCount = new Map<string, number>();
      (products || []).forEach((p) => {
        if (!p.seller_id) return;
        productCount.set(p.seller_id as string, (productCount.get(p.seller_id as string) || 0) + 1);
      });

      const nextItems: SellerListItem[] = sellerIds
        .map((sellerId) => {
          const profile = profileMap.get(sellerId);
          const agg = ratingAgg.get(sellerId);
          return {
            id: sellerId,
            name: profile?.display_name || `Seller ${sellerId.slice(0, 8).toUpperCase()}`,
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
    return items.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
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

      <main className="container max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold">{language === "de" ? "Verkäufer" : "Sellers"}</h1>
        </div>

        <div className="mb-6">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "de" ? "Nach Verkäufer suchen…" : "Search sellers…"}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {language === "de" ? "Keine Verkäufer gefunden." : "No sellers found."}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((s) => (
              <Link key={s.id} to={`/seller/${s.id}`} className="block">
                <Card className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                          {s.avatarUrl ? (
                            <img
                              src={s.avatarUrl}
                              alt={s.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{s.name}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            ID: {s.id.slice(0, 8).toUpperCase()}…
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {s.avgRating ? s.avgRating.toFixed(1) : "—"}
                      </span>
                      <span className="text-muted-foreground">
                        ({s.totalRatings} {language === "de" ? "Bewertungen" : "ratings"})
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {s.productCount} {language === "de" ? "Produkte" : "products"}
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
