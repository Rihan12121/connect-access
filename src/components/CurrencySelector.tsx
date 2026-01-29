import { useState, useEffect } from 'react';
import { Globe, DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF';

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Exchange rate from EUR
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.08 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.85 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: 0.94 },
];

export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('noor_currency');
    return (saved as Currency) || 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('noor_currency', currency);
  }, [currency]);

  const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const formatPrice = (priceInEur: number): string => {
    const convertedPrice = priceInEur * currencyInfo.rate;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currencyInfo.code,
    }).format(convertedPrice);
  };

  const convertFromEur = (priceInEur: number): number => {
    return priceInEur * currencyInfo.rate;
  };

  return {
    currency,
    setCurrency,
    currencyInfo,
    formatPrice,
    convertFromEur,
    currencies: CURRENCIES,
  };
};

interface CurrencySelectorProps {
  compact?: boolean;
}

const CurrencySelector = ({ compact = false }: CurrencySelectorProps) => {
  const { currency, setCurrency, currencyInfo, currencies } = useCurrency();

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <span>{currencyInfo.flag}</span>
            <span className="font-medium">{currency}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currencies.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span>{c.code}</span>
              </span>
              {currency === c.code && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span>{currencyInfo.flag}</span>
          <span>{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span>{c.flag}</span>
              <span>{c.name}</span>
              <span className="text-muted-foreground">({c.symbol})</span>
            </span>
            {currency === c.code && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
