import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, Phone, MapPin, Truck, Shield, Package, CreditCard, ArrowRight, ChevronRight } from 'lucide-react';
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

  const trustFeatures = [
    { icon: Truck, title: language === 'de' ? 'Kostenloser Versand' : 'Free Shipping', desc: language === 'de' ? 'Ab 50€ Bestellwert' : 'Orders over €50' },
    { icon: Shield, title: language === 'de' ? 'Käuferschutz' : 'Buyer Protection', desc: language === 'de' ? '100% abgesichert' : '100% secure' },
    { icon: Package, title: language === 'de' ? '14 Tage Rückgabe' : '14-Day Returns', desc: language === 'de' ? 'Kostenlos' : 'Free of charge' },
    { icon: CreditCard, title: language === 'de' ? 'Sichere Zahlung' : 'Secure Payment', desc: language === 'de' ? 'SSL-verschlüsselt' : 'SSL encrypted' },
  ];

  return (
    <footer className="bg-header text-header-foreground">
      {/* Trust Banner */}
      <div className="border-b border-header-foreground/10">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {trustFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-4 py-8 ${
                  index !== trustFeatures.length - 1 ? 'border-r border-header-foreground/10' : ''
                } ${index % 2 === 1 ? 'md:border-r' : ''} ${index > 1 ? 'border-t md:border-t-0 border-header-foreground/10' : ''}`}
                style={{ paddingLeft: index === 0 ? 0 : '1.5rem', paddingRight: index === trustFeatures.length - 1 ? 0 : '1.5rem' }}
              >
                <div className="p-3 bg-primary/20 rounded-xl">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-header-foreground">{feature.title}</p>
                  <p className="text-xs text-header-foreground/50">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-header-foreground/10">
        <div className="container max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-bold text-header-foreground mb-2">
                {language === 'de' ? 'Newsletter abonnieren' : 'Subscribe to Newsletter'}
              </h3>
              <p className="text-header-foreground/60 text-sm">
                {language === 'de' ? 'Erhalten Sie exklusive Angebote und Updates' : 'Get exclusive deals and updates'}
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder={language === 'de' ? 'Ihre E-Mail-Adresse' : 'Your email address'}
                className="flex-1 px-5 py-3.5 bg-header-foreground/5 border border-header-foreground/10 rounded-xl text-header-foreground placeholder:text-header-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'de' ? 'Anmelden' : 'Subscribe'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

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
