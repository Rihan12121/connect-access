import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => (
  <div className="product-card p-4">
    <Skeleton className="w-full aspect-square rounded-xl mb-4" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-3" />
    <Skeleton className="h-6 w-1/3" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <Skeleton className="h-16 w-full" />
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <ProductGridSkeleton />
    </div>
  </div>
);

export default ProductGridSkeleton;
