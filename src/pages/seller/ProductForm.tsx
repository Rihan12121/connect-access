import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  category: string;
  image: string;
  images: string[];
  in_stock: boolean;
  tags: string[];
}

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    image: "",
    images: [],
    in_stock: true,
    tags: []
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("slug, name")
      .eq("is_active", true)
      .order("position");
    
    setCategories(data || []);
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("seller_id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          original_price: data.original_price?.toString() || "",
          category: data.category,
          image: data.image,
          images: data.images || [],
          in_stock: data.in_stock,
          tags: data.tags || []
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error(language === 'de' ? "Produkt nicht gefunden" : "Product not found");
      navigate("/seller");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      if (!formData.image) {
        setFormData(prev => ({ ...prev, image: publicUrl }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
      }

      toast.success(language === 'de' ? "Bild hochgeladen" : "Image uploaded");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(language === 'de' ? "Fehler beim Hochladen" : "Upload error");
    }
  };

  const removeImage = (index: number) => {
    if (index === -1) {
      // Remove main image, promote first additional image if exists
      if (formData.images.length > 0) {
        setFormData(prev => ({
          ...prev,
          image: prev.images[0],
          images: prev.images.slice(1)
        }));
      } else {
        setFormData(prev => ({ ...prev, image: "" }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error(language === 'de' 
        ? "Bitte füllen Sie alle Pflichtfelder aus" 
        : "Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount: formData.original_price 
          ? Math.round((1 - parseFloat(formData.price) / parseFloat(formData.original_price)) * 100)
          : null,
        category: formData.category,
        image: formData.image,
        images: formData.images,
        in_stock: formData.in_stock,
        tags: formData.tags,
        seller_id: user?.id
      };

      if (isEditing) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id)
          .eq("seller_id", user?.id);

        if (error) throw error;
        toast.success(language === 'de' ? "Produkt aktualisiert" : "Product updated");
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) throw error;
        toast.success(language === 'de' ? "Produkt erstellt" : "Product created");
      }

      navigate("/seller");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(language === 'de' ? "Fehler beim Speichern" : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title={isEditing 
          ? (language === 'de' ? "Produkt bearbeiten" : "Edit Product")
          : (language === 'de' ? "Neues Produkt" : "New Product")}
      />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/seller" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {language === 'de' ? "Zurück zum Dashboard" : "Back to Dashboard"}
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing 
                ? (language === 'de' ? "Produkt bearbeiten" : "Edit Product")
                : (language === 'de' ? "Neues Produkt erstellen" : "Create New Product")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{language === 'de' ? "Produktname *" : "Product Name *"}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={language === 'de' ? "z.B. Premium Kopfhörer" : "e.g. Premium Headphones"}
                  />
                </div>

                <div>
                  <Label htmlFor="description">{language === 'de' ? "Beschreibung" : "Description"}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={language === 'de' ? "Detaillierte Produktbeschreibung..." : "Detailed product description..."}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">{language === 'de' ? "Preis (€) *" : "Price (€) *"}</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="original_price">{language === 'de' ? "UVP (€)" : "Original Price (€)"}</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.original_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                      placeholder="39.99"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">{language === 'de' ? "Kategorie *" : "Category *"}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'de' ? "Kategorie wählen" : "Select category"} />
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
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label>{language === 'de' ? "Produktbilder *" : "Product Images *"}</Label>
                
                <div className="flex flex-wrap gap-4">
                  {formData.image && (
                    <div className="relative w-24 h-24">
                      <img 
                        src={formData.image} 
                        alt="Main" 
                        className="w-full h-full object-cover rounded-lg border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(-1)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1 rounded">
                        {language === 'de' ? "Haupt" : "Main"}
                      </span>
                    </div>
                  )}
                  
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img 
                        src={img} 
                        alt={`Additional ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  <label className="w-24 h-24 border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">
                      {language === 'de' ? "Hochladen" : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>{language === 'de' ? "Tags" : "Tags"}</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder={language === 'de' ? "Tag hinzufügen..." : "Add tag..."}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    {language === 'de' ? "Hinzufügen" : "Add"}
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <Switch
                  id="in_stock"
                  checked={formData.in_stock}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, in_stock: checked }))}
                />
                <Label htmlFor="in_stock">
                  {language === 'de' ? "Auf Lager verfügbar" : "In Stock"}
                </Label>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {isEditing 
                    ? (language === 'de' ? "Änderungen speichern" : "Save Changes")
                    : (language === 'de' ? "Produkt erstellen" : "Create Product")}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/seller")}>
                  {language === 'de' ? "Abbrechen" : "Cancel"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProductForm;
