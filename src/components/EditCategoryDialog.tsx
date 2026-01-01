import { useState, useEffect } from 'react';
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
  Pencil
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
import ImageUploadField from './ImageUploadField';
import { DatabaseCategory } from '@/hooks/useCategoryOrder';

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: DatabaseCategory | null;
  onSave: (id: string, updates: Partial<DatabaseCategory>) => void;
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

const EditCategoryDialog = ({ open, onOpenChange, category, onSave }: EditCategoryDialogProps) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Home');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedIcon(category.icon);
      setImageUrl(category.image);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !name.trim() || !imageUrl.trim()) return;

    setIsSubmitting(true);
    await onSave(category.id, {
      name: name.trim(),
      icon: selectedIcon,
      image: imageUrl.trim(),
    });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Kategorie bearbeiten
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
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

          <ImageUploadField
            value={imageUrl}
            onChange={setImageUrl}
            label="Kategorie-Bild"
            folder="categories"
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
              disabled={!name.trim() || !imageUrl.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
