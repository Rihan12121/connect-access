import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { UserPlus, Shield, Trash2, Loader2, Search } from 'lucide-react';

interface Admin {
  user_id: string;
  email: string;
  created_at: string;
}

export const AdminManagement = () => {
  const { language } = useLanguage();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{ id: string; email: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      // Get all admin user_ids
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, created_at')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (roles && roles.length > 0) {
        // Get profiles for these users
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', roles.map(r => r.user_id));

        if (profilesError) throw profilesError;

        // Combine data
        const adminList = roles.map(role => {
          const profile = profiles?.find(p => p.user_id === role.user_id);
          return {
            user_id: role.user_id,
            email: profile?.display_name || role.user_id.slice(0, 8),
            created_at: role.created_at,
          };
        });

        setAdmins(adminList);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden der Admins' : 'Error loading admins');
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async () => {
    const query = searchEmail.trim();
    if (!query) return;

    setSearching(true);
    setFoundUser(null);

    try {
      // Check if search query is a UUID (user_id)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);

      let data = null;

      if (isUuid) {
        // Search by exact user_id
        const { data: result, error } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .eq('user_id', query)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        data = result;
      } else {
        // Search by display_name (which can contain email or name)
        const { data: result, error } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .ilike('display_name', `%${query}%`)
          .limit(1)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        data = result;
      }

      if (data) {
        // Check if already admin
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', data.user_id)
          .eq('role', 'admin')
          .single();

        if (existingRole) {
          toast.info(language === 'de' ? 'Dieser Benutzer ist bereits Admin' : 'This user is already an admin');
          setFoundUser(null);
        } else {
          setFoundUser({
            id: data.user_id,
            email: data.display_name || query,
          });
        }
      } else {
        toast.error(language === 'de' ? 'Benutzer nicht gefunden. Versuche E-Mail, Name oder User-ID.' : 'User not found. Try email, name or user ID.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(language === 'de' ? 'Fehler bei der Suche' : 'Search error');
    } finally {
      setSearching(false);
    }
  };

  const addAdmin = async () => {
    if (!foundUser) return;

    setAdding(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: foundUser.id,
          role: 'admin',
        });

      if (error) throw error;

      toast.success(language === 'de' ? 'Admin erfolgreich hinzugefügt' : 'Admin added successfully');
      setDialogOpen(false);
      setSearchEmail('');
      setFoundUser(null);
      fetchAdmins();
    } catch (error) {
      console.error('Add admin error:', error);
      toast.error(language === 'de' ? 'Fehler beim Hinzufügen' : 'Error adding admin');
    } finally {
      setAdding(false);
    }
  };

  const removeAdmin = async (userId: string) => {
    if (!confirm(language === 'de' ? 'Admin-Rechte wirklich entfernen?' : 'Really remove admin rights?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast.success(language === 'de' ? 'Admin-Rechte entfernt' : 'Admin rights removed');
      fetchAdmins();
    } catch (error) {
      console.error('Remove admin error:', error);
      toast.error(language === 'de' ? 'Fehler beim Entfernen' : 'Error removing admin');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">
            {language === 'de' ? 'Admin-Verwaltung' : 'Admin Management'}
          </h2>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" />
              {language === 'de' ? 'Admin hinzufügen' : 'Add Admin'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'de' ? 'Neuen Admin hinzufügen' : 'Add New Admin'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'de' ? 'Name, E-Mail oder User-ID...' : 'Name, email or user ID...'}
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                />
                <Button onClick={searchUser} disabled={searching || !searchEmail.trim()}>
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {foundUser && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">{foundUser.email}</p>
                  <p className="text-sm text-muted-foreground">ID: {foundUser.id.slice(0, 8)}...</p>
                  <Button 
                    onClick={addAdmin} 
                    disabled={adding}
                    className="mt-3 w-full"
                  >
                    {adding ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    {language === 'de' ? 'Als Admin hinzufügen' : 'Add as Admin'}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="p-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : admins.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          {language === 'de' ? 'Keine Admins gefunden' : 'No admins found'}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {admins.map((admin) => (
            <div key={admin.user_id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{admin.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'de' ? 'Seit' : 'Since'} {formatDate(admin.created_at)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAdmin(admin.user_id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
