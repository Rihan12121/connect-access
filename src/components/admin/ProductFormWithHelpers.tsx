import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X, Plus, Lightbulb, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  tags: string[];
  in_stock: boolean;
  bullet_points: string[];
}

interface Category {
  slug: string;
  name: string;
}

interface ProductFormWithHelpersProps {
  initialData?: Partial<ProductFormData>;
  categories: Category[];
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

// Helper text constants
const FIELD_HELPERS = {
  name: {
    de: 'Kurz und prägnant, max. 60 Zeichen. Beispiel: "Premium Bluetooth Kopfhörer ANC Pro"',
    en: 'Short and concise, max 60 chars. Example: "Premium Bluetooth Headphones ANC Pro"',
  },
  description: {
    de: 'Beschreiben Sie das Produkt in 2-3 Sätzen. Was macht es besonders? Für wen ist es geeignet?',
    en: 'Describe the product in 2-3 sentences. What makes it special? Who is it for?',
  },
  bullet_points: {
    de: 'Fügen Sie 2-3 Kernmerkmale hinzu. Beispiele: "Bis zu 30h Akkulaufzeit", "Active Noise Cancelling", "Bluetooth 5.3"',
    en: 'Add 2-3 key features. Examples: "Up to 30h battery life", "Active Noise Cancelling", "Bluetooth 5.3"',
  },
  price: {
    de: 'Aktueller Verkaufspreis in Euro',
    en: 'Current selling price in Euro',
  },
  original_price: {
    de: 'UVP/Streichpreis (optional, für Rabattanzeige)',
    en: 'RRP/strikethrough price (optional, for discount display)',
  },
  tags: {
    de: 'Suchbegriffe, durch Komma getrennt. Beispiel: "kopfhörer, wireless, musik"',
    en: 'Search terms, comma separated. Example: "headphones, wireless, music"',
  },
};

const BULLET_POINT_SUGGESTIONS = {
  de: [
    'Hochwertige Materialien',
    'Einfache Bedienung',
    'Lange Haltbarkeit',
    'Schneller Versand',
    'CE-zertifiziert',
    'Umweltfreundlich',
    '2 Jahre Garantie',
  ],
  en: [
    'Premium materials',
    'Easy to use',
    'Long lasting',
    'Fast shipping',
    'CE certified',
    'Eco-friendly',
    '2 year warranty',
  ],
};

const ProductFormWithHelpers = ({
  initialData,
  categories,
  onSave,
  onCancel,
  isEditing = false,
}: ProductFormWithHelpersProps) => {
  const { language } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    original_price: initialData?.original_price || null,
    discount: initialData?.discount || null,
    image: initialData?.image || '',
    images: initialData?.images || [],
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    tags: initialData?.tags || [],
    in_stock: initialData?.in_stock ?? true,
    bullet_points: initialData?.bullet_points || ['', '', ''],
  });

  const [tagsInput, setTagsInput] = useState((initialData?.tags || []).join(', '));

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage.from('product-images').upload(fileName, file);

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Hochladen' : 'Upload failed');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData({ ...formData, image: url });
    }
    setUploadingMain(false);
    if (mainImageRef.current) mainImageRef.current.value = '';
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingGallery(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) newUrls.push(url);
    }

    setFormData({ ...formData, images: [...formData.images, ...newUrls] });
    setUploadingGallery(false);
    if (galleryImageRef.current) galleryImageRef.current.value = '';
  };

  const updateBulletPoint = (index: number, value: string) => {
    const updated = [...formData.bullet_points];
    updated[index] = value;
    setFormData({ ...formData, bullet_points: updated });
  };

  const addBulletPoint = () => {
    if (formData.bullet_points.length < 5) {
      setFormData({ ...formData, bullet_points: [...formData.bullet_points, ''] });
    }
  };

  const removeBulletPoint = (index: number) => {
    if (formData.bullet_points.length > 1) {
      setFormData({ ...formData, bullet_points: formData.bullet_points.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      toast.error(language === 'de' ? 'Bitte alle Pflichtfelder ausfüllen' : 'Please fill required fields');
      return;
    }

    setSaving(true);
    try {
      const finalData = {
        ...formData,
        tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean),
        bullet_points: formData.bullet_points.filter(bp => bp.trim() !== ''),
      };
      await onSave(finalData);
    } finally {
      setSaving(false);
    }
  };

  const HelperTooltip = ({ field }: { field: keyof typeof FIELD_HELPERS }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-muted-foreground cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{FIELD_HELPERS[field][language as 'de' | 'en']}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name with helper */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="name">{language === 'de' ? 'Produktname *' : 'Product Name *'}</Label>
          <HelperTooltip field="name" />
        </div>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={language === 'de' ? 'z.B. Premium Bluetooth Kopfhörer' : 'e.g. Premium Bluetooth Headphones'}
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground">{formData.name.length}/60</p>
      </div>

      {/* Description with helper */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="description">{language === 'de' ? 'Kurzbeschreibung' : 'Short Description'}</Label>
          <HelperTooltip field="description" />
        </div>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={language === 'de' 
            ? 'Beschreiben Sie Ihr Produkt in 2-3 Sätzen. Was macht es besonders?'
            : 'Describe your product in 2-3 sentences. What makes it special?'}
          rows={3}
        />
      </div>

      {/* Bullet Points with suggestions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label>{language === 'de' ? 'Kernmerkmale (Bullet Points)' : 'Key Features (Bullet Points)'}</Label>
            <HelperTooltip field="bullet_points" />
          </div>
          {formData.bullet_points.length < 5 && (
            <Button type="button" variant="ghost" size="sm" onClick={addBulletPoint}>
              <Plus className="w-4 h-4 mr-1" />
              {language === 'de' ? 'Hinzufügen' : 'Add'}
            </Button>
          )}
        </div>
        
        {formData.bullet_points.map((bp, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex items-center justify-center w-6 h-10 text-muted-foreground text-sm">•</div>
            <Input
              value={bp}
              onChange={(e) => updateBulletPoint(index, e.target.value)}
              placeholder={language === 'de' 
                ? `Merkmal ${index + 1}, z.B. "30h Akkulaufzeit"`
                : `Feature ${index + 1}, e.g. "30h battery life"`}
            />
            {formData.bullet_points.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeBulletPoint(index)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        
        {/* Quick suggestions */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-muted-foreground">
            {language === 'de' ? 'Vorschläge:' : 'Suggestions:'}
          </span>
          {BULLET_POINT_SUGGESTIONS[language as 'de' | 'en'].slice(0, 4).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                const emptyIndex = formData.bullet_points.findIndex(bp => bp === '');
                if (emptyIndex !== -1) {
                  updateBulletPoint(emptyIndex, suggestion);
                }
              }}
              className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="price">{language === 'de' ? 'Preis (€) *' : 'Price (€) *'}</Label>
            <HelperTooltip field="price" />
          </div>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="29.99"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="original_price">{language === 'de' ? 'UVP (€)' : 'RRP (€)'}</Label>
            <HelperTooltip field="original_price" />
          </div>
          <Input
            id="original_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.original_price || ''}
            onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || null })}
            placeholder="39.99"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>{language === 'de' ? 'Kategorie *' : 'Category *'}</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'de' ? 'Kategorie wählen' : 'Select category'} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Image */}
      <div className="space-y-2">
        <Label>{language === 'de' ? 'Hauptbild *' : 'Main Image *'}</Label>
        <div className="flex gap-4 items-start">
          {formData.image ? (
            <div className="relative">
              <img src={formData.image} alt="Main" className="w-24 h-24 object-cover rounded-lg border" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: '' })}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => mainImageRef.current?.click()}
              className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              {uploadingMain ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Upload</span>
                </>
              )}
            </div>
          )}
          <input ref={mainImageRef} type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
          <div className="flex-1">
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder={language === 'de' ? 'Oder Bild-URL eingeben' : 'Or enter image URL'}
            />
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-2">
        <Label>{language === 'de' ? 'Weitere Bilder' : 'Additional Images'}</Label>
        <div className="flex flex-wrap gap-3">
          {formData.images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt={`Gallery ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div
            onClick={() => galleryImageRef.current?.click()}
            className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
          >
            {uploadingGallery ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {language === 'de' ? 'Mehr' : 'More'}
                </span>
              </>
            )}
          </div>
          <input ref={galleryImageRef} type="file" accept="image/*" multiple onChange={handleGalleryImageUpload} className="hidden" />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="tags">Tags</Label>
          <HelperTooltip field="tags" />
        </div>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder={language === 'de' ? 'kopfhörer, wireless, musik' : 'headphones, wireless, music'}
        />
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-3">
        <Switch
          id="in_stock"
          checked={formData.in_stock}
          onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
        />
        <Label htmlFor="in_stock">
          {language === 'de' ? 'Auf Lager verfügbar' : 'In Stock'}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEditing 
            ? (language === 'de' ? 'Speichern' : 'Save')
            : (language === 'de' ? 'Produkt erstellen' : 'Create Product')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {language === 'de' ? 'Abbrechen' : 'Cancel'}
        </Button>
      </div>
    </form>
  );
};

export default ProductFormWithHelpers;
