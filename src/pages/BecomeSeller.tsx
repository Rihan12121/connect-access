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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useIsSeller } from "@/hooks/useIsSeller";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const COUNTRIES = [
  "Deutschland", "Österreich", "Schweiz", "Frankreich", "Italien", 
  "Spanien", "Niederlande", "Belgien", "Polen", "Tschechien"
];

const BecomeSeller = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { isSeller, loading: sellerLoading } = useIsSeller();
  const navigate = useNavigate();
  
  // Form state
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Deutschland");
  const [iban, setIban] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [vatId, setVatId] = useState("");
  const [isSmallBusiness, setIsSmallBusiness] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("own_shipping");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptFee, setAcceptFee] = useState(false);
  const [acceptReturns, setAcceptReturns] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(language === "de" ? "Bitte melden Sie sich an" : "Please sign in first");
      navigate("/auth");
      return;
    }

    // Validations
    if (!shopName.trim()) {
      toast.error(language === "de" ? "Shop-Name ist erforderlich" : "Shop name is required");
      return;
    }
    if (!ownerName.trim()) {
      toast.error(language === "de" ? "Inhabername ist erforderlich" : "Owner name is required");
      return;
    }
    if (!iban.trim()) {
      toast.error(language === "de" ? "IBAN ist erforderlich" : "IBAN is required");
      return;
    }
    if (!accountHolder.trim()) {
      toast.error(language === "de" ? "Kontoinhaber ist erforderlich" : "Account holder is required");
      return;
    }
    if (!isSmallBusiness && !vatId.trim()) {
      toast.error(language === "de" ? "USt-ID ist erforderlich (oder Kleinunternehmer wählen)" : "VAT ID required (or select small business)");
      return;
    }
    if (!acceptTerms || !acceptFee || !acceptReturns) {
      toast.error(language === "de" ? "Bitte alle Bedingungen akzeptieren" : "Please accept all terms");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create seller profile in sellers table
      const { error: sellerError } = await supabase
        .from("sellers")
        .insert({
          user_id: user.id,
          shop_name: shopName.trim(),
          owner_name: ownerName.trim(),
          email: email.trim() || user.email,
          country,
          iban: iban.trim(),
          account_holder: accountHolder.trim(),
          vat_id: isSmallBusiness ? null : vatId.trim(),
          is_small_business: isSmallBusiness,
          shipping_method: shippingMethod,
          accepts_terms: acceptTerms,
          accepts_platform_fee: acceptFee,
          accepts_return_policy: acceptReturns,
          status: 'pending'
        });

      if (sellerError) {
        console.error("Seller insert error:", sellerError);
        if (sellerError.code === "23505") {
          toast.info(language === "de" ? "Sie haben bereits einen Shop registriert" : "You already have a registered shop");
        } else {
          toast.error(language === "de" ? "Fehler beim Erstellen des Shops" : "Error creating shop");
        }
        setSubmitting(false);
        return;
      }

      // 2. Update profile with shop name
      await supabase
        .from("profiles")
        .update({ display_name: shopName.trim() })
        .eq("user_id", user.id);

      // 3. Request seller role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role: "seller" });

      if (roleError && roleError.code !== "23505") {
        console.error("Role insert error:", roleError);
      }

      setSubmitted(true);
      toast.success(language === "de" ? "Antrag erfolgreich eingereicht!" : "Application submitted successfully!");
      
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
        <main className="container max-w-[1400px] mx-auto px-4 py-10">
          <Card className="max-w-2xl mx-auto text-center">
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
        <main className="container max-w-[1400px] mx-auto px-4 py-10">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="py-12">
              <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {language === "de" ? "Antrag eingereicht!" : "Application Submitted!"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === "de" 
                  ? "Ihr Antrag wird geprüft. Status: Ausstehend"
                  : "Your application is being reviewed. Status: Pending"}
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

      <main className="container max-w-[1400px] mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          {language === "de" ? "Zurück zur Startseite" : "Back to Home"}
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {language === "de" ? "Verkäufer werden" : "Become a Seller"}
            </CardTitle>
            <CardDescription>
              {language === "de" 
                ? "Füllen Sie das Formular aus, um Ihren Shop zu registrieren"
                : "Fill out the form to register your shop"}
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
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    {language === "de" ? "Basis-Informationen" : "Basic Information"}
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="shopName">{language === "de" ? "Shop-Name *" : "Shop Name *"}</Label>
                      <Input
                        id="shopName"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder={language === "de" ? "z.B. Mein Shop" : "e.g. My Shop"}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">{language === "de" ? "Name (Inhaber) *" : "Owner Name *"}</Label>
                      <Input
                        id="ownerName"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder={language === "de" ? "Vor- und Nachname" : "First and Last Name"}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">{language === "de" ? "E-Mail" : "Email"}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={user?.email || "email@example.com"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{language === "de" ? "Land" : "Country"}</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Payout Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    💰 {language === "de" ? "Auszahlungen" : "Payouts"}
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN *</Label>
                      <Input
                        id="iban"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        placeholder="DE89 3704 0044 0532 0130 00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolder">{language === "de" ? "Kontoinhaber *" : "Account Holder *"}</Label>
                      <Input
                        id="accountHolder"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder={language === "de" ? "Name auf dem Konto" : "Name on account"}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Tax Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    🧾 {language === "de" ? "Steuern" : "Taxes"}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smallBusiness"
                      checked={isSmallBusiness}
                      onCheckedChange={(checked) => setIsSmallBusiness(checked === true)}
                    />
                    <Label htmlFor="smallBusiness" className="font-normal">
                      {language === "de" ? "Ich bin Kleinunternehmer (§19 UStG)" : "I am a small business (no VAT)"}
                    </Label>
                  </div>
                  
                  {!isSmallBusiness && (
                    <div className="space-y-2">
                      <Label htmlFor="vatId">{language === "de" ? "USt-ID *" : "VAT ID *"}</Label>
                      <Input
                        id="vatId"
                        value={vatId}
                        onChange={(e) => setVatId(e.target.value)}
                        placeholder="DE123456789"
                      />
                    </div>
                  )}
                </div>

                {/* Shipping */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    📦 {language === "de" ? "Versand" : "Shipping"}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>{language === "de" ? "Versandart" : "Shipping Method"}</Label>
                    <Select value={shippingMethod} onValueChange={setShippingMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="own_shipping">
                          {language === "de" ? "Eigener Versand" : "Own Shipping"}
                        </SelectItem>
                        <SelectItem value="dropshipping">
                          {language === "de" ? "Dropshipping" : "Dropshipping"}
                        </SelectItem>
                        <SelectItem value="platform">
                          {language === "de" ? "Plattform-Versand" : "Platform Shipping"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-4 bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold">
                    {language === "de" ? "Bedingungen akzeptieren" : "Accept Terms"}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                      />
                      <Label htmlFor="terms" className="font-normal text-sm">
                        {language === "de" 
                          ? "Ich akzeptiere die Verkäufer-AGB" 
                          : "I accept the seller terms and conditions"}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fee"
                        checked={acceptFee}
                        onCheckedChange={(checked) => setAcceptFee(checked === true)}
                      />
                      <Label htmlFor="fee" className="font-normal text-sm">
                        {language === "de" 
                          ? "Ich akzeptiere die 15% Plattformgebühr" 
                          : "I accept the 15% platform fee"}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="returns"
                        checked={acceptReturns}
                        onCheckedChange={(checked) => setAcceptReturns(checked === true)}
                      />
                      <Label htmlFor="returns" className="font-normal text-sm">
                        {language === "de" 
                          ? "Ich akzeptiere die Rückgabe-Regeln" 
                          : "I accept the return policy"}
                      </Label>
                    </div>
                  </div>
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
                      {language === "de" ? "Antrag einreichen" : "Submit Application"}
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  {language === "de" 
                    ? "Nach der Einreichung wird Ihr Antrag geprüft (Status: pending → active)"
                    : "After submission, your application will be reviewed (Status: pending → active)"}
                </p>
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