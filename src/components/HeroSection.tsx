import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight, Settings2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useHeroBanners, HeroBanner } from '@/hooks/useHeroBanners';
import { Button } from '@/components/ui/button';
import HeroBannerDialog from './HeroBannerDialog';
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

const HeroSection = () => {
  const { t } = useLanguage();
  const { isAdmin } = useIsAdmin();
  const { banners, isLoading, addBanner, updateBanner, deleteBanner } = useHeroBanners();
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [showDialog, setShowDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<HeroBanner | null>(null);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1 || isEditMode) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length, isEditMode]);

  // Reset current banner if it exceeds array length
  useEffect(() => {
    if (currentBanner >= banners.length && banners.length > 0) {
      setCurrentBanner(0);
    }
  }, [banners.length, currentBanner]);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  const handleAddBanner = () => {
    setDialogMode('add');
    setEditingBanner(null);
    setShowDialog(true);
  };

  const handleEditBanner = (banner: HeroBanner) => {
    setDialogMode('edit');
    setEditingBanner(banner);
    setShowDialog(true);
  };

  const handleSaveBanner = async (bannerData: Omit<HeroBanner, 'id' | 'position' | 'is_active'>) => {
    if (dialogMode === 'add') {
      await addBanner(bannerData);
    } else if (editingBanner) {
      await updateBanner(editingBanner.id, bannerData);
    }
  };

  const handleDeleteBanner = async () => {
    if (deleteConfirm) {
      await deleteBanner(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-muted animate-pulse" />
      </section>
    );
  }

  if (banners.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {isEditMode && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddBanner}
              className="gap-2 bg-card/90 backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Banner hinzufügen</span>
            </Button>
          )}
          <Button
            variant={isEditMode ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`gap-2 ${!isEditMode && 'bg-card/90 backdrop-blur-sm'}`}
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden md:inline">
              {isEditMode ? 'Fertig' : 'Bearbeiten'}
            </span>
          </Button>
        </div>
      )}

      {banners.length === 0 ? (
        <div 
          className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={handleAddBanner}
        >
          <div className="text-center">
            <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Erstes Banner hinzufügen</p>
          </div>
        </div>
      ) : (
        <>
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner) => (
              <div 
                key={banner.id}
                className="w-full flex-shrink-0 relative h-[50vh] md:h-[60vh] lg:h-[70vh]"
              >
                <Link to={banner.link} className="block w-full h-full">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="container max-w-6xl mx-auto px-6">
                      <div className="max-w-xl">
                        {banner.subtitle && (
                          <p className="section-subheading text-primary-foreground/80 mb-4">
                            {banner.subtitle}
                          </p>
                        )}
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground leading-tight">
                          {banner.title}
                        </h2>
                        <div className="mt-8">
                          <span className="inline-flex items-center gap-3 text-primary-foreground/90 text-sm font-medium tracking-widest uppercase hover:text-primary-foreground transition-colors group">
                            {t('categories.viewAll')} 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Edit/Delete buttons for each banner */}
                {isEditMode && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditBanner(banner);
                      }}
                      className="gap-2 bg-card/90 backdrop-blur-sm"
                    >
                      <Pencil className="w-4 h-4" />
                      Bearbeiten
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteConfirm(banner);
                      }}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Banner Navigation */}
          {banners.length > 1 && (
            <>
              <button 
                onClick={prevBanner}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-card/20 backdrop-blur-sm hover:bg-card/40 rounded-full text-primary-foreground transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextBanner}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-card/20 backdrop-blur-sm hover:bg-card/40 rounded-full text-primary-foreground transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Banner Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentBanner ? 'bg-primary-foreground w-8' : 'bg-primary-foreground/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Add/Edit Dialog */}
      <HeroBannerDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        banner={editingBanner}
        onSave={handleSaveBanner}
        mode={dialogMode}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Banner löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie das Banner "{deleteConfirm?.title}" wirklich löschen? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBanner} className="bg-destructive hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default HeroSection;
