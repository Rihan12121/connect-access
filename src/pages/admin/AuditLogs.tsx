import { useState, useEffect } from 'react';
import { History, User, Clock, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: unknown;
  new_values: unknown;
  ip_address: string | null;
  created_at: string;
  profile?: {
    display_name: string | null;
  };
}

const actionLabels: Record<string, { de: string; en: string; color: string }> = {
  create: { de: 'Erstellt', en: 'Created', color: 'bg-green-100 text-green-800' },
  update: { de: 'Aktualisiert', en: 'Updated', color: 'bg-blue-100 text-blue-800' },
  delete: { de: 'Gelöscht', en: 'Deleted', color: 'bg-red-100 text-red-800' },
  refund_approved: { de: 'Rückerstattung genehmigt', en: 'Refund Approved', color: 'bg-purple-100 text-purple-800' },
  refund_rejected: { de: 'Rückerstattung abgelehnt', en: 'Refund Rejected', color: 'bg-orange-100 text-orange-800' },
  order_status_changed: { de: 'Bestellstatus geändert', en: 'Order Status Changed', color: 'bg-yellow-100 text-yellow-800' },
  product_updated: { de: 'Produkt aktualisiert', en: 'Product Updated', color: 'bg-indigo-100 text-indigo-800' },
  category_updated: { de: 'Kategorie aktualisiert', en: 'Category Updated', color: 'bg-cyan-100 text-cyan-800' },
};

const entityLabels: Record<string, { de: string; en: string }> = {
  product: { de: 'Produkt', en: 'Product' },
  order: { de: 'Bestellung', en: 'Order' },
  category: { de: 'Kategorie', en: 'Category' },
  refund: { de: 'Rückerstattung', en: 'Refund' },
  user: { de: 'Benutzer', en: 'User' },
  discount: { de: 'Rabattcode', en: 'Discount Code' },
  banner: { de: 'Banner', en: 'Banner' },
};

const AdminAuditLogs = () => {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profile:profiles!audit_logs_user_id_fkey (
            display_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        // If foreign key doesn't exist, fetch without profile join
        const { data: logsOnly, error: logsError } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500);
        
        if (logsError) throw logsError;
        setLogs(logsOnly || []);
      } else {
        setLogs((data as unknown as AuditLog[]) || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const label = actionLabels[action] || { de: action, en: action, color: 'bg-gray-100 text-gray-800' };
    return (
      <Badge className={label.color}>
        {language === 'de' ? label.de : label.en}
      </Badge>
    );
  };

  const getEntityLabel = (entity: string) => {
    const label = entityLabels[entity] || { de: entity, en: entity };
    return language === 'de' ? label.de : label.en;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.entity_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesEntity = filterEntity === 'all' || log.entity_type === filterEntity;
    return matchesSearch && matchesAction && matchesEntity;
  });

  const uniqueActions = [...new Set(logs.map(l => l.action))];
  const uniqueEntities = [...new Set(logs.map(l => l.entity_type))];

  return (
    <AdminGuard>
      <SEO title={language === 'de' ? 'Audit-Logs' : 'Audit Logs'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <History className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === 'de' ? 'Audit-Logs' : 'Audit Logs'}
            </h1>
            <Badge variant="secondary">{filteredLogs.length}</Badge>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'de' ? 'Suchen...' : 'Search...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={language === 'de' ? 'Aktion' : 'Action'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'de' ? 'Alle Aktionen' : 'All Actions'}</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>
                        {actionLabels[action]?.[language] || action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterEntity} onValueChange={setFilterEntity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={language === 'de' ? 'Entität' : 'Entity'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'de' ? 'Alle Entitäten' : 'All Entities'}</SelectItem>
                    {uniqueEntities.map(entity => (
                      <SelectItem key={entity} value={entity}>
                        {getEntityLabel(entity)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {language === 'de' ? 'Keine Logs gefunden' : 'No logs found'}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'de' ? 'Zeitpunkt' : 'Time'}</TableHead>
                    <TableHead>{language === 'de' ? 'Benutzer' : 'User'}</TableHead>
                    <TableHead>{language === 'de' ? 'Rolle' : 'Role'}</TableHead>
                    <TableHead>{language === 'de' ? 'Aktion' : 'Action'}</TableHead>
                    <TableHead>{language === 'de' ? 'Entität' : 'Entity'}</TableHead>
                    <TableHead>{language === 'de' ? 'Details' : 'Details'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDate(log.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {log.profile?.display_name || log.user_id.slice(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.user_role}</Badge>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{getEntityLabel(log.entity_type)}</span>
                        {log.entity_id && (
                          <span className="text-xs text-muted-foreground block font-mono">
                            {log.entity_id.slice(0, 8)}...
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {(log.old_values || log.new_values) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedLog(log)}
                          >
                            {language === 'de' ? 'Anzeigen' : 'View'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Log Details Dialog */}
          <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'de' ? 'Log-Details' : 'Log Details'}
                </DialogTitle>
              </DialogHeader>
              {selectedLog && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'de' ? 'Aktion' : 'Action'}</p>
                      <p>{getActionBadge(selectedLog.action)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'de' ? 'Zeitpunkt' : 'Time'}</p>
                      <p>{formatDate(selectedLog.created_at)}</p>
                    </div>
                  </div>

                  {selectedLog.old_values && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{language === 'de' ? 'Alte Werte' : 'Old Values'}</p>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        {JSON.stringify(selectedLog.old_values, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedLog.new_values && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{language === 'de' ? 'Neue Werte' : 'New Values'}</p>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        {JSON.stringify(selectedLog.new_values, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
};

export default AdminAuditLogs;
