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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Package, ShoppingCart, Euro, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface SellerOrder {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  order_status: string;
  order_created_at: string;
  order_total: number;
}

interface SellerStats {
  totalOrders: number;
  totalRevenue: number;
  itemsSold: number;
  pendingOrders: number;
}

const SellerOrders = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [stats, setStats] = useState<SellerStats>({
    totalOrders: 0,
    totalRevenue: 0,
    itemsSold: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  const fetchSellerOrders = async () => {
    try {
      // Get seller's products
      const { data: sellerProducts } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", user?.id);

      if (!sellerProducts || sellerProducts.length === 0) {
        setLoading(false);
        return;
      }

      const productIds = sellerProducts.map((p) => p.id);

      // Get order items for seller's products
      const { data: orderItems, error } = await supabase
        .from("order_items")
        .select("*, orders!inner(id, status, created_at, total)")
        .in("product_id", productIds);

      if (error) throw error;

      // Transform data
      const transformedOrders: SellerOrder[] = (orderItems || []).map((item) => ({
        id: item.id,
        order_id: (item.orders as { id: string }).id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        price: item.price,
        order_status: (item.orders as { status: string }).status,
        order_created_at: (item.orders as { created_at: string }).created_at,
        order_total: (item.orders as { total: number }).total,
      }));

      setOrders(transformedOrders);

      // Calculate stats
      const uniqueOrders = new Set(transformedOrders.map((o) => o.order_id));
      const revenue = transformedOrders.reduce(
        (sum, o) => sum + o.price * o.quantity,
        0
      );
      const itemsSold = transformedOrders.reduce((sum, o) => sum + o.quantity, 0);
      const pending = transformedOrders.filter(
        (o) => o.order_status === "pending" || o.order_status === "confirmed"
      ).length;

      setStats({
        totalOrders: uniqueOrders.size,
        totalRevenue: revenue,
        itemsSold,
        pendingOrders: pending,
      });
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      toast.error(
        language === "de"
          ? "Fehler beim Laden der Bestellungen"
          : "Error loading orders"
      );
    } finally {
      setLoading(false);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "confirmed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.order_status === filter);

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
        title={language === "de" ? "Meine Bestellungen" : "My Orders"}
        description={
          language === "de"
            ? "Bestellungen für Ihre Produkte"
            : "Orders for your products"
        }
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {language === "de" ? "Bestellungen" : "Orders"}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {language === "de" ? "Bestellungen" : "Orders"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Euro className="w-4 h-4" />
                {language === "de" ? "Umsatz" : "Revenue"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                {language === "de" ? "Verkauft" : "Sold"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.itemsSold}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {language === "de" ? "Ausstehend" : "Pending"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {filteredOrders.length}{" "}
            {language === "de" ? "Bestellungen" : "orders"}
          </p>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === "de" ? "Alle" : "All"}
              </SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === "de" ? "Keine Bestellungen" : "No orders"}
              </h3>
              <p className="text-muted-foreground text-center">
                {language === "de"
                  ? "Bestellungen für Ihre Produkte erscheinen hier."
                  : "Orders for your products will appear here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  {order.product_image && (
                    <img
                      src={order.product_image}
                      alt={order.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {order.product_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "de" ? "Menge" : "Qty"}: {order.quantity} ×{" "}
                      {formatPrice(order.price)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      #{order.order_id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.order_status)}>
                      {order.order_status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {formatPrice(order.price * order.quantity)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.order_created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SellerOrders;
