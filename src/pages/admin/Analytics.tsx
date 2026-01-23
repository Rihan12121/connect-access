import { useState, useEffect } from 'react';
import { Search, TrendingUp, Eye, MousePointer, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

interface SearchQuery {
  query: string;
  count: number;
  avg_results: number;
  click_rate: number;
}

interface PerformanceMetric {
  date: string;
  page_views: number;
  conversions: number;
}

const Analytics = () => {
  const { language } = useLanguage();
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [orderEvents, setOrderEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7');

  const [stats, setStats] = useState({
    totalSearches: 0,
    avgResults: 0,
    zeroResults: 0,
    clickRate: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    const startDate = subDays(new Date(), parseInt(period));

    // Fetch search analytics
    const { data: searchData } = await supabase
      .from('search_analytics')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (searchData) {
      // Aggregate search queries
      const queryMap: Record<string, { count: number; results: number[]; clicks: number }> = {};
      searchData.forEach((s) => {
        if (!queryMap[s.query]) {
          queryMap[s.query] = { count: 0, results: [], clicks: 0 };
        }
        queryMap[s.query].count++;
        queryMap[s.query].results.push(s.results_count);
        if (s.clicked_product_id) queryMap[s.query].clicks++;
      });

      const queries: SearchQuery[] = Object.entries(queryMap)
        .map(([query, data]) => ({
          query,
          count: data.count,
          avg_results: data.results.reduce((a, b) => a + b, 0) / data.results.length,
          click_rate: data.count > 0 ? (data.clicks / data.count) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      setSearchQueries(queries);

      // Calculate stats
      const totalSearches = searchData.length;
      const avgResults = searchData.length > 0
        ? searchData.reduce((sum, s) => sum + s.results_count, 0) / searchData.length
        : 0;
      const zeroResults = searchData.filter((s) => s.results_count === 0).length;
      const totalClicks = searchData.filter((s) => s.clicked_product_id).length;

      setStats({
        totalSearches,
        avgResults,
        zeroResults,
        clickRate: totalSearches > 0 ? (totalClicks / totalSearches) * 100 : 0,
      });
    }

    // Fetch order events
    const { data: eventsData } = await supabase
      .from('order_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    if (eventsData) {
      setOrderEvents(eventsData);

      // Group events by day for chart
      const dayMap: Record<string, { views: number; conversions: number }> = {};
      for (let i = 0; i <= parseInt(period); i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        dayMap[date] = { views: 0, conversions: 0 };
      }

      eventsData.forEach((e) => {
        const date = format(new Date(e.created_at), 'yyyy-MM-dd');
        if (dayMap[date]) {
          dayMap[date].views++;
          if (e.event_type === 'order_created') {
            dayMap[date].conversions++;
          }
        }
      });

      const chartData = Object.entries(dayMap)
        .map(([date, data]) => ({
          date,
          page_views: data.views,
          conversions: data.conversions,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setPerformanceData(chartData);
    }

    setLoading(false);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <SEO title="Analytics" />
        <Header />

        <main className="container max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                {language === 'de'
                  ? 'Performance und Suchanalysen'
                  : 'Performance and search analytics'}
              </p>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 {language === 'de' ? 'Tage' : 'Days'}</SelectItem>
                <SelectItem value="30">30 {language === 'de' ? 'Tage' : 'Days'}</SelectItem>
                <SelectItem value="90">90 {language === 'de' ? 'Tage' : 'Days'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Search className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Suchen' : 'Searches'}
                    </p>
                    <p className="text-2xl font-bold">{stats.totalSearches}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Eye className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ø Ergebnisse' : 'Avg Results'}
                    </p>
                    <p className="text-2xl font-bold">{stats.avgResults.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Keine Ergebnisse' : 'Zero Results'}
                    </p>
                    <p className="text-2xl font-bold">{stats.zeroResults}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MousePointer className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Klickrate' : 'Click Rate'}
                    </p>
                    <p className="text-2xl font-bold">{stats.clickRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Event-Aktivität' : 'Event Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) =>
                        format(new Date(d), 'dd.MM', {
                          locale: language === 'de' ? de : enUS,
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(d) =>
                        format(new Date(d), 'dd.MM.yyyy', {
                          locale: language === 'de' ? de : enUS,
                        })
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="page_views"
                      name={language === 'de' ? 'Events' : 'Events'}
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                    />
                    <Area
                      type="monotone"
                      dataKey="conversions"
                      name={language === 'de' ? 'Bestellungen' : 'Orders'}
                      stroke="hsl(142 76% 36%)"
                      fill="hsl(142 76% 36% / 0.2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Search Queries */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Top Suchanfragen' : 'Top Search Queries'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchQueries.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  {language === 'de' ? 'Keine Suchdaten' : 'No search data'}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'de' ? 'Suchanfrage' : 'Query'}</TableHead>
                      <TableHead className="text-right">
                        {language === 'de' ? 'Anzahl' : 'Count'}
                      </TableHead>
                      <TableHead className="text-right">
                        {language === 'de' ? 'Ø Ergebnisse' : 'Avg Results'}
                      </TableHead>
                      <TableHead className="text-right">
                        {language === 'de' ? 'Klickrate' : 'Click Rate'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchQueries.map((q, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{q.query}</TableCell>
                        <TableCell className="text-right">{q.count}</TableCell>
                        <TableCell className="text-right">
                          {q.avg_results.toFixed(1)}
                          {q.avg_results === 0 && (
                            <Badge variant="destructive" className="ml-2">
                              0
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{q.click_rate.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Order Events */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Letzte Order-Events' : 'Recent Order Events'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderEvents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  {language === 'de' ? 'Keine Events' : 'No events'}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'de' ? 'Zeit' : 'Time'}</TableHead>
                      <TableHead>{language === 'de' ? 'Event' : 'Event'}</TableHead>
                      <TableHead>{language === 'de' ? 'Daten' : 'Data'}</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderEvents.slice(0, 20).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          {format(new Date(event.created_at), 'dd.MM HH:mm', {
                            locale: language === 'de' ? de : enUS,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.event_type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {JSON.stringify(event.event_data)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={event.processed ? 'default' : 'secondary'}>
                            {event.processed
                              ? language === 'de'
                                ? 'Verarbeitet'
                                : 'Processed'
                              : language === 'de'
                              ? 'Ausstehend'
                              : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </AdminGuard>
  );
};

export default Analytics;
