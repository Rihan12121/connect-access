import { useLanguage } from '@/context/LanguageContext';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VatBreakdownProps {
  price: number;
  vatRate?: number; // Default 19% for Germany
}

const VatBreakdown = ({ price, vatRate = 19 }: VatBreakdownProps) => {
  const { language } = useLanguage();
  
  // German VAT calculation: Price includes VAT
  // Net = Gross / (1 + VAT rate)
  // VAT = Gross - Net
  const netPrice = price / (1 + vatRate / 100);
  const vatAmount = price - netPrice;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-help">
            <span>
              {language === 'de' 
                ? `inkl. ${vatRate}% MwSt.` 
                : `incl. ${vatRate}% VAT`}
            </span>
            <Info className="w-3.5 h-3.5" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-4 max-w-xs">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-sm">
              {language === 'de' ? 'Preisdetails' : 'Price Details'}
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-8">
                <span className="text-muted-foreground">
                  {language === 'de' ? 'Nettobetrag' : 'Net price'}
                </span>
                <span className="font-medium text-foreground">
                  {netPrice.toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-muted-foreground">
                  {language === 'de' ? `MwSt. (${vatRate}%)` : `VAT (${vatRate}%)`}
                </span>
                <span className="font-medium text-foreground">
                  {vatAmount.toFixed(2)} €
                </span>
              </div>
              <div className="border-t pt-1 flex justify-between gap-8">
                <span className="font-semibold text-foreground">
                  {language === 'de' ? 'Gesamtbetrag' : 'Total'}
                </span>
                <span className="font-bold text-foreground">
                  {price.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VatBreakdown;
