import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bell, BellOff, Trash2, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface WishlistItem {
  id: string;
  product_id: string;
  notify_when_available: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    image: string;
    in_stock: boolean;
    discount: number | null;
  };
}

const Wishlist = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { language } = useLanguage();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          notify_when_available,
          product:products (
            id,
            name,
            price,
            original_price,
            image,
            in_stock,
            discount
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setItems((data as unknown as WishlistItem[]) || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden' : 'Error loading wishlist');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = async (itemId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .update({ notify_when_available: !currentValue })
        .eq('id', itemId);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, notify_when_available: !currentValue }
          : item
      ));
      
      toast.success(
        !currentValue
          ? (language === 'de' ? 'Benachrichtigung aktiviert' : 'Notification enabled')
          : (language === 'de' ? 'Benachrichtigung deaktiviert' : 'Notification disabled')
      );
    } catch (error) {
      console.error('Error toggling notification:', error);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success(language === 'de' ? 'Aus Wunschliste entfernt' : 'Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.product.in_stock) {
      toast.error(language === 'de' ? 'Produkt nicht auf Lager' : 'Product out of stock');
      return;
    }
    
    addItem({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      originalPrice: item.product.original_price || undefined,
      image: item.product.image,
      category: '',
      inStock: item.product.in_stock,
      discount: item.product.discount || undefined,
      description: '',
    });
    toast.success(language === 'de' ? 'Zum Warenkorb hinzugefügt' : 'Added to cart');
  };

  if (!user) {
    return (
      <>
        <SEO title={language === 'de' ? 'Wunschliste' : 'Wishlist'} />
        <Header />
        <main className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {language === 'de' ? 'Bitte anmelden' : 'Please sign in'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === 'de' 
                ? 'Melden Sie sich an, um Ihre Wunschliste zu sehen'
                : 'Sign in to view your wishlist'}
            </p>
            <Link to="/auth">
              <Button>{language === 'de' ? 'Anmelden' : 'Sign In'}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title={language === 'de' ? 'Wunschliste' : 'Wishlist'} />
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === 'de' ? 'Meine Wunschliste' : 'My Wishlist'}
            </h1>
            <Badge variant="secondary">{items.length}</Badge>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {language === 'de' ? 'Ihre Wunschliste ist leer' : 'Your wishlist is empty'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de' 
                    ? 'Fügen Sie Produkte hinzu, die Sie später kaufen möchten'
                    : 'Add products you want to buy later'}
                </p>
                <Link to="/products">
                  <Button>{language === 'de' ? 'Produkte entdecken' : 'Discover Products'}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link to={`/product/${item.product_id}`} className="shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product_id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                            {item.product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-primary">
                            €{item.product.price.toFixed(2)}
                          </span>
                          {item.product.original_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              €{item.product.original_price.toFixed(2)}
                            </span>
                          )}
                          {item.product.discount && (
                            <Badge variant="destructive" className="text-xs">
                              -{item.product.discount}%
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          {item.product.in_stock ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {language === 'de' ? 'Auf Lager' : 'In Stock'}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              {language === 'de' ? 'Nicht verfügbar' : 'Out of Stock'}
                            </Badge>
                          )}
                        </div>

                        {!item.product.in_stock && (
                          <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-lg">
                            <Switch
                              checked={item.notify_when_available}
                              onCheckedChange={() => toggleNotification(item.id, item.notify_when_available)}
                            />
                            <span className="text-sm flex items-center gap-1">
                              {item.notify_when_available ? (
                                <Bell className="h-4 w-4 text-primary" />
                              ) : (
                                <BellOff className="h-4 w-4 text-muted-foreground" />
                              )}
                              {language === 'de' 
                                ? 'Benachrichtigen wenn verfügbar'
                                : 'Notify when available'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.product.in_stock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {language === 'de' ? 'Kaufen' : 'Buy'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {language === 'de' ? 'Entfernen' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Wishlist;
