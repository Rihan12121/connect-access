import { useState } from 'react';
import { 
  Baby, 
  Sparkles, 
  Smartphone, 
  Lightbulb, 
  Home, 
  Flower2, 
  Gem, 
  Gamepad2, 
  Shirt, 
  Dumbbell, 
  Heart, 
  Wine,
  ImagePlus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (category: { slug: string; name: string; icon: string; image: string }) => void;
}

const iconOptions = [
  { name: 'Baby', icon: Baby },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Home', icon: Home },
  { name: 'Flower2', icon: Flower2 },
  { name: 'Gem', icon: Gem },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Shirt', icon: Shirt },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Heart', icon: Heart },
  { name: 'Wine', icon: Wine },
];

const AddCategoryDialog = ({ open, onOpenChange, onAdd }: AddCategoryDialogProps) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Home');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[äöüß]/g, (char) => {
        const map: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim()) return;

    setIsSubmitting(true);
    await onAdd({
      slug: generateSlug(name),
      name: name.trim(),
      icon: selectedIcon,
      image: imageUrl.trim(),
    });
    setIsSubmitting(false);
    setName('');
    setSelectedIcon('Home');
    setImageUrl('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Kategorie hinzufügen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Haustiere"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Icon wählen</Label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map(({ name: iconName, icon: IconComponent }) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={`
                    p-3 rounded-xl border-2 transition-all
                    ${selectedIcon === iconName 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5 mx-auto text-foreground" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Bild-URL</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
            {imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

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
              disabled={!name.trim() || !imageUrl.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Wird erstellt...' : 'Hinzufügen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
