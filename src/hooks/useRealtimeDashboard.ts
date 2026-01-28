import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeStats {
  newOrders: number;
  newOrdersToday: number;
  revenueToday: number;
  lowStockAlerts: number;
  pendingRefunds: number;
  activeConversations: number;
  openOrders: number;
}

interface RealtimeOrder {
  id: string;
  total: number;
  status: string;
  created_at: string;
  user_id: string;
}

interface RealtimeEvent {
  type: 'new_order' | 'status_change' | 'low_stock' | 'new_message' | 'new_refund';
  message: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export const useRealtimeDashboard = () => {
  const [stats, setStats] = useState<RealtimeStats>({
    newOrders: 0,
    newOrdersToday: 0,
    revenueToday: 0,
    lowStockAlerts: 0,
    pendingRefunds: 0,
    activeConversations: 0,
    openOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RealtimeOrder[]>([]);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const addEvent = useCallback((event: Omit<RealtimeEvent, 'timestamp'>) => {
    setEvents(prev => [
      { ...event, timestamp: new Date() },
      ...prev.slice(0, 49), // Keep last 50 events
    ]);
  }, []);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch today's orders - only count paid/completed for revenue, exclude cancelled
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('id, total, status, payment_status, created_at, user_id')
      .gte('created_at', today.toISOString())
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });

    // Fetch open/pending orders (not cancelled, not delivered)
    const { data: openOrdersData } = await supabase
      .from('orders')
      .select('id')
      .in('status', ['pending', 'confirmed', 'shipped'])
      .neq('status', 'cancelled');

    // Fetch low stock products
    const { data: lowStock } = await supabase
      .from('products')
      .select('id')
      .lt('stock_quantity', 10)
      .eq('in_stock', true);

    // Fetch pending refunds
    const { data: pendingRefunds } = await supabase
      .from('refunds')
      .select('id')
      .eq('status', 'pending');

    // Fetch recent orders (exclude cancelled from main view)
    const { data: recent } = await supabase
      .from('orders')
      .select('id, total, status, payment_status, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (todayOrders) {
      // Only count revenue from paid orders
      const paidOrders = todayOrders.filter(o => o.payment_status === 'paid');
      setStats(prev => ({
        ...prev,
        newOrdersToday: todayOrders.length,
        revenueToday: paidOrders.reduce((sum, o) => sum + Number(o.total), 0),
        lowStockAlerts: lowStock?.length || 0,
        pendingRefunds: pendingRefunds?.length || 0,
        openOrders: openOrdersData?.length || 0,
      }));
    }

    if (recent) {
      setRecentOrders(recent);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();

    // Subscribe to orders changes
    const ordersChannel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const order = payload.new as RealtimeOrder;
          
          setStats(prev => ({
            ...prev,
            newOrders: prev.newOrders + 1,
            newOrdersToday: prev.newOrdersToday + 1,
            revenueToday: prev.revenueToday + Number(order.total),
          }));

          setRecentOrders(prev => [order, ...prev.slice(0, 9)]);

          addEvent({
            type: 'new_order',
            message: `Neue Bestellung: ${Number(order.total).toFixed(2)}€`,
            data: { orderId: order.id },
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const order = payload.new as RealtimeOrder;
          const oldOrder = payload.old as RealtimeOrder;

          if (order.status !== oldOrder.status) {
            addEvent({
              type: 'status_change',
              message: `Bestellung #${order.id.slice(0, 8)} → ${order.status}`,
              data: { orderId: order.id, status: order.status },
            });

            setRecentOrders(prev =>
              prev.map(o => (o.id === order.id ? order : o))
            );
          }
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });

    // Subscribe to products (low stock alerts)
    const productsChannel = supabase
      .channel('realtime-products')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          const product = payload.new as { stock_quantity: number; name: string; low_stock_threshold: number };
          const threshold = product.low_stock_threshold || 10;

          if (product.stock_quantity <= threshold && product.stock_quantity > 0) {
            addEvent({
              type: 'low_stock',
              message: `Niedriger Lagerbestand: ${product.name} (${product.stock_quantity})`,
            });

            setStats(prev => ({
              ...prev,
              lowStockAlerts: prev.lowStockAlerts + 1,
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to refunds
    const refundsChannel = supabase
      .channel('realtime-refunds')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'refunds',
        },
        (payload) => {
          const refund = payload.new as { amount: number; order_id: string };

          addEvent({
            type: 'new_refund',
            message: `Neue Rückerstattung: ${Number(refund.amount).toFixed(2)}€`,
            data: { orderId: refund.order_id },
          });

          setStats(prev => ({
            ...prev,
            pendingRefunds: prev.pendingRefunds + 1,
          }));
        }
      )
      .subscribe();

    // Subscribe to messages
    const messagesChannel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          addEvent({
            type: 'new_message',
            message: 'Neue Nachricht im Live-Chat',
          });
        }
      )
      .subscribe();

    return () => {
      ordersChannel.unsubscribe();
      productsChannel.unsubscribe();
      refundsChannel.unsubscribe();
      messagesChannel.unsubscribe();
    };
  }, [fetchInitialData, addEvent]);

  const clearNewOrdersCount = useCallback(() => {
    setStats(prev => ({ ...prev, newOrders: 0 }));
  }, []);

  return {
    stats,
    recentOrders,
    events,
    connected,
    clearNewOrdersCount,
    refreshData: fetchInitialData,
  };
};
