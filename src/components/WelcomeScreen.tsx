import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const WelcomeScreen = ({ onAccept }: { onAccept: () => void }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t('welcome.title')}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {t('welcome.subtitle')}
        </p>
        
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-foreground mb-3">{t('welcome.policyTitle')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('welcome.policyText')}
          </p>
          <div className="flex gap-2 text-sm">
            <Link to="/privacy" className="text-primary hover:underline">{t('footer.privacy')}</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/terms" className="text-primary hover:underline">{t('footer.terms')}</Link>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onAccept}
            className="btn-primary w-full py-3 text-lg font-medium"
          >
            {t('welcome.accept')}
          </button>
          <p className="text-xs text-muted-foreground">
            {t('welcome.declineNote')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
