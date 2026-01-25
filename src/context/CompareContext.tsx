import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface CompareProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image: string;
  category: string;
  description?: string | null;
  in_stock: boolean;
  discount?: number | null;
}

interface CompareContextType {
  compareItems: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4;

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<CompareProduct[]>([]);

  const canAddMore = compareItems.length < MAX_COMPARE_ITEMS;

  const addToCompare = useCallback((product: CompareProduct) => {
    setCompareItems((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        toast.info('Produkt bereits im Vergleich');
        return prev;
      }
      if (prev.length >= MAX_COMPARE_ITEMS) {
        toast.error(`Maximal ${MAX_COMPARE_ITEMS} Produkte vergleichbar`);
        return prev;
      }
      toast.success('Zum Vergleich hinzugefügt');
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
    toast.info('Aus Vergleich entfernt');
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  const isInCompare = useCallback(
    (productId: string) => compareItems.some((p) => p.id === productId),
    [compareItems]
  );

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
