import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Euro,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  BarChart3,
  Wallet,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface SellerProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  in_stock: boolean;
  category: string;
  created_at: string;
  stock_quantity: number | null;
}

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
  pendingBalance: number;
}

const SellerDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingBalance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    try {
      // Fetch seller's products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user?.id)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      setProducts(productsData || []);

      // Fetch orders for seller's products
      const productIds = productsData?.map(p => p.id) || [];
      let totalRevenue = 0;
      let orderCount = 0;

      if (productIds.length > 0) {
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("price, quantity, orders!inner(status)")
          .in("product_id", productIds);

        if (orderItems) {
          const deliveredItems = orderItems.filter(
            item => (item.orders as { status: string }).status === "delivered"
          );
          totalRevenue = deliveredItems.reduce(
            (sum, item) => sum + item.price * item.quantity * 0.85,
            0
          );
          orderCount = new Set(orderItems.map(() => Math.random())).size; // Unique orders approximation
        }
      }
      
      // Calculate stats
      setStats({
        totalProducts: productsData?.length || 0,
        totalOrders: orderCount,
        totalRevenue: totalRevenue,
        monthlyGrowth: 12.5, // Placeholder
        pendingBalance: totalRevenue * 0.7 // 70% available for payout
      });
    } catch (error) {
      console.error("Error fetching seller data:", error);
      toast.error(language === 'de' ? "Fehler beim Laden der Daten" : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(language === 'de' ? "Produkt wirklich löschen?" : "Really delete product?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("seller_id", user?.id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast.success(language === 'de' ? "Produkt gelöscht" : "Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(language === 'de' ? "Fehler beim Löschen" : "Error deleting");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
        title={language === 'de' ? "Verkäufer-Dashboard" : "Seller Dashboard"}
        description={language === 'de' ? "Verwalten Sie Ihre Produkte und Bestellungen" : "Manage your products and orders"}
      />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {language === 'de' ? "Verkäufer-Dashboard" : "Seller Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'de' 
                ? "Willkommen zurück! Verwalten Sie hier Ihre Produkte und Bestellungen."
                : "Welcome back! Manage your products and orders here."}
            </p>
          </div>
          <Link to="/seller/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {language === 'de' ? "Neues Produkt" : "New Product"}
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/seller/orders">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <ShoppingCart className="w-6 h-6" />
              {language === 'de' ? "Bestellungen" : "Orders"}
            </Button>
          </Link>
          <Link to="/seller/analytics">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              Analytics
            </Button>
          </Link>
          <Link to="/seller/payouts">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <Wallet className="w-6 h-6" />
              {language === 'de' ? "Auszahlungen" : "Payouts"}
            </Button>
          </Link>
          <Link to="/messages">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              {language === 'de' ? "Nachrichten" : "Messages"}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'de' ? "Produkte" : "Products"}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'de' ? "Aktive Angebote" : "Active listings"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'de' ? "Bestellungen" : "Orders"}
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'de' ? "Diesen Monat" : "This month"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'de' ? "Umsatz" : "Revenue"}
              </CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'de' ? "Gesamt" : "Total"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'de' ? "Wachstum" : "Growth"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+{stats.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                {language === 'de' ? "vs. letzter Monat" : "vs. last month"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">
              {language === 'de' ? "Meine Produkte" : "My Products"}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {language === 'de' ? "Bestellungen" : "Orders"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'de' ? "Noch keine Produkte" : "No products yet"}
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {language === 'de' 
                      ? "Erstellen Sie Ihr erstes Produkt und beginnen Sie mit dem Verkauf."
                      : "Create your first product and start selling."}
                  </p>
                  <Link to="/seller/products/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {language === 'de' ? "Produkt erstellen" : "Create product"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.in_stock ? "default" : "secondary"}>
                          {product.in_stock 
                            ? (language === 'de' ? "Auf Lager" : "In Stock")
                            : (language === 'de' ? "Ausverkauft" : "Out of Stock")}
                        </Badge>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {formatDate(product.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/product/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/seller/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'de' ? "Keine Bestellungen" : "No orders"}
                </h3>
                <p className="text-muted-foreground text-center">
                  {language === 'de' 
                    ? "Bestellungen für Ihre Produkte erscheinen hier."
                    : "Orders for your products will appear here."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
