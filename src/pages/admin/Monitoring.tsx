import { useState, useEffect } from 'react';
import { Activity, Server, Database, Zap, AlertTriangle, Check, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Metric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: { warning: number; critical: number };
}

const AdminMonitoring = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulated metrics (in production, these would come from real monitoring)
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'API Response Time', value: 145, unit: 'ms', status: 'healthy', trend: 'down', threshold: { warning: 500, critical: 1000 } },
    { name: 'Database Queries/min', value: 1250, unit: '/min', status: 'healthy', trend: 'up', threshold: { warning: 5000, critical: 10000 } },
    { name: 'Error Rate', value: 0.12, unit: '%', status: 'healthy', trend: 'stable', threshold: { warning: 1, critical: 5 } },
    { name: 'Active Users', value: 342, unit: 'users', status: 'healthy', trend: 'up', threshold: { warning: 0, critical: 0 } },
    { name: 'Memory Usage', value: 67, unit: '%', status: 'warning', trend: 'up', threshold: { warning: 70, critical: 90 } },
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable', threshold: { warning: 70, critical: 90 } },
    { name: 'Storage Used', value: 2.4, unit: 'GB', status: 'healthy', trend: 'up', threshold: { warning: 8, critical: 10 } },
    { name: 'Uptime', value: 99.98, unit: '%', status: 'healthy', trend: 'stable', threshold: { warning: 99.5, critical: 99 } },
  ]);

  const [orders24h, setOrders24h] = useState(0);
  const [revenue24h, setRevenue24h] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: ordersData } = await supabase
          .from('orders')
          .select('total')
          .gte('created_at', yesterday.toISOString());

        if (ordersData) {
          setOrders24h(ordersData.length);
          setRevenue24h(ordersData.reduce((sum, o) => sum + o.total, 0));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: m.name === 'Uptime' ? m.value : m.value * (0.95 + Math.random() * 0.1)
      })));
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" /> OK</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" /> Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" /> Critical</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const overallHealth = metrics.every(m => m.status === 'healthy') ? 'healthy' : 
                        metrics.some(m => m.status === 'critical') ? 'critical' : 'warning';

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'System-Monitoring' : 'System Monitoring'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'de' ? 'System-Monitoring' : 'System Monitoring'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Zuletzt aktualisiert:' : 'Last updated:'} {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            {getStatusBadge(overallHealth)}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Key Business Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'de' ? 'Bestellungen (24h)' : 'Orders (24h)'}
                        </p>
                        <p className="text-3xl font-bold">{orders24h}</p>
                      </div>
                      <Zap className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'de' ? 'Umsatz (24h)' : 'Revenue (24h)'}
                        </p>
                        <p className="text-3xl font-bold">€{revenue24h.toFixed(2)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'de' ? 'Aktive Nutzer' : 'Active Users'}
                        </p>
                        <p className="text-3xl font-bold">{metrics.find(m => m.name === 'Active Users')?.value.toFixed(0)}</p>
                      </div>
                      <Server className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="text-3xl font-bold">{metrics.find(m => m.name === 'Uptime')?.value.toFixed(2)}%</p>
                      </div>
                      <Check className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric) => (
                  <Card key={metric.name} className={`${metric.status === 'critical' ? 'border-red-300' : metric.status === 'warning' ? 'border-yellow-300' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">
                          {typeof metric.value === 'number' ? metric.value.toFixed(metric.unit === '%' ? 2 : 0) : metric.value}
                        </span>
                        <span className="text-sm text-muted-foreground mb-1">{metric.unit}</span>
                      </div>
                      {metric.threshold.warning > 0 && (
                        <div className="mt-3">
                          <Progress 
                            value={(metric.value / metric.threshold.critical) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0</span>
                            <span className="text-yellow-600">{metric.threshold.warning}</span>
                            <span className="text-red-600">{metric.threshold.critical}</span>
                          </div>
                        </div>
                      )}
                      <div className="mt-2">
                        {getStatusBadge(metric.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* SLA Info */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Check className="h-5 w-5" />
                    {language === 'de' ? 'SLA-Status' : 'SLA Status'}
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    {language === 'de' 
                      ? 'Alle Service Level Agreements werden eingehalten'
                      : 'All Service Level Agreements are being met'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-muted-foreground">Uptime SLA</p>
                      <p className="text-xl font-bold text-green-700">99.9% <Check className="inline h-4 w-4" /></p>
                      <p className="text-xs text-muted-foreground">{language === 'de' ? 'Ziel erreicht' : 'Target met'}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-muted-foreground">Response Time SLA</p>
                      <p className="text-xl font-bold text-green-700">&lt;500ms <Check className="inline h-4 w-4" /></p>
                      <p className="text-xs text-muted-foreground">{language === 'de' ? 'Ziel erreicht' : 'Target met'}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-muted-foreground">Error Rate SLA</p>
                      <p className="text-xl font-bold text-green-700">&lt;1% <Check className="inline h-4 w-4" /></p>
                      <p className="text-xs text-muted-foreground">{language === 'de' ? 'Ziel erreicht' : 'Target met'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
};

export default AdminMonitoring;
