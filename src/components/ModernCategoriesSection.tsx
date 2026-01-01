import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RotateCcw, Settings2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCategoryOrder } from '@/hooks/useCategoryOrder';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import ModernCategoryCard from './ModernCategoryCard';
import { Button } from './ui/button';

const ModernCategoriesSection = () => {
  const { t } = useLanguage();
  const { categories, reorderCategories, resetOrder } = useCategoryOrder();
  const { isAdmin } = useIsAdmin();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      reorderCategories(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <section className="container max-w-6xl mx-auto mt-12 px-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="section-subheading mb-2">{t('categories.browse')}</p>
          <h2 className="section-heading">Kategorien</h2>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              {isEditMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetOrder}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden md:inline">Zurücksetzen</span>
                </Button>
              )}
              <Button
                variant={isEditMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
                className="gap-2"
              >
                <Settings2 className="w-4 h-4" />
                <span className="hidden md:inline">
                  {isEditMode ? 'Fertig' : 'Anordnen'}
                </span>
              </Button>
            </>
          )}
          <Link 
            to="/categories" 
            className="premium-link hidden md:flex items-center gap-2 hover-underline"
          >
            {t('categories.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {isEditMode && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
          Kategorien per Drag & Drop verschieben
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {categories.map((category, index) => (
          <ModernCategoryCard
            key={category.slug}
            category={category}
            index={index}
            isAdmin={isEditMode}
            isDragging={draggedIndex === index}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </section>
  );
};

export default ModernCategoriesSection;
