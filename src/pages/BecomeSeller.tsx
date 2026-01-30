import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useIsSeller } from "@/hooks/useIsSeller";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BecomeSeller = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { isSeller, loading: sellerLoading } = useIsSeller();
  const navigate = useNavigate();
  
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(language === "de" ? "Bitte melden Sie sich an" : "Please sign in first");
      navigate("/auth");
      return;
    }

    if (!shopName.trim()) {
      toast.error(language === "de" ? "Shop-Name ist erforderlich" : "Shop name is required");
      return;
    }

    setSubmitting(true);

    try {
      // Update profile with shop name as display_name
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: shopName.trim() })
        .eq("user_id", user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      // Request seller role - this will be pending admin approval
      // For now, we'll insert a request that admins can review
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role: "seller" });

      if (error) {
        if (error.code === "23505") {
          toast.info(language === "de" ? "Sie sind bereits Verkäufer" : "You are already a seller");
          navigate("/seller");
        } else {
          console.error("Seller role error:", error);
          toast.error(language === "de" ? "Fehler bei der Anfrage" : "Error submitting request");
        }
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      toast.success(language === "de" ? "Erfolgreich als Verkäufer registriert!" : "Successfully registered as seller!");
      
      // Redirect to seller dashboard after short delay
      setTimeout(() => {
        navigate("/seller");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      toast.error(language === "de" ? "Ein Fehler ist aufgetreten" : "An error occurred");
    }
    
    setSubmitting(false);
  };

  // Already a seller - redirect
  if (!sellerLoading && isSeller) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-2xl mx-auto px-4 py-10">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {language === "de" ? "Sie sind bereits Verkäufer!" : "You're already a seller!"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "de" 
                  ? "Gehen Sie zu Ihrem Dashboard, um Ihre Produkte zu verwalten."
                  : "Go to your dashboard to manage your products."}
              </p>
              <Button onClick={() => navigate("/seller")}>
                <Store className="w-4 h-4 mr-2" />
                {language === "de" ? "Zum Verkäufer-Dashboard" : "Go to Seller Dashboard"}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-2xl mx-auto px-4 py-10">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {language === "de" ? "Willkommen als Verkäufer!" : "Welcome as a Seller!"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === "de" 
                  ? "Sie werden in Kürze zum Dashboard weitergeleitet..."
                  : "You will be redirected to your dashboard shortly..."}
              </p>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={language === "de" ? "Verkäufer werden" : "Become a Seller"}
        description={language === "de" 
          ? "Starten Sie Ihren eigenen Shop auf Noor Marktplatz"
          : "Start your own shop on Noor Marketplace"}
      />
      <Header />

      <main className="container max-w-2xl mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          {language === "de" ? "Zurück zur Startseite" : "Back to Home"}
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {language === "de" ? "Verkäufer werden" : "Become a Seller"}
            </CardTitle>
            <CardDescription>
              {language === "de" 
                ? "Starten Sie Ihren eigenen Shop und verkaufen Sie Ihre Produkte auf Noor"
                : "Start your own shop and sell your products on Noor"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {language === "de" 
                    ? "Bitte melden Sie sich an, um fortzufahren"
                    : "Please sign in to continue"}
                </p>
                <Button onClick={() => navigate("/auth")}>
                  {language === "de" ? "Anmelden" : "Sign In"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName">
                    {language === "de" ? "Shop-Name *" : "Shop Name *"}
                  </Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={language === "de" ? "z.B. Mein Shop" : "e.g. My Shop"}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "de" 
                      ? "Dieser Name wird öffentlich angezeigt"
                      : "This name will be displayed publicly"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {language === "de" ? "Beschreibung (optional)" : "Description (optional)"}
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === "de" 
                      ? "Erzählen Sie uns etwas über Ihren Shop..."
                      : "Tell us about your shop..."}
                    rows={4}
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">
                    {language === "de" ? "Als Verkäufer können Sie:" : "As a seller you can:"}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ {language === "de" ? "Unbegrenzt Produkte einstellen" : "List unlimited products"}</li>
                    <li>✓ {language === "de" ? "Bestellungen verwalten" : "Manage orders"}</li>
                    <li>✓ {language === "de" ? "Mit Kunden kommunizieren" : "Communicate with customers"}</li>
                    <li>✓ {language === "de" ? "Verkaufsanalysen einsehen" : "View sales analytics"}</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === "de" ? "Wird verarbeitet..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4 mr-2" />
                      {language === "de" ? "Jetzt Verkäufer werden" : "Become a Seller Now"}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default BecomeSeller;
