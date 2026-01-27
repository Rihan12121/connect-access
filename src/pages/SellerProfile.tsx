import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Loader2, ArrowLeft } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SellerPublicProfile = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
};

type SellerRating = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  is_verified_purchase: boolean;
};

const SellerProfile = () => {
  const { id } = useParams();
  const sellerId = id || "";
  const { language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SellerPublicProfile | null>(null);
  const [ratings, setRatings] = useState<SellerRating[]>([]);
  const [ratingValue, setRatingValue] = useState("5");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    if (ratings.length === 0) return { avg: null as number | null, count: 0, verified: 0 };
    const sum = ratings.reduce((s, r) => s + Number(r.rating), 0);
    const verified = ratings.filter((r) => r.is_verified_purchase).length;
    return { avg: sum / ratings.length, count: ratings.length, verified };
  }, [ratings]);

  useEffect(() => {
    const run = async () => {
      if (!sellerId) return;
      setLoading(true);

      const { data: p, error: pErr } = await supabase
        .from("profiles_public")
        .select("user_id, display_name, avatar_url")
        .eq("user_id", sellerId)
        .maybeSingle();

      if (pErr) console.error("Error loading seller profile:", pErr);
      setProfile((p as SellerPublicProfile) || null);

      const { data: r, error: rErr } = await supabase
        .from("seller_ratings")
        .select("id, rating, comment, created_at, is_verified_purchase")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (rErr) console.error("Error loading seller ratings:", rErr);
      setRatings((r as SellerRating[]) || []);

      setLoading(false);
    };
    run();
  }, [sellerId]);

  const submitRating = async () => {
    if (!user) {
      toast.error(language === "de" ? "Bitte anmelden" : "Please sign in");
      return;
    }
    if (!sellerId) return;

    const rating = Number(ratingValue);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) return;

    setSubmitting(true);
    const { error } = await supabase.functions.invoke("create-seller-rating", {
      body: {
        sellerId,
        rating,
        comment: comment.trim() ? comment.trim() : null,
      },
    });

    if (error) {
      console.error("Error creating seller rating:", error);
      toast.error(language === "de" ? "Bewertung fehlgeschlagen" : "Rating failed");
      setSubmitting(false);
      return;
    }

    toast.success(language === "de" ? "Bewertung gespeichert" : "Rating saved");
    setComment("");
    setRatingValue("5");

    // refresh
    const { data: r } = await supabase
      .from("seller_ratings")
      .select("id, rating, comment, created_at, is_verified_purchase")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    setRatings((r as SellerRating[]) || []);

    setSubmitting(false);
  };

  const sellerName = profile?.display_name || `Seller ${sellerId.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={language === "de" ? `Seller: ${sellerName}` : `Seller: ${sellerName}`}
        description={
          language === "de"
            ? `Bewertungen & Profil von ${sellerName}.`
            : `Ratings & profile for ${sellerName}.`
        }
      />
      <Header />

      <main className="container max-w-5xl mx-auto px-4 py-10">
        <Link to="/sellers" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {language === "de" ? "Zurück zu Verkäufern" : "Back to sellers"}
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={sellerName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold truncate">{sellerName}</div>
                    <div className="text-sm text-muted-foreground">ID: {sellerId}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{stats.avg ? stats.avg.toFixed(1) : "—"}</span>
                  <span className="text-sm text-muted-foreground">({stats.count})</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === "de" ? "Verifiziert:" : "Verified:"} {stats.verified}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "de" ? "Seller bewerten" : "Rate this seller"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="text-sm text-muted-foreground">
                    {language === "de" ? (
                      <>
                        Bitte <Link className="text-primary hover:underline" to="/auth">anmelden</Link>, um zu bewerten.
                      </>
                    ) : (
                      <>
                        Please <Link className="text-primary hover:underline" to="/auth">sign in</Link> to rate.
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2 max-w-xs">
                      <Select value={ratingValue} onValueChange={setRatingValue}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((v) => (
                            <SelectItem key={v} value={String(v)}>
                              {v} {language === "de" ? "Sterne" : "stars"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={language === "de" ? "Kommentar (optional)" : "Comment (optional)"}
                    />
                    <Button onClick={submitRating} disabled={submitting}>
                      {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {language === "de" ? "Bewertung senden" : "Submit rating"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "de" ? "Bewertungen" : "Reviews"}</CardTitle>
              </CardHeader>
              <CardContent>
                {ratings.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {language === "de" ? "Noch keine Bewertungen." : "No reviews yet."}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ratings.slice(0, 20).map((r) => (
                      <div key={r.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{Number(r.rating).toFixed(0)}/5</span>
                            {r.is_verified_purchase ? (
                              <span className="text-xs text-muted-foreground">
                                ({language === "de" ? "verifiziert" : "verified"})
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString(language === "de" ? "de-DE" : "en-US")}
                          </div>
                        </div>
                        {r.comment ? <p className="text-sm mt-2">{r.comment}</p> : null}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SellerProfile;
