import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail } from 'lucide-react';
import PaymentBadges from '@/components/PaymentBadges';

const Footer = () => {
  const { t, language } = useLanguage();

  const footerLinks = {
    shop: [
      { label: language === 'de' ? 'Alle Produkte' : 'All Products', href: '/products' },
      { label: language === 'de' ? 'Kategorien' : 'Categories', href: '/categories' },
      { label: language === 'de' ? 'Angebote' : 'Deals', href: '/products?filter=deals' },
      { label: language === 'de' ? 'Neu eingetroffen' : 'New Arrivals', href: '/products' },
      { label: language === 'de' ? 'Bestseller' : 'Bestsellers', href: '/products' },
    ],
    support: [
      { label: language === 'de' ? 'Hilfe-Center' : 'Help Center', href: '/faq' },
      { label: language === 'de' ? 'Versand & Lieferung' : 'Shipping & Delivery', href: '/shipping' },
      { label: language === 'de' ? 'Rückgabe & Umtausch' : 'Returns & Exchanges', href: '/returns' },
      { label: language === 'de' ? 'Bestellung verfolgen' : 'Track Order', href: '/order-tracking' },
      { label: language === 'de' ? 'Kontakt' : 'Contact', href: '/contact' },
    ],
    company: [
      { label: language === 'de' ? 'Über uns' : 'About Us', href: '/about' },
      { label: language === 'de' ? 'Karriere' : 'Careers', href: '/about' },
      { label: language === 'de' ? 'Presse' : 'Press', href: '/about' },
      { label: language === 'de' ? 'Blog' : 'Blog', href: '/about' },
    ],
    legal: [
      { label: t('footer.imprint'), href: '/imprint' },
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
      { label: language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings', onClick: () => window.dispatchEvent(new Event('open-cookie-settings')) },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];


  return (
    <footer className="bg-header text-header-foreground">

      {/* Main Footer Content */}
      <div className="container max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-display text-4xl font-bold text-header-foreground">Noor</span>
            </Link>
            <p className="text-header-foreground/60 text-sm mt-4 leading-relaxed max-w-xs">
              {language === 'de' 
                ? 'Ihr Premium-Marktplatz für Qualitätsprodukte von verifizierten Händlern. Entdecken Sie Vielfalt und Exzellenz.'
                : 'Your premium marketplace for quality products from verified merchants. Discover variety and excellence.'}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2 mt-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 bg-header-foreground/5 border border-header-foreground/10 rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-header-foreground mb-6">
              {language === 'de' ? 'Shop' : 'Shop'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-header-foreground/60 hover:text-header-foreground text-sm transition-colors hover-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-header-foreground mb-6">
              {language === 'de' ? 'Hilfe' : 'Support'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-header-foreground/60 hover:text-header-foreground text-sm transition-colors hover-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-header-foreground mb-6">
              {language === 'de' ? 'Unternehmen' : 'Company'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-header-foreground/60 hover:text-header-foreground text-sm transition-colors hover-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-header-foreground mb-6">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.onClick ? (
                    <button 
                      onClick={link.onClick}
                      className="text-header-foreground/60 hover:text-header-foreground text-sm transition-colors hover-underline inline-block text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link 
                      to={link.href!} 
                      className="text-header-foreground/60 hover:text-header-foreground text-sm transition-colors hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-header-foreground/10">
        <div className="container max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-header-foreground/40">
              <p>© {new Date().getFullYear()} Noor. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}</p>
              <span className="hidden md:inline">•</span>
              <p>{language === 'de' ? 'Mit ❤️ in Deutschland' : 'Made with ❤️ in Germany'}</p>
            </div>
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
