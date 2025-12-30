import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { t, tCategory } = useLanguage();

  return (
    <footer className="bg-header text-header-foreground mt-12">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl font-bold">Noor</p>
            <p className="text-header-foreground/70 text-sm mt-2">
              {t('footer.description')} {t('footer.quality')}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-header-foreground/10 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-header-foreground/10 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-header-foreground/10 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          
          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.help')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/faq" className="text-header-foreground/70 hover:text-primary text-sm transition-colors">
                {t('footer.faq')}
              </Link>
              <Link to="/shipping" className="text-header-foreground/70 hover:text-primary text-sm transition-colors">
                {t('footer.shipping')}
              </Link>
              <Link to="/returns" className="text-header-foreground/70 hover:text-primary text-sm transition-colors">
                {t('footer.returns')}
              </Link>
              <Link to="/contact" className="text-header-foreground/70 hover:text-primary text-sm transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.legal')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/imprint" className="text-header-foreground/70 hover:text-primary text-sm transition-colors">
                {t('footer.imprint')}
              </Link>
              <Link to="/privacy" className="text-header-foreground/70 hover:text-primary text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-header-foreground/70 hover:text-primary text-sm transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-header-foreground/20 mt-10 pt-6">
          <div className="flex justify-center items-center">
            <p className="text-sm text-header-foreground/70">
              © 2025 Noor.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
