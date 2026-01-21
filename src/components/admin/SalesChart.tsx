import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, ShoppingCart, Euro, CalendarDays } from 'lucide-react';

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
  label: string;
}

const SalesChart = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [totals, setTotals] = useState({ revenue: 0, orders: 0, avgOrder: 0 });

  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const fetchSalesData = async () => {
    setLoading(true);
    
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('created_at, total, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching sales data:', error);
      setLoading(false);
      return;
    }

    // Group by date
    const grouped: Record<string, { revenue: number; orders: number }> = {};
    
    // Initialize all dates
    for (let i = 0; i < daysAgo; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (daysAgo - 1 - i));
      const key = d.toISOString().split('T')[0];
      grouped[key] = { revenue: 0, orders: 0 };
    }

    // Fill with actual data
    orders?.forEach((order) => {
      const date = order.created_at.split('T')[0];
      if (grouped[date]) {
        grouped[date].revenue += Number(order.total);
        grouped[date].orders += 1;
      }
    });

    const chartData: ChartData[] = Object.entries(grouped).map(([date, values]) => {
      const d = new Date(date);
      return {
        date,
        label: d.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { 
          day: '2-digit', 
          month: 'short' 
        }),
        revenue: Math.round(values.revenue * 100) / 100,
        orders: values.orders,
      };
    });

    setData(chartData);

    // Calculate totals
    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);
    setTotals({
      revenue: totalRevenue,
      orders: totalOrders,
      avgOrder: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    });

    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: p.color }}>
              {p.name === 'revenue' ? (language === 'de' ? 'Umsatz' : 'Revenue') : (language === 'de' ? 'Bestellungen' : 'Orders')}: 
              {p.name === 'revenue' ? ` ${formatCurrency(p.value)}` : ` ${p.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {language === 'de' ? 'Verkaufsstatistiken' : 'Sales Statistics'}
          </CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <CalendarDays className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{language === 'de' ? 'Letzte 7 Tage' : 'Last 7 days'}</SelectItem>
              <SelectItem value="30">{language === 'de' ? 'Letzte 30 Tage' : 'Last 30 days'}</SelectItem>
              <SelectItem value="90">{language === 'de' ? 'Letzte 90 Tage' : 'Last 90 days'}</SelectItem>
              <SelectItem value="365">{language === 'de' ? 'Letztes Jahr' : 'Last year'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Euro className="w-4 h-4" />
              {language === 'de' ? 'Umsatz' : 'Revenue'}
            </div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totals.revenue)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <ShoppingCart className="w-4 h-4" />
              {language === 'de' ? 'Bestellungen' : 'Orders'}
            </div>
            <p className="text-xl font-bold text-foreground">{totals.orders}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              {language === 'de' ? 'Ø Bestellung' : 'Avg. Order'}
            </div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totals.avgOrder)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">{language === 'de' ? 'Umsatz' : 'Revenue'}</TabsTrigger>
              <TabsTrigger value="orders">{language === 'de' ? 'Bestellungen' : 'Orders'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="label" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      className="fill-muted-foreground"
                    />
                    <YAxis 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `€${value}`}
                      className="fill-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="label" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      className="fill-muted-foreground"
                    />
                    <YAxis 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      className="fill-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="orders" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesChart;
