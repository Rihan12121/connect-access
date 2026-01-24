import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Euro, Wallet, Clock, CheckCircle, Plus } from "lucide-react";
import { toast } from "sonner";

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at: string | null;
}

interface PayoutStats {
  availableBalance: number;
  pendingPayouts: number;
  totalPaid: number;
}

const SellerPayouts = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [stats, setStats] = useState<PayoutStats>({
    availableBalance: 0,
    pendingPayouts: 0,
    totalPaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPayoutData();
    }
  }, [user]);

  const fetchPayoutData = async () => {
    try {
      // Get seller's products and calculate earnings
      const { data: sellerProducts } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", user?.id);

      if (!sellerProducts || sellerProducts.length === 0) {
        setLoading(false);
        return;
      }

      const productIds = sellerProducts.map((p) => p.id);

      // Get all order items for seller's products (delivered orders only)
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("price, quantity, orders!inner(status)")
        .in("product_id", productIds);

      const deliveredItems = (orderItems || []).filter(
        (item) => (item.orders as { status: string }).status === "delivered"
      );

      const totalEarnings = deliveredItems.reduce(
        (sum, item) => sum + item.price * item.quantity * 0.85, // 15% platform fee
        0
      );

      // For demo purposes, simulate payout history
      const simulatedPayouts: PayoutRequest[] = totalEarnings > 100 
        ? [
            {
              id: "1",
              amount: Math.min(totalEarnings * 0.3, 500),
              status: "completed",
              created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              processed_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
        : [];

      const totalPaid = simulatedPayouts
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0);

      const pendingPayouts = simulatedPayouts
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0);

      setPayouts(simulatedPayouts);
      setStats({
        availableBalance: Math.max(0, totalEarnings - totalPaid - pendingPayouts),
        pendingPayouts,
        totalPaid,
      });
    } catch (error) {
      console.error("Error fetching payout data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount < 50) {
      toast.error(
        language === "de"
          ? "Mindestauszahlung: 50€"
          : "Minimum payout: 50€"
      );
      return;
    }

    if (amount > stats.availableBalance) {
      toast.error(
        language === "de"
          ? "Betrag übersteigt verfügbares Guthaben"
          : "Amount exceeds available balance"
      );
      return;
    }

    if (!bankAccount.trim()) {
      toast.error(
        language === "de"
          ? "Bitte Bankverbindung angeben"
          : "Please provide bank account"
      );
      return;
    }

    setSubmitting(true);

    // Simulate payout request
    setTimeout(() => {
      const newPayout: PayoutRequest = {
        id: Date.now().toString(),
        amount,
        status: "pending",
        created_at: new Date().toISOString(),
        processed_at: null,
      };

      setPayouts((prev) => [newPayout, ...prev]);
      setStats((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance - amount,
        pendingPayouts: prev.pendingPayouts + amount,
      }));

      toast.success(
        language === "de"
          ? "Auszahlungsanfrage eingereicht"
          : "Payout request submitted"
      );

      setIsDialogOpen(false);
      setRequestAmount("");
      setBankAccount("");
      setSubmitting(false);
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "de" ? "de-DE" : "en-US",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {language === "de" ? "Ausgezahlt" : "Completed"}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {language === "de" ? "Ausstehend" : "Pending"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={language === "de" ? "Auszahlungen" : "Payouts"}
        description={
          language === "de"
            ? "Verwalten Sie Ihre Auszahlungen"
            : "Manage your payouts"
        }
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {language === "de" ? "Auszahlungen" : "Payouts"}
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={stats.availableBalance < 50}>
                <Plus className="w-4 h-4 mr-2" />
                {language === "de" ? "Auszahlung anfordern" : "Request Payout"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === "de" ? "Auszahlung anfordern" : "Request Payout"}
                </DialogTitle>
                <DialogDescription>
                  {language === "de"
                    ? `Verfügbares Guthaben: ${formatPrice(stats.availableBalance)}`
                    : `Available balance: ${formatPrice(stats.availableBalance)}`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    {language === "de" ? "Betrag (€)" : "Amount (€)"}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="50"
                    max={stats.availableBalance}
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    placeholder="50.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "de"
                      ? "Mindestauszahlung: 50€"
                      : "Minimum payout: 50€"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank">
                    {language === "de" ? "IBAN" : "IBAN"}
                  </Label>
                  <Input
                    id="bank"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="DE89 3704 0044 0532 0130 00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {language === "de" ? "Abbrechen" : "Cancel"}
                </Button>
                <Button onClick={handleRequestPayout} disabled={submitting}>
                  {submitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {language === "de" ? "Anfordern" : "Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                {language === "de" ? "Verfügbar" : "Available"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatPrice(stats.availableBalance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {language === "de" ? "Ausstehend" : "Pending"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatPrice(stats.pendingPayouts)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Euro className="w-4 h-4" />
                {language === "de" ? "Gesamt ausgezahlt" : "Total Paid"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatPrice(stats.totalPaid)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "de" ? "Auszahlungshistorie" : "Payout History"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payouts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>
                  {language === "de"
                    ? "Noch keine Auszahlungen"
                    : "No payouts yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {formatPrice(payout.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === "de" ? "Angefordert am" : "Requested on"}{" "}
                        {formatDate(payout.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(payout.status)}
                      {payout.processed_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === "de" ? "Ausgezahlt am" : "Paid on"}{" "}
                          {formatDate(payout.processed_at)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">
              {language === "de" ? "Hinweise" : "Notes"}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • {language === "de"
                  ? "Mindestauszahlung: 50€"
                  : "Minimum payout: 50€"}
              </li>
              <li>
                • {language === "de"
                  ? "Bearbeitungszeit: 3-5 Werktage"
                  : "Processing time: 3-5 business days"}
              </li>
              <li>
                • {language === "de"
                  ? "Plattformgebühr: 15% pro Verkauf"
                  : "Platform fee: 15% per sale"}
              </li>
              <li>
                • {language === "de"
                  ? "Auszahlungen nur für gelieferte Bestellungen"
                  : "Payouts only for delivered orders"}
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SellerPayouts;
