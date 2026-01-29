import { useState } from 'react';
import { Zap, Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OneClickCheckoutProps {
  productId: string;
  productName: string;
  price: number;
  sellerId?: string;
  productImage: string;
  disabled?: boolean;
}

const OneClickCheckout = ({
  productId,
  productName,
  price,
  sellerId,
  productImage,
  disabled = false,
}: OneClickCheckoutProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleOneClickBuy = async () => {
    if (!user) {
      toast.error(language === 'de' ? 'Bitte anmelden' : 'Please sign in');
      return;
    }

    setLoading(true);
    try {
      // Check for saved address
      const { data: profile } = await supabase
        .from('profiles')
        .select('street_address, city, postal_code, country, display_name')
        .eq('user_id', user.id)
        .single();

      if (!profile?.street_address || !profile?.city || !profile?.postal_code) {
        toast.error(
          language === 'de'
            ? 'Bitte fügen Sie zuerst eine Lieferadresse hinzu'
            : 'Please add a shipping address first'
        );
        setLoading(false);
        return;
      }

      // Create order directly
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: price,
          status: 'pending',
          payment_status: 'pending',
          shipping_address: {
            firstName: profile.display_name?.split(' ')[0] || '',
            lastName: profile.display_name?.split(' ').slice(1).join(' ') || '',
            address: profile.street_address,
            city: profile.city,
            postalCode: profile.postal_code,
            country: profile.country || 'Deutschland',
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order item
      const { error: itemError } = await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: productId,
        product_name: productName,
        product_image: productImage,
        price: price,
        quantity: 1,
        seller_id: sellerId,
      });

      if (itemError) throw itemError;

      // Create checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: {
            orderId: order.id,
            items: [
              {
                name: productName,
                price: price,
                quantity: 1,
              },
            ],
          },
        }
      );

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }
    } catch (error) {
      console.error('One-click checkout error:', error);
      toast.error(language === 'de' ? 'Fehler beim Checkout' : 'Checkout error');
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleOneClickBuy}
      disabled={disabled || loading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Zap className="w-4 h-4" />
      )}
      {language === 'de' ? 'Jetzt kaufen' : 'Buy Now'}
    </Button>
  );
};

export default OneClickCheckout;
