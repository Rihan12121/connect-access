import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Package, AlertTriangle, Search, Loader2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  in_stock: boolean;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  category: string;
}

const AdminInventory = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editedQuantities, setEditedQuantities] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image, price, in_stock, stock_quantity, low_stock_threshold, category')
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const updateStock = async (productId: string) => {
    const newQuantity = editedQuantities[productId];
    if (newQuantity === undefined) return;

    setSaving(productId);

    const { error } = await supabase
      .from('products')
      .update({ 
        stock_quantity: newQuantity,
        in_stock: newQuantity > 0
      })
      .eq('id', productId);

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    } else {
      toast.success(language === 'de' ? 'Lagerbestand aktualisiert!' : 'Stock updated!');
      fetchProducts();
      setEditedQuantities(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }

    setSaving(null);
  };

  const adjustQuantity = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    const currentQty = editedQuantities[productId] ?? (product?.stock_quantity || 0);
    const newQty = Math.max(0, currentQty + delta);
    setEditedQuantities(prev => ({ ...prev, [productId]: newQty }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const qty = editedQuantities[product.id] ?? (product.stock_quantity || 0);
    const threshold = product.low_stock_threshold || 10;
    
    if (filter === 'low') return matchesSearch && qty > 0 && qty <= threshold;
    if (filter === 'out') return matchesSearch && qty === 0;
    return matchesSearch;
  });

  const lowStockCount = products.filter(p => {
    const qty = p.stock_quantity || 0;
    const threshold = p.low_stock_threshold || 10;
    return qty > 0 && qty <= threshold;
  }).length;

  const outOfStockCount = products.filter(p => (p.stock_quantity || 0) === 0).length;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Lagerverwaltung — Admin" />
      <Header />

      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'de' ? 'Lagerverwaltung' : 'Inventory Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'de' 
              ? 'Verwalten Sie Ihren Lagerbestand'
              : 'Manage your stock levels'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              filter === 'all' ? 'border-primary bg-primary/5' : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <Package className="w-6 h-6 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{products.length}</p>
            <p className="text-sm text-muted-foreground">
              {language === 'de' ? 'Alle Produkte' : 'All Products'}
            </p>
          </button>
          
          <button
            onClick={() => setFilter('low')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              filter === 'low' ? 'border-[hsl(var(--deal))] bg-[hsl(var(--deal))]/5' : 'bg-card border-border hover:border-[hsl(var(--deal))]/50'
            }`}
          >
            <AlertTriangle className="w-6 h-6 text-[hsl(var(--deal))] mb-2" />
            <p className="text-2xl font-bold text-foreground">{lowStockCount}</p>
            <p className="text-sm text-muted-foreground">
              {language === 'de' ? 'Niedriger Bestand' : 'Low Stock'}
            </p>
          </button>
          
          <button
            onClick={() => setFilter('out')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              filter === 'out' ? 'border-destructive bg-destructive/5' : 'bg-card border-border hover:border-destructive/50'
            }`}
          >
            <Package className="w-6 h-6 text-destructive mb-2" />
            <p className="text-2xl font-bold text-foreground">{outOfStockCount}</p>
            <p className="text-sm text-muted-foreground">
              {language === 'de' ? 'Ausverkauft' : 'Out of Stock'}
            </p>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'de' ? 'Produkte suchen...' : 'Search products...'}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {language === 'de' ? 'Keine Produkte gefunden' : 'No products found'}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">{language === 'de' ? 'Bild' : 'Image'}</TableHead>
                  <TableHead>{language === 'de' ? 'Produkt' : 'Product'}</TableHead>
                  <TableHead>{language === 'de' ? 'Kategorie' : 'Category'}</TableHead>
                  <TableHead>{language === 'de' ? 'Preis' : 'Price'}</TableHead>
                  <TableHead className="w-[200px]">{language === 'de' ? 'Bestand' : 'Stock'}</TableHead>
                  <TableHead className="w-[100px]">{language === 'de' ? 'Status' : 'Status'}</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const currentQty = editedQuantities[product.id] ?? (product.stock_quantity || 0);
                  const threshold = product.low_stock_threshold || 10;
                  const isLow = currentQty > 0 && currentQty <= threshold;
                  const isOut = currentQty === 0;
                  const hasChanges = editedQuantities[product.id] !== undefined;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground line-clamp-1">
                          {product.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{product.category}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{product.price.toFixed(2)} €</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustQuantity(product.id, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 rounded transition-colors"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <Input
                            type="number"
                            min={0}
                            value={currentQty}
                            onChange={(e) => setEditedQuantities(prev => ({
                              ...prev,
                              [product.id]: parseInt(e.target.value) || 0
                            }))}
                            className="w-20 text-center h-8"
                          />
                          <button
                            onClick={() => adjustQuantity(product.id, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 rounded transition-colors"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-full">
                            {language === 'de' ? 'Ausverkauft' : 'Out'}
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(var(--deal))]/10 text-[hsl(var(--deal))] text-xs font-medium rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            {language === 'de' ? 'Niedrig' : 'Low'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                            {language === 'de' ? 'OK' : 'OK'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasChanges && (
                          <Button
                            size="sm"
                            onClick={() => updateStock(product.id)}
                            disabled={saving === product.id}
                          >
                            {saving === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminInventory;
