import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';

interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (product: Product) => void;
  loading: boolean;
  favoriteIds: string[];
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('noor-favorites-guest');
    if (saved) {
      try {
        setFavoriteIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load favorites');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('noor-favorites-guest', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const addFavorite = (product: Product) => {
    setFavoriteIds(prev => [...prev, product.id]);
    setFavorites(prev => [...prev, product]);
  };

  const removeFavorite = (id: string) => {
    setFavoriteIds(prev => prev.filter(fid => fid !== id));
    setFavorites(prev => prev.filter(p => p.id !== id));
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, loading, favoriteIds }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
