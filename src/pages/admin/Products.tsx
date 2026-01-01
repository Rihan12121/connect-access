import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  Package, 
  Loader2,
  Trash2,
  Edit,
  Plus,
  X,
  Check
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/products';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount: number | null;
  image: string;
  images: string[] | null;
  category: string;
  subcategory: string | null;
  tags: string[] | null;
  in_stock: boolean;
  created_at: string;
}

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  original_price: null as number | null,
  discount: null as number | null,
  image: '',
  images: [] as string[],
  category: '',
  subcategory: '',
  tags: [] as string[],
  in_stock: true,
};

const AdminProducts = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setTagsInput('');
    setImagesInput('');
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price,
      discount: product.discount,
      image: product.image,
      images: product.images || [],
      category: product.category,
      subcategory: product.subcategory || '',
      tags: product.tags || [],
      in_stock: product.in_stock,
    });
    setTagsInput((product.tags || []).join(', '));
    setImagesInput((product.images || []).join('\n'));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      toast.error(language === 'de' ? 'Bitte fülle alle Pflichtfelder aus' : 'Please fill in all required fields');
      return;
    }

    setSaving(true);

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price,
      original_price: formData.original_price || null,
      discount: formData.discount || null,
      image: formData.image,
      images: imagesInput.split('\n').map(s => s.trim()).filter(Boolean),
      category: formData.category,
      subcategory: formData.subcategory || null,
      tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean),
      in_stock: formData.in_stock,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        console.error('Error updating product:', error);
        toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
      } else {
        toast.success(language === 'de' ? 'Produkt aktualisiert' : 'Product updated');
        setDialogOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) {
        console.error('Error creating product:', error);
        toast.error(language === 'de' ? 'Fehler beim Erstellen' : 'Error creating');
      } else {
        toast.success(language === 'de' ? 'Produkt erstellt' : 'Product created');
        setDialogOpen(false);
        fetchProducts();
      }
    }

    setSaving(false);
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm(language === 'de' ? 'Produkt wirklich löschen?' : 'Really delete this product?')) {
      return;
    }

    setDeleting(productId);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } else {
      setProducts(products.filter(p => p.id !== productId));
      toast.success(language === 'de' ? 'Produkt gelöscht' : 'Product deleted');
    }

    setDeleting(null);
  };

  const getCategoryName = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    return cat?.name || slug;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={language === 'de' ? 'Produkte verwalten' : 'Manage Products'}
        description="Admin - Produkte verwalten"
      />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {language === 'de' ? 'Produkte' : 'Products'}
              </h1>
              <span className="text-muted-foreground">({products.length})</span>
            </div>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'de' ? 'Neues Produkt' : 'New Product'}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>{language === 'de' ? 'Keine Produkte vorhanden' : 'No products yet'}</p>
            <Button onClick={openCreateDialog} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Erstes Produkt erstellen' : 'Create first product'}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{getCategoryName(product.category)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.price.toFixed(2)} €</p>
                  {product.original_price && (
                    <p className="text-xs text-muted-foreground line-through">{product.original_price.toFixed(2)} €</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.in_stock ? (language === 'de' ? 'Verfügbar' : 'In Stock') : (language === 'de' ? 'Ausverkauft' : 'Out of Stock')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditDialog(product)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title={language === 'de' ? 'Bearbeiten' : 'Edit'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    disabled={deleting === product.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title={language === 'de' ? 'Löschen' : 'Delete'}
                  >
                    {deleting === product.id ? (
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

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct 
                ? (language === 'de' ? 'Produkt bearbeiten' : 'Edit Product')
                : (language === 'de' ? 'Neues Produkt' : 'New Product')
              }
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{language === 'de' ? 'Name *' : 'Name *'}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'de' ? 'Produktname' : 'Product name'}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{language === 'de' ? 'Beschreibung' : 'Description'}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={language === 'de' ? 'Produktbeschreibung' : 'Product description'}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">{language === 'de' ? 'Preis (€) *' : 'Price (€) *'}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="original_price">{language === 'de' ? 'Originalpreis (€)' : 'Original Price (€)'}</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price || ''}
                  onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount">{language === 'de' ? 'Rabatt (%)' : 'Discount (%)'}</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || null })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">{language === 'de' ? 'Hauptbild URL *' : 'Main Image URL *'}</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="images">{language === 'de' ? 'Weitere Bilder (eine URL pro Zeile)' : 'Additional Images (one URL per line)'}</Label>
              <Textarea
                id="images"
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://...&#10;https://..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">{language === 'de' ? 'Kategorie *' : 'Category *'}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'de' ? 'Kategorie wählen' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subcategory">{language === 'de' ? 'Unterkategorie' : 'Subcategory'}</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder={language === 'de' ? 'z.B. smartphones' : 'e.g. smartphones'}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">{language === 'de' ? 'Tags (kommagetrennt)' : 'Tags (comma separated)'}</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={language === 'de' ? 'Premium, Neu, Sale' : 'Premium, New, Sale'}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
              />
              <Label htmlFor="in_stock">{language === 'de' ? 'Auf Lager' : 'In Stock'}</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {language === 'de' ? 'Speichern' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminProducts;
