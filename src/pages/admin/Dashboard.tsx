import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Star,
  Loader2,
  ArrowRight,
  FolderTree,
  Image as ImageIcon,
  Settings,
  Home,
  Tag,
  FileText,
  RotateCcw,
  History,
  Boxes,
  FlaskConical,
  Link2,
  BarChart3,
  Activity,
  Languages
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { AdminManagement } from '@/components/admin/AdminManagement';
import { SellerManagement } from '@/components/admin/SellerManagement';
import SalesChart from '@/components/admin/SalesChart';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalReviews: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalReviews: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    // Fetch orders
    const { data: orders } = await supabase
      .from('orders')
      .select('total, status');

    // Fetch reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('id');

    // Fetch unique customers (profiles)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id');

    // Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('id');

    if (orders) {
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
        totalReviews: reviews?.length || 0,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalCustomers: profiles?.length || 0,
        totalProducts: products?.length || 0,
      });
    }
    setLoading(false);
  };

  const fetchRecentOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentOrders(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const statCards = [
    {
      title: language === 'de' ? 'Kunden' : 'Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-indigo-500',
    },
    {
      title: language === 'de' ? 'Produkte' : 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-orange-500',
    },
    {
      title: language === 'de' ? 'Bestellungen' : 'Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: language === 'de' ? 'Umsatz' : 'Revenue',
      value: `${stats.totalRevenue.toFixed(2)} €`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: language === 'de' ? 'Offene Bestellungen' : 'Pending Orders',
      value: stats.pendingOrders,
      icon: Package,
      color: 'bg-yellow-500',
    },
    {
      title: language === 'de' ? 'Bewertungen' : 'Reviews',
      value: stats.totalReviews,
      icon: Star,
      color: 'bg-purple-500',
    },
  ];

  const menuItems = [
    {
      title: language === 'de' ? 'Produkte' : 'Products',
      description: language === 'de' ? 'Produkte hinzufügen und bearbeiten' : 'Add and edit products',
      href: '/admin/products',
      icon: Package,
    },
    {
      title: language === 'de' ? 'Bestellungen' : 'Orders',
      description: language === 'de' ? 'Alle Bestellungen verwalten' : 'Manage all orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: language === 'de' ? 'Kategorien' : 'Categories',
      description: language === 'de' ? 'Kategorien verwalten' : 'Manage categories',
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      title: language === 'de' ? 'Hero-Banner' : 'Hero Banners',
      description: language === 'de' ? 'Startseiten-Banner verwalten' : 'Manage homepage banners',
      href: '/admin/banners',
      icon: ImageIcon,
    },
    {
      title: language === 'de' ? 'Kunden' : 'Customers',
      description: language === 'de' ? 'Kunden verwalten und blockieren' : 'Manage and block customers',
      href: '/admin/customers',
      icon: Users,
    },
    {
      title: language === 'de' ? 'Bewertungen' : 'Reviews',
      description: language === 'de' ? 'Kundenbewertungen ansehen' : 'View customer reviews',
      href: '/admin/reviews',
      icon: Star,
    },
    {
      title: language === 'de' ? 'Einstellungen' : 'Settings',
      description: language === 'de' ? 'Shop-Einstellungen anpassen' : 'Configure shop settings',
      href: '/admin/settings',
      icon: Settings,
    },
    {
      title: language === 'de' ? 'Rabattcodes' : 'Discount Codes',
      description: language === 'de' ? 'Gutscheine verwalten' : 'Manage coupons',
      href: '/admin/discount-codes',
      icon: Tag,
    },
    {
      title: language === 'de' ? 'Lagerverwaltung' : 'Inventory',
      description: language === 'de' ? 'Lagerbestand prüfen' : 'Check stock levels',
      href: '/admin/inventory',
      icon: Boxes,
    },
    {
      title: language === 'de' ? 'Kundensegmente' : 'Customer Segments',
      description: language === 'de' ? 'Personalisierte Rabatte' : 'Personalized discounts',
      href: '/admin/customer-segments',
      icon: Users,
    },
    {
      title: language === 'de' ? 'Rechnungen' : 'Invoices',
      description: language === 'de' ? 'PDF Rechnungen' : 'PDF invoices',
      href: '/admin/invoices',
      icon: FileText,
    },
    {
      title: language === 'de' ? 'Rückerstattungen' : 'Refunds',
      description: language === 'de' ? 'Stornos bearbeiten' : 'Process refunds',
      href: '/admin/refunds',
      icon: RotateCcw,
    },
    {
      title: language === 'de' ? 'Audit-Logs' : 'Audit Logs',
      description: language === 'de' ? 'Änderungsprotokoll' : 'Change log',
      href: '/admin/audit-logs',
      icon: History,
    },
    {
      title: 'A/B Tests',
      description: language === 'de' ? 'Varianten testen' : 'Test variants',
      href: '/admin/ab-tests',
      icon: FlaskConical,
    },
    {
      title: language === 'de' ? 'Affiliates' : 'Affiliates',
      description: language === 'de' ? 'Partner verwalten' : 'Manage partners',
      href: '/admin/affiliates',
      icon: Link2,
    },
    {
      title: 'Analytics',
      description: language === 'de' ? 'Analysen & Statistiken' : 'Analytics & Stats',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: language === 'de' ? 'Echtzeit' : 'Realtime',
      description: language === 'de' ? 'Live-Dashboard' : 'Live Dashboard',
      href: '/admin/realtime',
      icon: Activity,
    },
    {
      title: language === 'de' ? 'Übersetzungen' : 'Translations',
      description: language === 'de' ? 'Sprachen verwalten' : 'Manage languages',
      href: '/admin/translations',
      icon: Languages,
    },
    {
      title: language === 'de' ? 'Homepage' : 'Homepage',
      description: language === 'de' ? 'Startseite bearbeiten' : 'Edit homepage',
      href: '/',
      icon: Home,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Admin Dashboard"
        description="Admin Dashboard für Noor"
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Sales Chart */}
            <div className="mb-8">
              <SalesChart />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="flex items-center justify-between bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>

            {/* Admin & Seller Management */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <AdminManagement />
              <SellerManagement />
            </div>

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">
                  {language === 'de' ? 'Letzte Bestellungen' : 'Recent Orders'}
                </h2>
                <Link to="/admin/orders" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Alle anzeigen' : 'View all'}
                </Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  {language === 'de' ? 'Keine Bestellungen vorhanden' : 'No orders yet'}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-sm text-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-semibold">{Number(order.total).toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
