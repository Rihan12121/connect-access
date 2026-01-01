import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUploadField from './ImageUploadField';
import { HeroBanner } from '@/hooks/useHeroBanners';

interface HeroBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: HeroBanner | null;
  onSave: (banner: Omit<HeroBanner, 'id' | 'position' | 'is_active'>) => void;
  mode: 'add' | 'edit';
}

const HeroBannerDialog = ({ open, onOpenChange, banner, onSave, mode }: HeroBannerDialogProps) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('/products');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (banner && mode === 'edit') {
      setTitle(banner.title);
      setSubtitle(banner.subtitle || '');
      setImageUrl(banner.image);
      setLink(banner.link);
    } else if (mode === 'add') {
      setTitle('');
      setSubtitle('');
      setImageUrl('');
      setLink('/products');
    }
  }, [banner, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    setIsSubmitting(true);
    await onSave({
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      image: imageUrl.trim(),
      link: link.trim() || '/products',
    });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Neues Banner hinzufügen' : 'Banner bearbeiten'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner-title">Titel</Label>
            <Input
              id="banner-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Elegante Schönheit"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-subtitle">Untertitel (optional)</Label>
            <Input
              id="banner-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="z.B. Neue Kollektion"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-link">Link</Label>
            <Input
              id="banner-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/products oder /category/beauty"
            />
          </div>

          <ImageUploadField
            value={imageUrl}
            onChange={setImageUrl}
            label="Banner-Bild"
            folder="banners"
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !imageUrl.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Wird gespeichert...' : mode === 'add' ? 'Hinzufügen' : 'Speichern'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HeroBannerDialog;
