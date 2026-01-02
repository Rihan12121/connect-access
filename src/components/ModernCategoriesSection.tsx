import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Settings2, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCategoryOrder, DatabaseCategory } from '@/hooks/useCategoryOrder';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import ModernCategoryCard from './ModernCategoryCard';
import AddCategoryDialog from './AddCategoryDialog';
import EditCategoryDialog from './EditCategoryDialog';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

const ModernCategoriesSection = () => {
  const { t } = useLanguage();
  const { categories, reorderCategories, addCategory, deleteCategory, updateCategory, isLoading } = useCategoryOrder();
  const { isAdmin } = useIsAdmin();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DatabaseCategory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Touch handling for mobile
  const touchStartRef = useRef<{ index: number; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Touch handlers for mobile drag
  const handleTouchStart = useCallback((index: number, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { index, x: touch.clientX, y: touch.clientY };
    setDraggedIndex(index);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !containerRef.current) return;
    
    const touch = e.touches[0];
    const container = containerRef.current;
    const cards = container.querySelectorAll('[data-category-card]');
    
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        if (index !== touchStartRef.current?.index) {
          setDragOverIndex(index);
        }
      }
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartRef.current !== null && dragOverIndex !== null) {
      const fromIndex = touchStartRef.current.index;
      if (fromIndex !== dragOverIndex) {
        reorderCategories(fromIndex, dragOverIndex);
      }
    }
    touchStartRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [dragOverIndex, reorderCategories]);

  const handleAddCategory = async (category: { slug: string; name: string; icon: string; image: string }) => {
    await addCategory(category);
  };

  const handleEditCategory = (category: DatabaseCategory) => {
    setEditingCategory(category);
    setShowEditDialog(true);
  };

  const handleSaveCategory = async (id: string, updates: Partial<DatabaseCategory>) => {
    await updateCategory(id, updates);
  };

  const handleDeleteCategory = async () => {
    if (deleteConfirm) {
      await deleteCategory(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <section className="container max-w-6xl mx-auto mt-12 px-6">
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6 px-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[160px] h-[200px] flex-shrink-0 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container max-w-6xl mx-auto mt-16 px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Kategorien</h2>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {isAdmin && (
            <>
              {isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Hinzufügen</span>
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
                  {isEditMode ? 'Fertig' : 'Bearbeiten'}
                </span>
              </Button>
            </>
          )}
          <Link 
            to="/categories" 
            className="premium-link hidden md:flex items-center gap-2 group"
          >
            {t('categories.viewAll')} 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {isEditMode && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
          Kategorien per Drag & Drop verschieben • ✏️ Bearbeiten • 🗑️ Löschen
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex gap-5 overflow-x-auto no-scrollbar pb-6 px-1"
      >
        {categories.map((category, index) => (
          <div key={category.id} data-category-card>
            <ModernCategoryCard
              category={category}
              index={index}
              isAdmin={isEditMode}
              isDragging={draggedIndex === index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => setDeleteConfirm({ id: category.id, name: category.name })}
            />
          </div>
        ))}
      </div>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddCategory}
      />

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategorie löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie die Kategorie "{deleteConfirm?.name}" wirklich löschen? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ModernCategoriesSection;
