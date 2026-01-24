import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  Languages, 
  Loader2, 
  Save, 
  Search, 
  Plus, 
  Trash2,
  Edit2,
  Filter
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface Translation {
  id: string;
  translation_key: string;
  de: string;
  en: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const categories = [
  'general',
  'navigation',
  'products',
  'cart',
  'checkout',
  'auth',
  'account',
  'footer',
  'categories',
  'errors',
  'success',
];

const AdminTranslations = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  
  const [formData, setFormData] = useState({
    translation_key: '',
    de: '',
    en: '',
    category: 'general',
  });

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .order('category', { ascending: true })
      .order('translation_key', { ascending: true });

    if (error) {
      toast.error('Fehler beim Laden der Übersetzungen');
    } else {
      setTranslations(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.translation_key || !formData.de || !formData.en) {
      toast.error('Bitte fülle alle Felder aus');
      return;
    }

    setSaving(true);

    try {
      if (editingTranslation) {
        const { error } = await supabase
          .from('translations')
          .update({
            translation_key: formData.translation_key,
            de: formData.de,
            en: formData.en,
            category: formData.category,
          })
          .eq('id', editingTranslation.id);

        if (error) throw error;
        toast.success('Übersetzung aktualisiert');
      } else {
        const { error } = await supabase
          .from('translations')
          .insert({
            translation_key: formData.translation_key,
            de: formData.de,
            en: formData.en,
            category: formData.category,
          });

        if (error) throw error;
        toast.success('Übersetzung hinzugefügt');
      }

      setIsDialogOpen(false);
      setEditingTranslation(null);
      setFormData({ translation_key: '', de: '', en: '', category: 'general' });
      loadTranslations();
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Speichern');
    }

    setSaving(false);
  };

  const handleEdit = (translation: Translation) => {
    setEditingTranslation(translation);
    setFormData({
      translation_key: translation.translation_key,
      de: translation.de,
      en: translation.en,
      category: translation.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Übersetzung wirklich löschen?')) return;

    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Fehler beim Löschen');
    } else {
      toast.success('Übersetzung gelöscht');
      loadTranslations();
    }
  };

  const handleAddNew = () => {
    setEditingTranslation(null);
    setFormData({ translation_key: '', de: '', en: '', category: 'general' });
    setIsDialogOpen(true);
  };

  const filteredTranslations = translations.filter(t => {
    const matchesSearch = 
      t.translation_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.de.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Übersetzungen verwalten" />
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <Languages className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'de' ? 'Übersetzungen' : 'Translations'}
                </h1>
                <p className="text-muted-foreground">
                  {translations.length} {language === 'de' ? 'Einträge' : 'entries'}
                </p>
              </div>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                {language === 'de' ? 'Neue Übersetzung' : 'New Translation'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTranslation 
                    ? (language === 'de' ? 'Übersetzung bearbeiten' : 'Edit Translation')
                    : (language === 'de' ? 'Neue Übersetzung' : 'New Translation')
                  }
                </DialogTitle>
                <DialogDescription>
                  {language === 'de' 
                    ? 'Texte in Deutsch und Englisch eingeben'
                    : 'Enter texts in German and English'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label>Key (z.B. nav.home)</Label>
                  <Input
                    value={formData.translation_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, translation_key: e.target.value }))}
                    placeholder="category.key"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Kategorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>🇩🇪 Deutsch</Label>
                  <Textarea
                    value={formData.de}
                    onChange={(e) => setFormData(prev => ({ ...prev, de: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>🇬🇧 English</Label>
                  <Textarea
                    value={formData.en}
                    onChange={(e) => setFormData(prev => ({ ...prev, en: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'de' ? 'Speichern' : 'Save'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={language === 'de' ? 'Suchen...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kategorien</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Key</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>🇩🇪 Deutsch</TableHead>
                <TableHead>🇬🇧 English</TableHead>
                <TableHead className="w-24">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTranslations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {language === 'de' ? 'Keine Übersetzungen gefunden' : 'No translations found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTranslations.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm">{t.translation_key}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{t.de}</TableCell>
                    <TableCell className="max-w-xs truncate">{t.en}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(t)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(t.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">
            {language === 'de' ? 'Hinweis' : 'Note'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'de' 
              ? 'Übersetzungen werden mit einem Key (z.B. "nav.home") gespeichert. Nutze das Format "kategorie.schluessel" für eine gute Organisation. Änderungen werden sofort wirksam.'
              : 'Translations are stored with a key (e.g. "nav.home"). Use the format "category.key" for good organization. Changes take effect immediately.'
            }
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminTranslations;