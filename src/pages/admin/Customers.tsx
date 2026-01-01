import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Users, 
  Loader2,
  Ban,
  Shield,
  Search,
  Mail,
  Calendar
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Customer {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  email?: string;
  orders_count?: number;
}

interface BlockedUser {
  id: string;
  email: string | null;
  display_name: string | null;
  bank_account: string | null;
  reason: string | null;
  created_at: string;
}

const AdminCustomers = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockEmail, setBlockEmail] = useState('');
  const [blockName, setBlockName] = useState('');
  const [blockBankAccount, setBlockBankAccount] = useState('');
  const [blocking, setBlocking] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchBlockedUsers();
  }, []);

  const fetchCustomers = async () => {
    // Fetch profiles with order counts
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      // Get order counts for each customer
      const customersWithOrders = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id);

          return {
            ...profile,
            orders_count: count || 0,
          };
        })
      );
      setCustomers(customersWithOrders);
    }
    setLoading(false);
  };

  const fetchBlockedUsers = async () => {
    const { data, error } = await supabase
      .from('blocked_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blocked users:', error);
    } else {
      setBlockedUsers(data || []);
    }
  };

  const openBlockDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setBlockEmail('');
    setBlockName(customer.display_name || '');
    setBlockBankAccount('');
    setBlockReason('');
    setBlockDialogOpen(true);
  };

  const handleBlock = async () => {
    if (!blockEmail && !blockName && !blockBankAccount) {
      toast.error(language === 'de' ? 'Mindestens ein Feld ausfüllen' : 'Fill at least one field');
      return;
    }

    setBlocking(true);

    const { error } = await supabase
      .from('blocked_users')
      .insert({
        email: blockEmail || null,
        display_name: blockName || null,
        bank_account: blockBankAccount || null,
        reason: blockReason || null,
        blocked_by: user?.id,
      });

    if (error) {
      console.error('Error blocking user:', error);
      toast.error(language === 'de' ? 'Fehler beim Blockieren' : 'Error blocking user');
    } else {
      toast.success(language === 'de' ? 'Benutzer blockiert' : 'User blocked');
      setBlockDialogOpen(false);
      fetchBlockedUsers();
    }

    setBlocking(false);
  };

  const unblockUser = async (blockedId: string) => {
    if (!confirm(language === 'de' ? 'Blockierung aufheben?' : 'Remove block?')) {
      return;
    }

    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('id', blockedId);

    if (error) {
      console.error('Error unblocking:', error);
      toast.error(language === 'de' ? 'Fehler' : 'Error');
    } else {
      toast.success(language === 'de' ? 'Blockierung aufgehoben' : 'Block removed');
      fetchBlockedUsers();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filteredCustomers = customers.filter(c => 
    (c.display_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.user_id?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={language === 'de' ? 'Kunden verwalten' : 'Manage Customers'}
        description="Admin - Kunden verwalten"
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Kunden' : 'Customers'}
              </h1>
              <span className="text-muted-foreground">({customers.length})</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={showBlocked ? "default" : "outline"}
              onClick={() => setShowBlocked(!showBlocked)}
            >
              <Ban className="w-4 h-4 mr-2" />
              {language === 'de' ? `Blockiert (${blockedUsers.length})` : `Blocked (${blockedUsers.length})`}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'de' ? 'Kunden suchen...' : 'Search customers...'}
            className="pl-10"
          />
        </div>

        {showBlocked ? (
          /* Blocked Users List */
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Ban className="w-5 h-5 text-destructive" />
              {language === 'de' ? 'Blockierte Benutzer' : 'Blocked Users'}
            </h2>
            {blockedUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{language === 'de' ? 'Keine blockierten Benutzer' : 'No blocked users'}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {blockedUsers.map((blocked) => (
                  <div key={blocked.id} className="bg-card border border-destructive/30 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {blocked.email && (
                            <span className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs">
                              Email: {blocked.email}
                            </span>
                          )}
                          {blocked.display_name && (
                            <span className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs">
                              Name: {blocked.display_name}
                            </span>
                          )}
                          {blocked.bank_account && (
                            <span className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs">
                              Bank: {blocked.bank_account}
                            </span>
                          )}
                        </div>
                        {blocked.reason && (
                          <p className="text-sm text-muted-foreground">{blocked.reason}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === 'de' ? 'Blockiert am' : 'Blocked on'}: {formatDate(blocked.created_at)}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => unblockUser(blocked.id)}
                      >
                        {language === 'de' ? 'Entsperren' : 'Unblock'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Customers List */
          loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>{language === 'de' ? 'Keine Kunden gefunden' : 'No customers found'}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {customer.avatar_url ? (
                      <img src={customer.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {customer.display_name || (language === 'de' ? 'Unbekannt' : 'Unknown')}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(customer.created_at)}
                      </span>
                      <span>{customer.orders_count} {language === 'de' ? 'Bestellungen' : 'orders'}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openBlockDialog(customer)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    {language === 'de' ? 'Blockieren' : 'Block'}
                  </Button>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-destructive" />
              {language === 'de' ? 'Benutzer blockieren' : 'Block User'}
            </DialogTitle>
            <DialogDescription>
              {language === 'de' 
                ? 'Gib die Daten ein, die blockiert werden sollen. Benutzer mit übereinstimmenden Daten können sich nicht mehr anmelden.' 
                : 'Enter the data to block. Users with matching data will not be able to sign up.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="blockEmail">Email</Label>
              <Input
                id="blockEmail"
                type="email"
                value={blockEmail}
                onChange={(e) => setBlockEmail(e.target.value)}
                placeholder="beispiel@email.de"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="blockName">{language === 'de' ? 'Name' : 'Name'}</Label>
              <Input
                id="blockName"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                placeholder={language === 'de' ? 'Vor- und Nachname' : 'Full name'}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="blockBank">{language === 'de' ? 'Bankkonto (IBAN)' : 'Bank Account (IBAN)'}</Label>
              <Input
                id="blockBank"
                value={blockBankAccount}
                onChange={(e) => setBlockBankAccount(e.target.value)}
                placeholder="DE89 3704 0044 0532 0130 00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="blockReason">{language === 'de' ? 'Grund (optional)' : 'Reason (optional)'}</Label>
              <Textarea
                id="blockReason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder={language === 'de' ? 'Warum wird dieser Benutzer blockiert?' : 'Why is this user being blocked?'}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBlock}
              disabled={blocking || (!blockEmail && !blockName && !blockBankAccount)}
            >
              {blocking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Ban className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Blockieren' : 'Block'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminCustomers;
