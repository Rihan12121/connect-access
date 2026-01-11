import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Instagram, Twitter, Package, MapPin, Truck, Shield, CreditCard } from 'lucide-react';
import PaymentBadges from '@/components/PaymentBadges';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-header text-header-foreground mt-20">
      {/* Trust Banner */}
      <div className="border-b border-header-foreground/10">
        <div className="container max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-header-foreground/5 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-header-foreground">
                  {language === 'de' ? 'Kostenloser Versand' : 'Free Shipping'}
                </p>
                <p className="text-xs text-header-foreground/50">
                  {language === 'de' ? 'Ab 50€ Bestellwert' : 'Orders over €50'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-header-foreground/5 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-header-foreground">
                  {language === 'de' ? 'Käuferschutz' : 'Buyer Protection'}
                </p>
                <p className="text-xs text-header-foreground/50">
                  {language === 'de' ? '100% sicher' : '100% secure'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-header-foreground/5 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-header-foreground">
                  {language === 'de' ? '14 Tage Rückgabe' : '14-Day Returns'}
                </p>
                <p className="text-xs text-header-foreground/50">
                  {language === 'de' ? 'Kostenlos' : 'Free of charge'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-header-foreground/5 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-header-foreground">
                  {language === 'de' ? 'Sichere Zahlung' : 'Secure Payment'}
                </p>
                <p className="text-xs text-header-foreground/50">
                  {language === 'de' ? 'PayPal & Karten' : 'PayPal & Cards'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="font-display text-3xl font-semibold">Noor</p>
            <p className="text-header-foreground/60 text-sm mt-4 leading-relaxed max-w-xs">
              {language === 'de' 
                ? 'Ihr Marktplatz für Premium-Produkte von verifizierten Anbietern. Qualität und Vielfalt vereint.'
                : 'Your marketplace for premium products from verified vendors. Quality and variety combined.'}
            </p>
            <div className="flex gap-3 mt-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-header-foreground/5 border border-header-foreground/10 rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-header-foreground/5 border border-header-foreground/10 rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-header-foreground/5 border border-header-foreground/10 rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-header-foreground/50 mb-6">
              {language === 'de' ? 'Schnellzugriff' : 'Quick Links'}
            </h4>
            <div className="flex flex-col gap-3">
              <Link to="/products" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {language === 'de' ? 'Alle Produkte' : 'All Products'}
              </Link>
              <Link to="/categories" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {language === 'de' ? 'Kategorien' : 'Categories'}
              </Link>
              <Link to="/products?filter=deals" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {language === 'de' ? 'Angebote' : 'Deals'}
              </Link>
              <Link to="/order-tracking" className="text-header-foreground/70 hover:text-header-foreground text-sm transition-colors duration-300 hover-underline inline-block w-fit">
                {language === 'de' ? 'Bestellung verfolgen' : 'Track Order'}
              </Link>
            </div>
          </div>

          {/* Help & About */}
          <div className="md:col-span-3">
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
          <div className="md:col-span-3">
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
                {language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-header-foreground/10 mt-14 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-header-foreground/40 tracking-wider">
              © 2025 Noor. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-header-foreground/40">
                {language === 'de' ? 'Zahlungsmethoden:' : 'Payment Methods:'}
              </span>
              <PaymentBadges size="sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
