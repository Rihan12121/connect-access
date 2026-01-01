import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = (bucket: string = 'product-images') => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadImage = async (file: File, folder: string = ''): Promise<string | null> => {
    setIsUploading(true);
    setProgress(0);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Bitte wählen Sie eine Bilddatei aus.');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Das Bild darf maximal 5MB groß sein.');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      setProgress(30);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      setProgress(80);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setProgress(100);

      toast({
        title: 'Hochgeladen',
        description: 'Bild wurde erfolgreich hochgeladen.',
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Fehler beim Hochladen',
        description: error.message || 'Bild konnte nicht hochgeladen werden.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadImage,
    isUploading,
    progress,
  };
};
