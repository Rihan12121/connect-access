import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight, Settings2, Plus, Pencil, Trash2, Play, Pause } from 'lucide-react';
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
  const { t, language } = useLanguage();
  const { isAdmin } = useIsAdmin();
  const { banners, isLoading, addBanner, updateBanner, deleteBanner } = useHeroBanners();
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [showDialog, setShowDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<HeroBanner | null>(null);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1 || isEditMode || isPaused) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, isEditMode, isPaused]);

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
            {banners.map((banner, index) => (
              <div 
                key={banner.id}
                className="w-full flex-shrink-0 relative h-[50vh] md:h-[60vh] lg:h-[70vh]"
              >
                <Link to={banner.link} className="block w-full h-full group">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container max-w-6xl mx-auto px-6 md:px-8">
                      <div className="max-w-lg md:max-w-2xl">
                        {/* Animated Badge */}
                        {banner.subtitle && (
                          <div 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 md:mb-6 animate-in"
                            style={{ animationDelay: '0.2s' }}
                          >
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-xs md:text-sm uppercase tracking-widest text-white/90 font-medium">
                              {banner.subtitle}
                            </span>
                          </div>
                        )}
                        
                        {/* Title */}
                        <h2 
                          className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 md:mb-6 animate-in"
                          style={{ animationDelay: '0.3s' }}
                        >
                          {banner.title}
                        </h2>
                        
                        {/* CTA Button */}
                        <div 
                          className="animate-in"
                          style={{ animationDelay: '0.4s' }}
                        >
                          <span className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-primary text-primary-foreground rounded-xl text-sm md:text-base font-semibold uppercase tracking-wider group-hover:gap-4 transition-all duration-300 shadow-lg shadow-primary/30">
                            {language === 'de' ? 'Jetzt entdecken' : 'Shop Now'} 
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
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
              {/* Navigation Arrows */}
              <button 
                onClick={prevBanner}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white transition-all duration-300 border border-white/10"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={nextBanner}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white transition-all duration-300 border border-white/10"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Bottom Controls */}
              <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors border border-white/10"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                
                {/* Progress Dots */}
                <div className="flex gap-2 md:gap-3">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentBanner(idx)}
                      className="relative h-1.5 md:h-2 rounded-full overflow-hidden transition-all duration-300"
                      style={{ width: idx === currentBanner ? '2rem' : '0.5rem' }}
                    >
                      <div className="absolute inset-0 bg-white/30" />
                      {idx === currentBanner && (
                        <div 
                          className="absolute inset-0 bg-white origin-left"
                          style={{
                            animation: isPaused ? 'none' : 'progress 5s linear forwards',
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Counter */}
                <span className="text-white/80 text-sm font-medium tabular-nums">
                  {String(currentBanner + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
                </span>
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
      
      {/* Progress Animation Keyframes */}
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
