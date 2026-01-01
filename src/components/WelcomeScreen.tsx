import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { X } from 'lucide-react';

const CookieBanner = ({ onAccept }: { onAccept: () => void }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            {t('welcome.policyText')}{' '}
            <Link to="/privacy" className="text-primary hover:underline">{t('footer.privacy')}</Link>
            {' • '}
            <Link to="/terms" className="text-primary hover:underline">{t('footer.terms')}</Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onAccept}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t('welcome.accept')}
          </button>
          <button 
            onClick={onAccept}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
