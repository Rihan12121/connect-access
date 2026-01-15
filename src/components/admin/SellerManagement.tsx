import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Search, Store, Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Seller {
  user_id: string;
  email: string | null;
  created_at: string;
}

interface FoundUser {
  user_id: string;
  display_name: string | null;
}

export const SellerManagement = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, created_at")
      .eq("role", "seller");

    if (rolesError) {
      toast.error("Fehler beim Laden der Verkäufer");
      setLoading(false);
      return;
    }

    if (!rolesData || rolesData.length === 0) {
      setSellers([]);
      setLoading(false);
      return;
    }

    const userIds = rolesData.map((r) => r.user_id);
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds);

    const sellersWithEmails = rolesData.map((role) => {
      const profile = profilesData?.find((p) => p.user_id === role.user_id);
      return {
        user_id: role.user_id,
        email: profile?.display_name || null,
        created_at: role.created_at,
      };
    });

    setSellers(sellersWithEmails);
    setLoading(false);
  };

  const searchUser = async () => {
    const query = searchEmail.trim();
    if (!query) return;

    setSearching(true);
    setFoundUser(null);

    // Check if search query is a UUID (user_id)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);

    let data = null;

    if (isUuid) {
      // Search by exact user_id
      const { data: result } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .eq("user_id", query)
        .single();
      data = result;
    } else {
      // Search by display_name (which can contain email or name)
      const { data: result } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .ilike("display_name", `%${query}%`)
        .limit(1)
        .single();
      data = result;
    }

    if (!data) {
      toast.error("Nutzer nicht gefunden. Versuche E-Mail, Name oder User-ID.");
      setSearching(false);
      return;
    }

    // Check if already a seller
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", data.user_id)
      .eq("role", "seller")
      .single();

    if (existingRole) {
      toast.info("Dieser Nutzer ist bereits Verkäufer");
      setSearching(false);
      return;
    }

    setFoundUser(data);
    setSearching(false);
  };

  const addSeller = async () => {
    if (!foundUser) return;

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: foundUser.user_id, role: "seller" });

    if (error) {
      toast.error("Fehler beim Hinzufügen des Verkäufers");
      return;
    }

    toast.success("Verkäufer erfolgreich hinzugefügt");
    setFoundUser(null);
    setSearchEmail("");
    setDialogOpen(false);
    fetchSellers();
  };

  const removeSeller = async (userId: string) => {
    if (!confirm("Möchtest du diesen Verkäufer wirklich entfernen?")) return;

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "seller");

    if (error) {
      toast.error("Fehler beim Entfernen des Verkäufers");
      return;
    }

    toast.success("Verkäufer wurde entfernt");
    fetchSellers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Verkäufer-Verwaltung
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Verkäufer hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Verkäufer hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Name, E-Mail oder User-ID suchen..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchUser()}
                />
                <Button onClick={searchUser} disabled={searching}>
                  {searching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {foundUser && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                  <p className="font-medium">{foundUser.display_name || "Kein Name"}</p>
                  <p className="text-sm text-muted-foreground">ID: {foundUser.user_id}</p>
                  <Button onClick={addSeller} className="w-full mt-2">
                    Als Verkäufer hinzufügen
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {sellers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Noch keine Verkäufer vorhanden
          </p>
        ) : (
          <div className="space-y-2">
            {sellers.map((seller) => (
              <div
                key={seller.user_id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{seller.email || "Kein Name"}</p>
                  <p className="text-sm text-muted-foreground">
                    Seit {formatDate(seller.created_at)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSeller(seller.user_id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
