import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-foreground">Noor</p>
            <p className="text-muted-foreground text-sm mt-2">{t('footer.description')}</p>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-3">{t('footer.links')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/categories" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                {t('categories.browse')}
              </Link>
              <Link to="/cart" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                {t('cart.title')}
              </Link>
              <Link to="/account" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                {t('account.title')}
              </Link>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-foreground mb-3">{t('footer.contact')}</h4>
            <p className="text-muted-foreground text-sm">support@noor-shop.de</p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">© 2024 Noor. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
