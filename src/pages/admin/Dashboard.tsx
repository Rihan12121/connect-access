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
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalReviews: number;
  pendingOrders: number;
}

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalReviews: 0,
    pendingOrders: 0,
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

    if (orders) {
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
        totalReviews: reviews?.length || 0,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
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
      title: language === 'de' ? 'Gesamtbestellungen' : 'Total Orders',
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
      title: language === 'de' ? 'Bestellungen' : 'Orders',
      description: language === 'de' ? 'Alle Bestellungen verwalten' : 'Manage all orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: language === 'de' ? 'Bewertungen' : 'Reviews',
      description: language === 'de' ? 'Kundenbewertungen ansehen' : 'View customer reviews',
      href: '/admin/reviews',
      icon: Star,
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
