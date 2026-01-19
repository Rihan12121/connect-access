import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  FolderTree,
  Loader2,
  Trash2,
  Edit,
  Plus,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  position: number;
  is_active: boolean;
}

const emptyCategory = {
  name: '',
  slug: '',
  icon: 'Package',
  image: '',
  position: 0,
  is_active: true,
};

const AdminCategories = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      ...emptyCategory,
      position: categories.length,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      image: category.image,
      position: category.position,
      is_active: category.is_active,
    });
    setDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[äöüß]/g, m => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[m] || m))
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error(language === 'de' ? 'Name und Slug erforderlich' : 'Name and slug required');
      return;
    }

    setSaving(true);

    const categoryData = {
      name: formData.name,
      slug: formData.slug,
      icon: formData.icon || 'Package',
      image: formData.image || '/placeholder.svg',
      position: formData.position,
      is_active: formData.is_active,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.id);

      if (error) {
        toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
      } else {
        toast.success(language === 'de' ? 'Kategorie aktualisiert' : 'Category updated');
        setDialogOpen(false);
        fetchCategories();
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert(categoryData);

      if (error) {
        toast.error(language === 'de' ? 'Fehler beim Erstellen' : 'Error creating');
      } else {
        toast.success(language === 'de' ? 'Kategorie erstellt' : 'Category created');
        setDialogOpen(false);
        fetchCategories();
      }
    }

    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm(language === 'de' ? 'Kategorie wirklich löschen?' : 'Really delete this category?')) {
      return;
    }

    setDeleting(id);

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } else {
      setCategories(categories.filter(c => c.id !== id));
      toast.success(language === 'de' ? 'Kategorie gelöscht' : 'Category deleted');
    }

    setDeleting(null);
  };

  const toggleActive = async (category: Category) => {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: !category.is_active })
      .eq('id', category.id);

    if (!error) {
      setCategories(categories.map(c => 
        c.id === category.id ? { ...c, is_active: !c.is_active } : c
      ));
      toast.success(category.is_active 
        ? (language === 'de' ? 'Kategorie deaktiviert' : 'Category deactivated')
        : (language === 'de' ? 'Kategorie aktiviert' : 'Category activated')
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={language === 'de' ? 'Kategorien verwalten' : 'Manage Categories'} />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <FolderTree className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Kategorien' : 'Categories'}
              </h1>
              <span className="text-muted-foreground">({categories.length})</span>
            </div>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'de' ? 'Neue Kategorie' : 'New Category'}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FolderTree className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>{language === 'de' ? 'Keine Kategorien vorhanden' : 'No categories yet'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className={`bg-card border border-border rounded-xl p-4 flex items-center gap-4 ${
                  !category.is_active ? 'opacity-50' : ''
                }`}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">/{category.slug}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(category)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title={category.is_active ? 'Deaktivieren' : 'Aktivieren'}
                  >
                    {category.is_active ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => openEditDialog(category)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteCategory(category.id)}
                    disabled={deleting === category.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    {deleting === category.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory 
                ? (language === 'de' ? 'Kategorie bearbeiten' : 'Edit Category')
                : (language === 'de' ? 'Neue Kategorie' : 'New Category')
              }
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{language === 'de' ? 'Name' : 'Name'}</Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({ 
                    ...formData, 
                    name,
                    slug: editingCategory ? formData.slug : generateSlug(name)
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>{language === 'de' ? 'Icon (Lucide-Name)' : 'Icon (Lucide name)'}</Label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Package, Shirt, Home, etc."
              />
            </div>

            <div className="grid gap-2">
              <Label>{language === 'de' ? 'Bild-URL' : 'Image URL'}</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">
                {language === 'de' ? 'Aktiv' : 'Active'}
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
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

export default AdminCategories;
