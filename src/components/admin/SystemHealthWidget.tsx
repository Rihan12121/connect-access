import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Activity, Users, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  threshold: { warning: number; critical: number };
}

const SystemHealthWidget = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      // Fetch recent platform metrics
      const { data } = await supabase
        .from('platform_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        const parsed: HealthMetric[] = data.slice(0, 4).map((m) => {
          const value = Number(m.metric_value);
          const warning = Number(m.threshold_warning) || 80;
          const critical = Number(m.threshold_critical) || 95;
          
          let status: 'healthy' | 'warning' | 'critical' = 'healthy';
          if (value >= critical) status = 'critical';
          else if (value >= warning) status = 'warning';

          return {
            name: m.metric_name,
            status,
            value,
            unit: m.metric_type === 'percentage' ? '%' : '',
            threshold: { warning, critical },
          };
        });
        setMetrics(parsed);
      } else {
        // Default mock metrics for demo
        setMetrics([
          { name: 'API Response Time', status: 'healthy', value: 145, unit: 'ms', threshold: { warning: 500, critical: 1000 } },
          { name: 'Error Rate', status: 'healthy', value: 0.2, unit: '%', threshold: { warning: 1, critical: 5 } },
          { name: 'Database Load', status: 'healthy', value: 35, unit: '%', threshold: { warning: 70, critical: 90 } },
          { name: 'Cache Hit Rate', status: 'healthy', value: 94, unit: '%', threshold: { warning: 80, critical: 60 } },
        ]);
      }
      setLoading(false);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success/10 text-success';
      case 'warning': return 'bg-amber-500/10 text-amber-500';
      case 'critical': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallStatus = metrics.some(m => m.status === 'critical') 
    ? 'critical' 
    : metrics.some(m => m.status === 'warning') 
      ? 'warning' 
      : 'healthy';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System Health
          </div>
          <Badge className={getStatusColor(overallStatus)}>
            {overallStatus === 'healthy' ? 'All Systems Operational' : 
             overallStatus === 'warning' ? 'Degraded Performance' : 'Issues Detected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{metric.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {metric.value}{metric.unit}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                metric.status === 'healthy' ? 'bg-success' : 
                metric.status === 'warning' ? 'bg-amber-500' : 'bg-destructive'
              }`} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SystemHealthWidget;
