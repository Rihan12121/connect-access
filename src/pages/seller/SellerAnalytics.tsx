import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Loader2, TrendingUp, Eye, ShoppingCart, Star } from "lucide-react";

interface AnalyticsData {
  salesByDay: { date: string; sales: number; revenue: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  totalViews: number;
  conversionRate: number;
  avgOrderValue: number;
  reviewsCount: number;
  avgRating: number;
}

const SellerAnalytics = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    salesByDay: [],
    topProducts: [],
    totalViews: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    reviewsCount: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // Get seller's products
      const { data: sellerProducts } = await supabase
        .from("products")
        .select("id, name")
        .eq("seller_id", user?.id);

      if (!sellerProducts || sellerProducts.length === 0) {
        setLoading(false);
        return;
      }

      const productIds = sellerProducts.map((p) => p.id);
      const productMap = new Map(sellerProducts.map((p) => [p.id, p.name]));

      // Get order items for seller's products
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("*, orders!inner(created_at, status)")
        .in("product_id", productIds);

      // Get reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .in("product_id", productIds);

      // Process sales by day (last 30 days)
      const salesByDay: Record<string, { sales: number; revenue: number }> = {};
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        salesByDay[dateStr] = { sales: 0, revenue: 0 };
      }

      // Calculate top products
      const productSales: Record<string, { sold: number; revenue: number }> = {};

      (orderItems || []).forEach((item) => {
        const orderDate = new Date(
          (item.orders as { created_at: string }).created_at
        )
          .toISOString()
          .split("T")[0];

        if (salesByDay[orderDate]) {
          salesByDay[orderDate].sales += item.quantity;
          salesByDay[orderDate].revenue += item.price * item.quantity;
        }

        const productName = productMap.get(item.product_id) || "Unknown";
        if (!productSales[productName]) {
          productSales[productName] = { sold: 0, revenue: 0 };
        }
        productSales[productName].sold += item.quantity;
        productSales[productName].revenue += item.price * item.quantity;
      });

      const salesData = Object.entries(salesByDay).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString(
          language === "de" ? "de-DE" : "en-US",
          { day: "2-digit", month: "short" }
        ),
        ...data,
      }));

      const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate metrics
      const totalSales = orderItems?.length || 0;
      const totalRevenue = (orderItems || []).reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const avgOrder = totalSales > 0 ? totalRevenue / totalSales : 0;

      const avgRating =
        reviews && reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      setAnalytics({
        salesByDay: salesData,
        topProducts,
        totalViews: Math.floor(Math.random() * 1000) + 500, // Simulated
        conversionRate: totalSales > 0 ? Math.min(15, (totalSales / 100) * 5) : 0,
        avgOrderValue: avgOrder,
        reviewsCount: reviews?.length || 0,
        avgRating,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
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
        title={language === "de" ? "Verkäufer-Analytics" : "Seller Analytics"}
        description={
          language === "de"
            ? "Analysieren Sie Ihre Verkäufe"
            : "Analyze your sales"
        }
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {language === "de" ? "Analytics" : "Analytics"}
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {language === "de" ? "Aufrufe" : "Views"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {language === "de" ? "Konversion" : "Conversion"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.conversionRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {language === "de" ? "Ø Bestellung" : "Avg Order"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(analytics.avgOrderValue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4" />
                {language === "de" ? "Bewertung" : "Rating"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.avgRating.toFixed(1)} ★
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.reviewsCount}{" "}
                {language === "de" ? "Bewertungen" : "reviews"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "de" ? "Verkäufe (30 Tage)" : "Sales (30 Days)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "de" ? "Umsatz (30 Tage)" : "Revenue (30 Days)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => formatPrice(value)}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "de" ? "Top-Produkte" : "Top Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topProducts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {language === "de"
                  ? "Noch keine Verkäufe"
                  : "No sales yet"}
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sold}{" "}
                          {language === "de" ? "verkauft" : "sold"}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {formatPrice(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SellerAnalytics;
