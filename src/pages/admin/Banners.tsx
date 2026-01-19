import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  Image as ImageIcon,
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

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string;
  position: number;
  is_active: boolean;
}

const emptyBanner = {
  title: '',
  subtitle: '',
  image: '',
  link: '/products',
  position: 0,
  is_active: true,
};

const AdminBanners = () => {
  const { language } = useLanguage();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState(emptyBanner);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingBanner(null);
    setFormData({
      ...emptyBanner,
      position: banners.length,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link,
      position: banner.position,
      is_active: banner.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image) {
      toast.error(language === 'de' ? 'Titel und Bild erforderlich' : 'Title and image required');
      return;
    }

    setSaving(true);

    const bannerData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      image: formData.image,
      link: formData.link || '/products',
      position: formData.position,
      is_active: formData.is_active,
    };

    if (editingBanner) {
      const { error } = await supabase
        .from('hero_banners')
        .update(bannerData)
        .eq('id', editingBanner.id);

      if (error) {
        toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
      } else {
        toast.success(language === 'de' ? 'Banner aktualisiert' : 'Banner updated');
        setDialogOpen(false);
        fetchBanners();
      }
    } else {
      const { error } = await supabase
        .from('hero_banners')
        .insert(bannerData);

      if (error) {
        toast.error(language === 'de' ? 'Fehler beim Erstellen' : 'Error creating');
      } else {
        toast.success(language === 'de' ? 'Banner erstellt' : 'Banner created');
        setDialogOpen(false);
        fetchBanners();
      }
    }

    setSaving(false);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm(language === 'de' ? 'Banner wirklich löschen?' : 'Really delete this banner?')) {
      return;
    }

    setDeleting(id);

    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } else {
      setBanners(banners.filter(b => b.id !== id));
      toast.success(language === 'de' ? 'Banner gelöscht' : 'Banner deleted');
    }

    setDeleting(null);
  };

  const toggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from('hero_banners')
      .update({ is_active: !banner.is_active })
      .eq('id', banner.id);

    if (!error) {
      setBanners(banners.map(b => 
        b.id === banner.id ? { ...b, is_active: !b.is_active } : b
      ));
      toast.success(banner.is_active 
        ? (language === 'de' ? 'Banner deaktiviert' : 'Banner deactivated')
        : (language === 'de' ? 'Banner aktiviert' : 'Banner activated')
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={language === 'de' ? 'Banner verwalten' : 'Manage Banners'} />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Hero-Banner' : 'Hero Banners'}
              </h1>
              <span className="text-muted-foreground">({banners.length})</span>
            </div>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'de' ? 'Neues Banner' : 'New Banner'}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>{language === 'de' ? 'Keine Banner vorhanden' : 'No banners yet'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {banners.map((banner) => (
              <div 
                key={banner.id} 
                className={`bg-card border border-border rounded-xl p-4 flex items-center gap-4 ${
                  !banner.is_active ? 'opacity-50' : ''
                }`}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                
                <img 
                  src={banner.image} 
                  alt={banner.title}
                  className="w-24 h-14 object-cover rounded-lg"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-sm text-muted-foreground truncate">{banner.subtitle}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{banner.link}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(banner)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {banner.is_active ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => openEditDialog(banner)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    disabled={deleting === banner.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    {deleting === banner.id ? (
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

      {/* Banner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBanner 
                ? (language === 'de' ? 'Banner bearbeiten' : 'Edit Banner')
                : (language === 'de' ? 'Neues Banner' : 'New Banner')
              }
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{language === 'de' ? 'Titel' : 'Title'}</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>{language === 'de' ? 'Untertitel' : 'Subtitle'}</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>{language === 'de' ? 'Bild-URL' : 'Image URL'}</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
              {formData.image && (
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label>Link</Label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="/products"
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

export default AdminBanners;
