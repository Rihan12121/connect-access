import { useCompare } from '@/context/CompareContext';
import { Button } from '@/components/ui/button';
import { X, GitCompare, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CompareFloatingBar = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-2xl shadow-2xl p-4 max-w-[95vw] md:max-w-2xl"
      >
        <div className="flex items-center gap-4">
          {/* Product thumbnails */}
          <div className="flex items-center gap-2">
            {compareItems.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-14 h-14 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center"
              >
                <span className="text-xs text-muted-foreground">+</span>
              </div>
            ))}
          </div>

          <div className="h-12 w-px bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/compare')}
              disabled={compareItems.length < 2}
              className="gap-2"
            >
              <GitCompare className="w-4 h-4" />
              Vergleichen ({compareItems.length})
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearCompare}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFloatingBar;
