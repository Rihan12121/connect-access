import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Tag, Percent, Euro, Loader2, Check, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  uses_count: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
}

const emptyCode: Omit<DiscountCode, 'id' | 'uses_count' | 'created_at'> = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 10,
  min_order_amount: null,
  max_uses: null,
  is_active: true,
  valid_from: null,
  valid_until: null,
};

const AdminDiscountCodes = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCode, setCurrentCode] = useState<Partial<DiscountCode>>(emptyCode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching codes:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setCurrentCode(emptyCode);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (code: DiscountCode) => {
    setCurrentCode(code);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentCode.code?.trim()) {
      toast.error(language === 'de' ? 'Code erforderlich' : 'Code required');
      return;
    }

    setSaving(true);

    const payload = {
      code: currentCode.code.toUpperCase().trim(),
      description: currentCode.description || null,
      discount_type: currentCode.discount_type,
      discount_value: currentCode.discount_value,
      min_order_amount: currentCode.min_order_amount || null,
      max_uses: currentCode.max_uses || null,
      is_active: currentCode.is_active ?? true,
      valid_from: currentCode.valid_from || null,
      valid_until: currentCode.valid_until || null,
    };

    if (isEditing && currentCode.id) {
      const { error } = await supabase
        .from('discount_codes')
        .update(payload)
        .eq('id', currentCode.id);

      if (error) {
        toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
      } else {
        toast.success(language === 'de' ? 'Code aktualisiert!' : 'Code updated!');
        setDialogOpen(false);
        fetchCodes();
      }
    } else {
      const { error } = await supabase
        .from('discount_codes')
        .insert(payload);

      if (error) {
        if (error.code === '23505') {
          toast.error(language === 'de' ? 'Code existiert bereits' : 'Code already exists');
        } else {
          toast.error(language === 'de' ? 'Fehler beim Erstellen' : 'Error creating');
        }
      } else {
        toast.success(language === 'de' ? 'Code erstellt!' : 'Code created!');
        setDialogOpen(false);
        fetchCodes();
      }
    }

    setSaving(false);
  };

  const deleteCode = async (id: string) => {
    if (!confirm(language === 'de' ? 'Code wirklich löschen?' : 'Delete this code?')) return;

    const { error } = await supabase.from('discount_codes').delete().eq('id', id);
    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } else {
      toast.success(language === 'de' ? 'Gelöscht!' : 'Deleted!');
      fetchCodes();
    }
  };

  const toggleActive = async (code: DiscountCode) => {
    const { error } = await supabase
      .from('discount_codes')
      .update({ is_active: !code.is_active })
      .eq('id', code.id);

    if (!error) {
      fetchCodes();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Rabattcodes — Admin" />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {language === 'de' ? 'Rabattcodes' : 'Discount Codes'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'de' 
                ? 'Erstellen und verwalten Sie Rabattcodes'
                : 'Create and manage discount codes'}
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            {language === 'de' ? 'Neuer Code' : 'New Code'}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : codes.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border">
            <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">
              {language === 'de' ? 'Noch keine Rabattcodes' : 'No discount codes yet'}
            </p>
            <Button onClick={openCreate}>
              {language === 'de' ? 'Ersten Code erstellen' : 'Create first code'}
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'de' ? 'Code' : 'Code'}</TableHead>
                  <TableHead>{language === 'de' ? 'Rabatt' : 'Discount'}</TableHead>
                  <TableHead>{language === 'de' ? 'Mindestbetrag' : 'Min. Order'}</TableHead>
                  <TableHead>{language === 'de' ? 'Nutzungen' : 'Uses'}</TableHead>
                  <TableHead>{language === 'de' ? 'Status' : 'Status'}</TableHead>
                  <TableHead className="text-right">{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div>
                        <span className="font-mono font-semibold text-foreground">{code.code}</span>
                        {code.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{code.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {code.discount_type === 'percentage' ? (
                          <>
                            <Percent className="w-4 h-4 text-primary" />
                            <span>{code.discount_value}%</span>
                          </>
                        ) : (
                          <>
                            <Euro className="w-4 h-4 text-primary" />
                            <span>{code.discount_value.toFixed(2)} €</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {code.min_order_amount ? `${code.min_order_amount.toFixed(2)} €` : '—'}
                    </TableCell>
                    <TableCell>
                      {code.uses_count}{code.max_uses ? ` / ${code.max_uses}` : ''}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(code)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          code.is_active 
                            ? 'bg-success/10 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {code.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {code.is_active 
                          ? (language === 'de' ? 'Aktiv' : 'Active')
                          : (language === 'de' ? 'Inaktiv' : 'Inactive')}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(code)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCode(code.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing 
                ? (language === 'de' ? 'Code bearbeiten' : 'Edit Code')
                : (language === 'de' ? 'Neuer Rabattcode' : 'New Discount Code')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'de' ? 'Code' : 'Code'} *</Label>
              <Input
                value={currentCode.code || ''}
                onChange={(e) => setCurrentCode({ ...currentCode, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                className="mt-1.5 font-mono"
              />
            </div>

            <div>
              <Label>{language === 'de' ? 'Beschreibung' : 'Description'}</Label>
              <Input
                value={currentCode.description || ''}
                onChange={(e) => setCurrentCode({ ...currentCode, description: e.target.value })}
                placeholder={language === 'de' ? 'Sommer-Aktion' : 'Summer sale'}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'de' ? 'Rabatttyp' : 'Discount Type'}</Label>
                <Select
                  value={currentCode.discount_type}
                  onValueChange={(v) => setCurrentCode({ ...currentCode, discount_type: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{language === 'de' ? 'Prozent' : 'Percentage'}</SelectItem>
                    <SelectItem value="fixed">{language === 'de' ? 'Festbetrag' : 'Fixed amount'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'de' ? 'Wert' : 'Value'} *</Label>
                <Input
                  type="number"
                  min={0}
                  step={currentCode.discount_type === 'percentage' ? 1 : 0.01}
                  value={currentCode.discount_value || ''}
                  onChange={(e) => setCurrentCode({ ...currentCode, discount_value: parseFloat(e.target.value) || 0 })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'de' ? 'Mindestbestellwert' : 'Min. Order'}</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={currentCode.min_order_amount || ''}
                  onChange={(e) => setCurrentCode({ ...currentCode, min_order_amount: parseFloat(e.target.value) || null })}
                  placeholder="50.00"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{language === 'de' ? 'Max. Nutzungen' : 'Max. Uses'}</Label>
                <Input
                  type="number"
                  min={1}
                  value={currentCode.max_uses || ''}
                  onChange={(e) => setCurrentCode({ ...currentCode, max_uses: parseInt(e.target.value) || null })}
                  placeholder="∞"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label>{language === 'de' ? 'Aktiv' : 'Active'}</Label>
              <Switch
                checked={currentCode.is_active ?? true}
                onCheckedChange={(checked) => setCurrentCode({ ...currentCode, is_active: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {language === 'de' ? 'Speichern' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDiscountCodes;
