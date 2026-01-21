import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Tag, Loader2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
}

interface DiscountCodeInputProps {
  cartTotal: number;
  onApplyDiscount: (discount: { code: string; type: string; value: number; calculatedAmount: number }) => void;
  onRemoveDiscount: () => void;
  appliedDiscount?: { code: string; type: string; value: number; calculatedAmount: number } | null;
}

const DiscountCodeInput = ({ 
  cartTotal, 
  onApplyDiscount, 
  onRemoveDiscount, 
  appliedDiscount 
}: DiscountCodeInputProps) => {
  const { language } = useLanguage();
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndApply = async () => {
    if (!code.trim()) {
      setError(language === 'de' ? 'Bitte Code eingeben' : 'Please enter a code');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .eq('is_active', true)
        .single();

      if (queryError || !data) {
        setError(language === 'de' ? 'Ungültiger Code' : 'Invalid code');
        setIsValidating(false);
        return;
      }

      const discountCode = data as DiscountCode;

      // Check validity period
      const now = new Date();
      if (discountCode.min_order_amount && cartTotal < discountCode.min_order_amount) {
        setError(
          language === 'de' 
            ? `Mindestbestellwert: ${discountCode.min_order_amount.toFixed(2)} €` 
            : `Minimum order: €${discountCode.min_order_amount.toFixed(2)}`
        );
        setIsValidating(false);
        return;
      }

      // Calculate discount amount
      let calculatedAmount: number;
      if (discountCode.discount_type === 'percentage') {
        calculatedAmount = (cartTotal * discountCode.discount_value) / 100;
      } else {
        calculatedAmount = Math.min(discountCode.discount_value, cartTotal);
      }

      onApplyDiscount({
        code: discountCode.code,
        type: discountCode.discount_type,
        value: discountCode.discount_value,
        calculatedAmount,
      });

      toast.success(
        language === 'de' 
          ? `Rabattcode "${discountCode.code}" angewendet!` 
          : `Discount code "${discountCode.code}" applied!`
      );
      setCode('');
    } catch (err) {
      console.error('Error validating discount code:', err);
      setError(language === 'de' ? 'Fehler bei der Validierung' : 'Validation error');
    }

    setIsValidating(false);
  };

  if (appliedDiscount) {
    return (
      <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-success" />
          <span className="font-medium text-success">{appliedDiscount.code}</span>
          <span className="text-sm text-muted-foreground">
            ({appliedDiscount.type === 'percentage' 
              ? `-${appliedDiscount.value}%` 
              : `-${appliedDiscount.value.toFixed(2)} €`})
          </span>
        </div>
        <button
          onClick={onRemoveDiscount}
          className="p-1 hover:bg-destructive/10 rounded transition-colors"
        >
          <X className="w-4 h-4 text-destructive" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder={language === 'de' ? 'Rabattcode' : 'Discount code'}
            className="pl-10 h-11"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={validateAndApply}
          disabled={isValidating || !code.trim()}
          className="h-11"
        >
          {isValidating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            language === 'de' ? 'Anwenden' : 'Apply'
          )}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default DiscountCodeInput;
