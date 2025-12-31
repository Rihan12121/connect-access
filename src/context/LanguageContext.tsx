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
  'nav.backToHome': { de: 'Zurück zur Startseite', en: 'Back to Home' },
  'nav.categories': { de: 'Kategorien', en: 'Categories' },
  'nav.account': { de: 'Mein Konto', en: 'My Account' },
  'nav.favorites': { de: 'Favoriten', en: 'Favorites' },
  'nav.cart': { de: 'Warenkorb', en: 'Cart' },
  'nav.login': { de: 'Anmelden', en: 'Sign In' },
  'nav.logout': { de: 'Abmelden', en: 'Sign Out' },
  'search.placeholder': { de: 'Produkte suchen...', en: 'Search products...' },
  'search.noResults': { de: 'Keine Produkte gefunden für', en: 'No products found for' },
  'search.resultsFor': { de: 'Ergebnisse für', en: 'Results for' },
  'categories.title': { de: 'Alle Kategorien', en: 'All Categories' },
  'categories.all': { de: 'Alle Kategorien', en: 'All Categories' },
  'categories.browse': { de: 'Kategorien entdecken', en: 'Browse Categories' },
  'categories.viewAll': { de: 'Alle ansehen', en: 'View All' },
  'categories.popular': { de: 'Beliebte Kategorien', en: 'Popular Categories' },
  'categories.notFound': { de: 'Kategorie nicht gefunden', en: 'Category not found' },
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
  'products.addedToCart': { de: 'zum Warenkorb hinzugefügt', en: 'added to cart' },
  'products.notFound': { de: 'Produkt nicht gefunden', en: 'Product not found' },
  'products.related': { de: 'Ähnliche Produkte', en: 'Related Products' },
  'products.count': { de: 'Produkte', en: 'products' },
  'sort.default': { de: 'Standard', en: 'Default' },
  'sort.priceAsc': { de: 'Preis: Niedrig → Hoch', en: 'Price: Low → High' },
  'sort.priceDesc': { de: 'Preis: Hoch → Niedrig', en: 'Price: High → Low' },
  'sort.discount': { de: 'Größte Rabatte', en: 'Biggest Discounts' },
  'cart.title': { de: 'Warenkorb', en: 'Shopping Cart' },
  'cart.empty': { de: 'Dein Warenkorb ist leer', en: 'Your cart is empty' },
  'cart.emptyDescription': { de: 'Füge Produkte hinzu um loszulegen', en: 'Add products to get started' },
  'cart.checkout': { de: 'Zur Kasse', en: 'Checkout' },
  'cart.total': { de: 'Gesamt', en: 'Total' },
  'cart.subtotal': { de: 'Zwischensumme', en: 'Subtotal' },
  'cart.shipping': { de: 'Versand', en: 'Shipping' },
  'cart.free': { de: 'Kostenlos', en: 'Free' },
  'cart.summary': { de: 'Zusammenfassung', en: 'Summary' },
  'cart.clearAll': { de: 'Alles löschen', en: 'Clear all' },
  'cart.continueShopping': { de: 'Weiter einkaufen', en: 'Continue Shopping' },
  'favorites.title': { de: 'Favoriten', en: 'Favorites' },
  'favorites.empty': { de: 'Keine Favoriten', en: 'No favorites yet' },
  'favorites.emptyDescription': { de: 'Speichere deine Lieblingsprodukte hier', en: 'Save your favorite products here' },
  'favorites.discoverProducts': { de: 'Produkte entdecken', en: 'Discover Products' },
  'favorites.added': { de: 'Zu Favoriten hinzugefügt', en: 'Added to favorites' },
  'favorites.removed': { de: 'Aus Favoriten entfernt', en: 'Removed from favorites' },
  'auth.login': { de: 'Anmelden', en: 'Sign In' },
  'auth.signup': { de: 'Registrieren', en: 'Sign Up' },
  'auth.loginDescription': { de: 'Melde dich bei deinem Konto an', en: 'Sign in to your account' },
  'auth.signupDescription': { de: 'Erstelle ein neues Konto', en: 'Create a new account' },
  'auth.email': { de: 'E-Mail', en: 'Email' },
  'auth.password': { de: 'Passwort', en: 'Password' },
  'auth.loginButton': { de: 'Anmelden', en: 'Sign In' },
  'auth.signupButton': { de: 'Registrieren', en: 'Sign Up' },
  'auth.noAccount': { de: 'Noch kein Konto? Registrieren', en: "Don't have an account? Sign up" },
  'auth.hasAccount': { de: 'Bereits ein Konto? Anmelden', en: 'Already have an account? Sign in' },
  'auth.fillAllFields': { de: 'Bitte fülle alle Felder aus', en: 'Please fill all fields' },
  'auth.passwordTooShort': { de: 'Passwort muss mindestens 6 Zeichen haben', en: 'Password must be at least 6 characters' },
  'auth.invalidCredentials': { de: 'Ungültige Anmeldedaten', en: 'Invalid credentials' },
  'auth.userExists': { de: 'Benutzer existiert bereits', en: 'User already exists' },
  'auth.loginSuccess': { de: 'Erfolgreich angemeldet', en: 'Successfully signed in' },
  'auth.signupSuccess': { de: 'Konto erstellt! Bitte E-Mail bestätigen.', en: 'Account created! Please confirm email.' },
  'auth.logoutSuccess': { de: 'Erfolgreich abgemeldet', en: 'Successfully signed out' },
  'auth.logout': { de: 'Abmelden', en: 'Sign Out' },
  'auth.error': { de: 'Ein Fehler ist aufgetreten', en: 'An error occurred' },
  'account.title': { de: 'Mein Konto', en: 'My Account' },
  'account.member': { de: 'Mitglied seit 2024', en: 'Member since 2024' },
  'account.items': { de: 'Artikel', en: 'items' },
  'checkout.title': { de: 'Kasse', en: 'Checkout' },
  'checkout.shipping': { de: 'Versand', en: 'Shipping' },
  'checkout.payment': { de: 'Zahlung', en: 'Payment' },
  'checkout.confirm': { de: 'Bestätigen', en: 'Confirm' },
  'checkout.shippingInfo': { de: 'Versandadresse', en: 'Shipping Address' },
  'checkout.paymentInfo': { de: 'Zahlungsinformationen', en: 'Payment Information' },
  'checkout.confirmOrder': { de: 'Bestellung bestätigen', en: 'Confirm Order' },
  'checkout.firstName': { de: 'Vorname', en: 'First Name' },
  'checkout.lastName': { de: 'Nachname', en: 'Last Name' },
  'checkout.address': { de: 'Adresse', en: 'Address' },
  'checkout.city': { de: 'Stadt', en: 'City' },
  'checkout.postalCode': { de: 'PLZ', en: 'Postal Code' },
  'checkout.shippingTo': { de: 'Versand an', en: 'Shipping to' },
  'checkout.demoPayment': { de: 'Demo-Modus: Keine echte Zahlung', en: 'Demo mode: No real payment' },
  'checkout.placeOrder': { de: 'Bestellung aufgeben', en: 'Place Order' },
  'checkout.continue': { de: 'Weiter', en: 'Continue' },
  'checkout.back': { de: 'Zurück', en: 'Back' },
  'checkout.orderSuccess': { de: 'Bestellung erfolgreich aufgegeben!', en: 'Order placed successfully!' },
  'footer.links': { de: 'Links', en: 'Links' },
  'footer.categories': { de: 'Kategorien', en: 'Categories' },
  'footer.help': { de: 'Hilfe', en: 'Help' },
  'footer.faq': { de: 'FAQ', en: 'FAQ' },
  'footer.shipping': { de: 'Versand', en: 'Shipping' },
  'footer.returns': { de: 'Rückgabe', en: 'Returns' },
  'footer.contact': { de: 'Kontakt', en: 'Contact' },
  'footer.legal': { de: 'Rechtliches', en: 'Legal' },
  'footer.imprint': { de: 'Impressum', en: 'Imprint' },
  'footer.privacy': { de: 'Datenschutz', en: 'Privacy' },
  'footer.quality': { de: 'Qualität zu fairen Preisen.', en: 'Quality at fair prices.' },
  'footer.priceInfo': { de: 'Alle Preise inklusive gesetzlicher MwSt., zzgl. Versandkosten.', en: 'All prices include VAT, plus shipping costs.' },
  'products.discoverDescription': { de: 'Stöbere durch unser gesamtes Sortiment und finde genau das, was du suchst.', en: 'Browse our entire range and find exactly what you are looking for.' },
  'footer.terms': { de: 'AGB', en: 'Terms' },
  'footer.rights': { de: 'Alle Rechte vorbehalten.', en: 'All rights reserved.' },
  'footer.description': { de: 'Dein Online-Shop für alles was du brauchst.', en: 'Your online shop for everything you need.' },
  'category.sex-sinnlichkeit': { de: 'Sex & Sinnlichkeit', en: 'Intimacy & Sensuality' },
  'category.speisen-getraenke': { de: 'Speisen & Getränke', en: 'Food & Drinks' },
  'faq.subtitle': { de: 'Häufig gestellte Fragen', en: 'Frequently Asked Questions' },
  'faq.moreQuestions': { de: 'Noch Fragen? Kontaktieren Sie uns!', en: 'More questions? Contact us!' },
  'hero.welcome': { de: 'Willkommen bei Noor Shop', en: 'Welcome to Noor Shop' },
  'hero.tagline': { de: 'Dein Online-Shop für Qualitätsprodukte zu fairen Preisen', en: 'Your online shop for quality products at fair prices' },
  'hero.description': { de: 'Entdecke eine vielfältige Auswahl an Produkten – von Baby & Schönheit bis hin zu Elektronik und Haushalt. Wir bieten dir schnellen Versand und erstklassigen Service.', en: 'Discover a wide selection of products – from Baby & Beauty to Electronics and Home. We offer fast shipping and excellent service.' },
  'hero.shopNow': { de: 'Jetzt entdecken', en: 'Shop Now' },
  'about.title': { de: 'Über uns', en: 'About Us' },
  'about.description': { de: 'Noor Shop ist dein zuverlässiger Partner für hochwertige Produkte. Wir legen Wert auf Qualität, faire Preise und schnelle Lieferung. Unser Ziel ist es, dir das beste Einkaufserlebnis zu bieten – einfach, schnell und unkompliziert.', en: 'Noor Shop is your reliable partner for high-quality products. We value quality, fair prices, and fast delivery. Our goal is to provide you with the best shopping experience – simple, fast, and hassle-free.' },
  'about.quality': { de: 'Geprüfte Qualität', en: 'Verified Quality' },
  'about.qualityDesc': { de: 'Alle Produkte werden sorgfältig ausgewählt', en: 'All products are carefully selected' },
  'about.shipping': { de: 'Schneller Versand', en: 'Fast Shipping' },
  'about.shippingDesc': { de: 'Lieferung direkt zu dir nach Hause', en: 'Delivery straight to your door' },
  'about.support': { de: 'Top Service', en: 'Great Service' },
  'about.supportDesc': { de: 'Bei Fragen sind wir für dich da', en: 'We are here for you with any questions' },
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
