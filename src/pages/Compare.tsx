import { useCompare } from '@/context/CompareContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ShoppingCart, ArrowLeft, Check, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleAddToCart = (item: typeof compareItems[0]) => {
    // Convert compare item to Product format expected by cart
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      in_stock: item.in_stock,
      description: item.description || null,
      original_price: item.original_price || null,
      discount: item.discount || null,
      images: [],
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller_id: null,
      stock_quantity: 100,
      low_stock_threshold: 10,
      subcategory: null,
    };
    addItem(product as any);
    toast.success(`${item.name} zum Warenkorb hinzugefügt`);
  };

  if (compareItems.length === 0) {
    return (
      <>
        <SEO title="Produktvergleich" description="Vergleiche Produkte nebeneinander" />
        <Header />
        <main className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Produktvergleich</h1>
            <p className="text-muted-foreground mb-8">
              Du hast noch keine Produkte zum Vergleich hinzugefügt.
            </p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Produkte entdecken
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const comparisonRows = [
    { label: 'Preis', key: 'price', render: (item: typeof compareItems[0]) => (
      <div>
        <span className="text-xl font-bold text-primary">{item.price.toFixed(2)} €</span>
        {item.original_price && (
          <span className="text-sm text-muted-foreground line-through ml-2">
            {item.original_price.toFixed(2)} €
          </span>
        )}
      </div>
    )},
    { label: 'Rabatt', key: 'discount', render: (item: typeof compareItems[0]) => (
      item.discount ? (
        <Badge variant="destructive">-{item.discount}%</Badge>
      ) : (
        <Minus className="w-4 h-4 text-muted-foreground" />
      )
    )},
    { label: 'Kategorie', key: 'category', render: (item: typeof compareItems[0]) => (
      <Badge variant="secondary">{item.category}</Badge>
    )},
    { label: 'Verfügbarkeit', key: 'in_stock', render: (item: typeof compareItems[0]) => (
      item.in_stock ? (
        <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
          <Check className="w-4 h-4" /> Auf Lager
        </span>
      ) : (
        <span className="text-destructive">Nicht verfügbar</span>
      )
    )},
    { label: 'Beschreibung', key: 'description', render: (item: typeof compareItems[0]) => (
      <p className="text-sm text-muted-foreground line-clamp-3">
        {item.description || 'Keine Beschreibung verfügbar'}
      </p>
    )},
  ];

  return (
    <>
      <SEO title="Produktvergleich" description="Vergleiche bis zu 4 Produkte nebeneinander" />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <h1 className="text-3xl font-bold">Produktvergleich</h1>
              <p className="text-muted-foreground">{compareItems.length} Produkte werden verglichen</p>
            </div>
            <Button variant="outline" onClick={clearCompare}>
              Alle entfernen
            </Button>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Product Images & Names */}
              <thead>
                <tr>
                  <th className="p-4 text-left bg-muted/50 rounded-tl-lg min-w-[150px]">
                    Produkt
                  </th>
                  {compareItems.map((item) => (
                    <th key={item.id} className="p-4 bg-muted/50 min-w-[200px]">
                      <Card className="relative p-4">
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => navigate(`/product/${item.id}`)}
                        />
                        <h3 
                          className="font-semibold text-center line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                      </Card>
                    </th>
                  ))}
                  {/* Empty slots */}
                  {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-4 bg-muted/50 min-w-[200px]">
                      <Card className="p-4 h-[240px] flex items-center justify-center border-dashed">
                        <Button 
                          variant="ghost" 
                          onClick={() => navigate('/products')}
                          className="text-muted-foreground"
                        >
                          + Produkt hinzufügen
                        </Button>
                      </Card>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Comparison Rows */}
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={row.key} className={idx % 2 === 0 ? 'bg-muted/20' : ''}>
                    <td className="p-4 font-medium text-muted-foreground">
                      {row.label}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="p-4 text-center">
                        {row.render(item)}
                      </td>
                    ))}
                    {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                      <td key={`empty-${i}`} className="p-4" />
                    ))}
                  </tr>
                ))}

                {/* Add to Cart Row */}
                <tr className="bg-muted/30">
                  <td className="p-4 font-medium text-muted-foreground">
                    Aktion
                  </td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4 text-center">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.in_stock}
                        className="w-full"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        In den Warenkorb
                      </Button>
                    </td>
                  ))}
                  {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="p-4" />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Compare;
