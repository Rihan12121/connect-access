import { useLanguage } from '@/context/LanguageContext';
import { useRealtimeDashboard } from '@/hooks/useRealtimeDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  ShoppingCart,
  Euro,
  AlertTriangle,
  MessageSquare,
  RotateCcw,
  RefreshCw,
  Wifi,
  WifiOff,
  Package,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RealtimeDashboard = () => {
  const { language } = useLanguage();
  const { stats, recentOrders, events, connected, refreshData } = useRealtimeDashboard();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <ShoppingCart className="w-4 h-4 text-green-500" />;
      case 'status_change':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'new_refund':
        return <RotateCcw className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={language === 'de' ? 'Echtzeit-Dashboard' : 'Realtime Dashboard'}
        description={language === 'de' ? 'Live-Übersicht aller Aktivitäten' : 'Live overview of all activities'}
      />
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Echtzeit-Dashboard' : 'Realtime Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'de' ? 'Live-Updates zu Bestellungen, Lagerbestand und Support' : 'Live updates on orders, inventory, and support'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {connected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">{language === 'de' ? 'Verbunden' : 'Connected'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">{language === 'de' ? 'Getrennt' : 'Disconnected'}</span>
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Aktualisieren' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {language === 'de' ? 'Bestellungen heute' : 'Orders Today'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.newOrdersToday}</span>
                {stats.newOrders > 0 && (
                  <Badge variant="default" className="bg-green-500">
                    +{stats.newOrders} {language === 'de' ? 'neu' : 'new'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Euro className="w-4 h-4" />
                {language === 'de' ? 'Umsatz heute' : 'Revenue Today'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.revenueToday.toFixed(2)}€</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {language === 'de' ? 'Lagerbestand niedrig' : 'Low Stock'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.lowStockAlerts}</span>
                {stats.lowStockAlerts > 0 && (
                  <Link to="/admin/inventory">
                    <Badge variant="outline" className="border-orange-500 text-orange-600 cursor-pointer">
                      {language === 'de' ? 'Prüfen' : 'Check'}
                    </Badge>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                {language === 'de' ? 'Offene Refunds' : 'Pending Refunds'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.pendingRefunds}</span>
                {stats.pendingRefunds > 0 && (
                  <Link to="/admin/refunds">
                    <Badge variant="outline" className="border-red-500 text-red-600 cursor-pointer">
                      {language === 'de' ? 'Bearbeiten' : 'Process'}
                    </Badge>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Open Orders Card - Clickable */}
        <Link to="/admin/orders?status=open">
          <Card className="mb-8 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                {language === 'de' ? 'Offene Bestellungen' : 'Open Orders'}
                <Badge variant="secondary" className="ml-2">{stats.openOrders}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {language === 'de' 
                  ? 'Bestellungen mit Status: Pending, Bestätigt, oder Versendet (ohne Cancelled)' 
                  : 'Orders with status: Pending, Confirmed, or Shipped (excluding Cancelled)'}
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                {language === 'de' ? 'Alle offenen Bestellungen anzeigen' : 'View all open orders'}
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {language === 'de' ? 'Aktuelle Bestellungen' : 'Recent Orders'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {language === 'de' ? 'Noch keine Bestellungen' : 'No orders yet'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-mono text-sm font-medium">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <span className="font-semibold">{Number(order.total).toFixed(2)}€</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {language === 'de' ? 'Live-Aktivität' : 'Live Activity'}
                {connected && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    {language === 'de' ? 'Warte auf Aktivität...' : 'Waiting for activity...'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg animate-in slide-in-from-top-2 duration-300"
                      >
                        <div className="mt-0.5">{getEventIcon(event.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{event.message}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/orders">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <ShoppingCart className="w-6 h-6" />
              {language === 'de' ? 'Alle Bestellungen' : 'All Orders'}
            </Button>
          </Link>
          <Link to="/admin/inventory">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <Package className="w-6 h-6" />
              {language === 'de' ? 'Lagerbestand' : 'Inventory'}
            </Button>
          </Link>
          <Link to="/admin/refunds">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <RotateCcw className="w-6 h-6" />
              {language === 'de' ? 'Rückerstattungen' : 'Refunds'}
            </Button>
          </Link>
          <Link to="/messages">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              {language === 'de' ? 'Nachrichten' : 'Messages'}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RealtimeDashboard;
