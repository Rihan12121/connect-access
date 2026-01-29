import { useEffect, useState } from 'react';
import { Package, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  discount?: number;
  image: string;
  category: string;
  in_stock: boolean;
}

interface CrossSellSectionProps {
  currentProductId: string;
  currentCategory: string;
  currentTags?: string[];
}

const CrossSellSection = ({ currentProductId, currentCategory, currentTags = [] }: CrossSellSectionProps) => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrossSellProducts = async () => {
      setLoading(true);
      
      // Get products from same category, prioritize matching tags
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, original_price, discount, image, category, in_stock, tags')
        .eq('category', currentCategory)
        .eq('in_stock', true)
        .neq('id', currentProductId)
        .limit(8);

      if (error) {
        console.error('Error fetching cross-sell products:', error);
        setLoading(false);
        return;
      }

      // Sort by tag overlap
      const sorted = (data || []).sort((a, b) => {
        const aTagOverlap = (a.tags || []).filter((t: string) => currentTags.includes(t)).length;
        const bTagOverlap = (b.tags || []).filter((t: string) => currentTags.includes(t)).length;
        return bTagOverlap - aTagOverlap;
      });

      setProducts(sorted.slice(0, 4).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        original_price: p.original_price,
        discount: p.discount,
        image: p.image,
        category: p.category,
        in_stock: p.in_stock,
      })));
      setLoading(false);
    };

    fetchCrossSellProducts();
  }, [currentProductId, currentCategory, currentTags]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">
          {language === 'de' ? 'Kunden kauften auch' : 'Customers also bought'}
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.original_price || undefined,
              discount: product.discount || undefined,
              image: product.image,
              category: product.category,
              inStock: product.in_stock,
              description: '',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CrossSellSection;
