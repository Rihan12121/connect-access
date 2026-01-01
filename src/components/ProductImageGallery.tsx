import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextImage = () => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="relative">
      {/* Main Image */}
      <div 
        className="aspect-[4/5] rounded-lg overflow-hidden bg-muted relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img 
          src={images[currentIndex]} 
          alt={`${productName} - Bild ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-card transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-card transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setImageLoaded(false);
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Bild ${idx + 1} anzeigen`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setImageLoaded(false);
                setCurrentIndex(idx);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                idx === currentIndex 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={img} 
                alt={`${productName} Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
