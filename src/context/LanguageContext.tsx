import React, { createContext, useContext, useState } from 'react';

type Language = 'de' | 'en';

interface Translations {
  [key: string]: {
    de: string;
    en: string;
  };
}

const translations: Translations = {
  'nav.home': { de: 'Home', en: 'Home' },
  'nav.categories': { de: 'Kategorien', en: 'Categories' },
  'nav.account': { de: 'Mein Konto', en: 'My Account' },
  'nav.favorites': { de: 'Favoriten', en: 'Favorites' },
  'nav.cart': { de: 'Warenkorb', en: 'Cart' },
  'nav.login': { de: 'Anmelden', en: 'Sign In' },
  'nav.logout': { de: 'Abmelden', en: 'Sign Out' },
  'search.placeholder': { de: 'Produkte suchen...', en: 'Search products...' },
  'search.noResults': { de: 'Keine Produkte gefunden', en: 'No products found' },
  'search.resultsFor': { de: 'Ergebnisse für', en: 'Results for' },
  'categories.title': { de: 'Alle Kategorien', en: 'All Categories' },
  'categories.browse': { de: 'Kategorien entdecken', en: 'Browse Categories' },
  'categories.viewAll': { de: 'Alle ansehen', en: 'View All' },
  'categories.popular': { de: 'Beliebte Kategorien', en: 'Popular Categories' },
  'category.baby': { de: 'Baby', en: 'Baby' },
  'category.schoenheit': { de: 'Schönheit', en: 'Beauty' },
  'category.elektronik': { de: 'Elektronik', en: 'Electronics' },
  'category.beleuchtung': { de: 'Beleuchtung', en: 'Lighting' },
  'category.haus-kueche': { de: 'Haus & Küche', en: 'Home & Kitchen' },
  'category.garten': { de: 'Garten', en: 'Garden' },
  'category.schmuck': { de: 'Schmuck', en: 'Jewelry' },
  'category.spielzeug': { de: 'Spielzeug', en: 'Toys' },
  'category.kleidung': { de: 'Kleidung', en: 'Clothing' },
  'category.sport-outdoor': { de: 'Sport & Outdoor', en: 'Sports & Outdoors' },
  'products.hotDeals': { de: 'Aktuelle Angebote', en: 'Hot Deals' },
  'products.popular': { de: 'Beliebte Produkte', en: 'Popular Products' },
  'products.discoverAll': { de: 'Alle Produkte entdecken', en: 'Discover All Products' },
  'products.inStock': { de: 'Auf Lager', en: 'In Stock' },
  'products.outOfStock': { de: 'Nicht verfügbar', en: 'Out of Stock' },
  'products.addToCart': { de: 'In den Warenkorb', en: 'Add to Cart' },
  'products.addedToCart': { de: 'In den Warenkorb gelegt', en: 'Added to cart' },
  'cart.title': { de: 'Warenkorb', en: 'Shopping Cart' },
  'cart.empty': { de: 'Dein Warenkorb ist leer', en: 'Your cart is empty' },
  'cart.checkout': { de: 'Zur Kasse', en: 'Checkout' },
  'cart.total': { de: 'Gesamt', en: 'Total' },
  'favorites.title': { de: 'Favoriten', en: 'Favorites' },
  'favorites.empty': { de: 'Keine Favoriten', en: 'No favorites yet' },
  'favorites.added': { de: 'Zu Favoriten hinzugefügt', en: 'Added to favorites' },
  'favorites.removed': { de: 'Aus Favoriten entfernt', en: 'Removed from favorites' },
  'auth.signIn': { de: 'Anmelden', en: 'Sign In' },
  'auth.signUp': { de: 'Registrieren', en: 'Sign Up' },
  'auth.email': { de: 'E-Mail', en: 'Email' },
  'auth.password': { de: 'Passwort', en: 'Password' },
  'footer.categories': { de: 'Kategorien', en: 'Categories' },
  'footer.help': { de: 'Hilfe', en: 'Help' },
  'footer.faq': { de: 'FAQ', en: 'FAQ' },
  'footer.shipping': { de: 'Versand', en: 'Shipping' },
  'footer.returns': { de: 'Rückgabe', en: 'Returns' },
  'footer.contact': { de: 'Kontakt', en: 'Contact' },
  'footer.legal': { de: 'Rechtliches', en: 'Legal' },
  'footer.imprint': { de: 'Impressum', en: 'Imprint' },
  'footer.privacy': { de: 'Datenschutz', en: 'Privacy' },
  'footer.terms': { de: 'AGB', en: 'Terms' },
  'footer.rights': { de: 'Alle Rechte vorbehalten.', en: 'All rights reserved.' },
  'footer.description': { de: 'Dein Online-Shop für alles was du brauchst.', en: 'Your online shop for everything you need.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tCategory: (slug: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('noor-language');
    return (saved === 'en' || saved === 'de') ? saved : 'de';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('noor-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.de || key;
  };

  const tCategory = (slug: string): string => {
    const key = `category.${slug}`;
    const translation = translations[key];
    if (!translation) return slug;
    return translation[language] || translation.de || slug;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tCategory }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
