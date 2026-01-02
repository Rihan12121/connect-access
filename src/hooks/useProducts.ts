import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  image: string;
  images?: string[] | null;
  category: string;
  subcategory?: string | null;
  tags?: string[] | null;
  inStock: boolean;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'discount' | 'name-asc' | 'name-desc';

export interface UseProductsOptions {
  category?: string;
  subcategory?: string;
  search?: string;
  sortBy?: SortOption;
  onlyDeals?: boolean;
  onlyInStock?: boolean;
  limit?: number;
  page?: number;
  pageSize?: number;
}

// Transform database product to frontend format
const transformProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  price: Number(dbProduct.price),
  originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
  discount: dbProduct.discount,
  image: dbProduct.image,
  images: dbProduct.images,
  category: dbProduct.category,
  subcategory: dbProduct.subcategory,
  tags: dbProduct.tags,
  inStock: dbProduct.in_stock ?? true,
});

// Fetch all products from Supabase
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data || []).map(transformProduct);
};

// Main hook for fetching and managing products
export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    category,
    subcategory,
    search,
    sortBy = 'default',
    onlyDeals = false,
    onlyInStock = false,
    limit,
    page = 1,
    pageSize = 12,
  } = options;

  // Fetch all products with React Query
  const { data: allProducts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by category
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Filter by subcategory
    if (subcategory) {
      result = result.filter(p => p.subcategory === subcategory);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter only deals
    if (onlyDeals) {
      result = result.filter(p => p.discount && p.discount > 0);
    }

    // Filter only in stock
    if (onlyInStock) {
      result = result.filter(p => p.inStock);
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order (newest first)
        break;
    }

    return result;
  }, [allProducts, category, subcategory, search, sortBy, onlyDeals, onlyInStock]);

  // Apply limit or pagination
  const paginatedProducts = useMemo(() => {
    if (limit) {
      return filteredProducts.slice(0, limit);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, limit, page, pageSize]);

  // Calculate pagination info
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    // Products
    products: paginatedProducts,
    allProducts: filteredProducts,
    
    // Loading state
    isLoading,
    error,
    
    // Pagination
    totalProducts,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPrevPage,
    
    // Actions
    refetch,
  };
};

// Hook to get a single product by ID
export const useProduct = (productId: string | undefined) => {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      return data ? transformProduct(data) : null;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });

  return { product, isLoading, error };
};

// Hook to get deal products
export const useDealProducts = (limit?: number) => {
  return useProducts({ onlyDeals: true, limit });
};

// Hook to get products by category
export const useCategoryProducts = (category: string, options?: Omit<UseProductsOptions, 'category'>) => {
  return useProducts({ ...options, category });
};
