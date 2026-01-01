import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-header text-header-foreground mt-20">
      <div className="container max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="font-display text-3xl font-semibold">Noor</p>
            <p className="text-header-foreground/60 text-sm mt-4 leading-relaxed max-w-xs">
              {t('footer.description')} {t('footer.quality')}
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="p-2.5 bg-header-foreground/5 border border-header-foreground/10 rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-header-foreground/5 border border-header-foreground/10 rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-header-foreground/5 border border-header-foreground/10 rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Help & About */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-header-foreground/50 mb-6">{t('footer.help')}</h4>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.aboutUs')}
              </Link>
              <Link to="/faq" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.faq')}
              </Link>
              <Link to="/shipping" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.shipping')}
              </Link>
              <Link to="/returns" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.returns')}
              </Link>
              <Link to="/contact" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.contact')}
              </Link>
            </div>
          </div>
          
          {/* Legal */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-header-foreground/50 mb-6">{t('footer.legal')}</h4>
            <div className="flex flex-col gap-3">
              <Link to="/imprint" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.imprint')}
              </Link>
              <Link to="/privacy" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {t('footer.terms')}
              </Link>
              <button 
                onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit text-left"
              >
                {t('footer.legal') === 'Rechtliches' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-header-foreground/10 mt-14 pt-8">
          <div className="flex justify-center items-center">
            <p className="text-xs text-header-foreground/40 tracking-wider">
              © 2025 Noor. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
