# Noor Shop – Projektdokumentation

## 📋 Projektübersicht

**Noor** ist ein moderner E-Commerce Online-Shop, entwickelt mit React, TypeScript und Tailwind CSS. Der Shop bietet eine elegante, benutzerfreundliche Oberfläche für den Verkauf verschiedener Produktkategorien.

**Live-URL:** https://connect-access.vercel.app/

---

## 🛠️ Technologie-Stack

| Technologie | Verwendung |
|-------------|------------|
| **React 18** | Frontend-Framework |
| **TypeScript** | Typsichere Entwicklung |
| **Tailwind CSS** | Styling & Design-System |
| **Vite** | Build-Tool & Dev-Server |
| **React Router** | Client-Side Routing |
| **TanStack Query** | Daten-Fetching & Caching |
| **Radix UI** | Accessible UI-Komponenten |
| **Lucide React** | Icon-Bibliothek |
| **Sonner** | Toast-Benachrichtigungen |
| **React Helmet Async** | SEO Meta-Tags |
| **Lovable Cloud** | Backend (Supabase) |

---

## 📁 Projektstruktur

```
src/
├── components/           # Wiederverwendbare UI-Komponenten
│   ├── ui/              # shadcn/ui Basiskomponenten
│   ├── Header.tsx       # Hauptnavigation
│   ├── Footer.tsx       # Footer mit Links
│   ├── ProductCard.tsx  # Produktkarten
│   ├── SearchBar.tsx    # Suchfunktion
│   ├── WelcomeScreen.tsx # Cookie-Banner
│   └── ...
├── pages/               # Seiten-Komponenten
│   ├── Index.tsx        # Startseite
│   ├── Products.tsx     # Alle Produkte
│   ├── Category.tsx     # Kategorie-Ansicht
│   ├── ProductDetail.tsx # Produktdetails
│   ├── Cart.tsx         # Warenkorb
│   ├── Checkout.tsx     # Kasse
│   ├── CookieSettings.tsx # Cookie-Einstellungen
│   └── ...
├── context/             # React Context Provider
│   ├── AuthContext.tsx  # Authentifizierung
│   ├── CartContext.tsx  # Warenkorb-State
│   ├── FavoritesContext.tsx # Favoriten
│   └── LanguageContext.tsx  # Mehrsprachigkeit (DE/EN)
├── data/                # Statische Daten
│   └── products.ts      # Produkte, Kategorien, Banner
├── constants/           # Konfiguration
│   └── index.ts         # Site-Config, Shipping, etc.
├── hooks/               # Custom React Hooks
├── types/               # TypeScript Typen
└── lib/                 # Hilfsfunktionen
```

---

## ✨ Implementierte Features

### 1. **Homepage (Index)**
- Hero-Banner-Karussell mit Auto-Rotation
- Kategorien-Übersicht mit Icons
- "Hot Deals" Sektion (Produkte mit Rabatt)
- "Beliebte Produkte" Sektion
- Responsive Design für alle Bildschirmgrößen

### 2. **Produkte & Kategorien**
- **12 Hauptkategorien:**
  - Baby, Schönheit, Elektronik, Beleuchtung
  - Haus & Küche, Garten, Schmuck, Spielzeug
  - Kleidung, Sport & Outdoor
  - Sex & Sinnlichkeit, Speisen & Getränke
- **100+ Unterkategorien** (10+ pro Hauptkategorie)
- Produktkarten mit Bild, Preis, Rabatt-Badge
- Sortierung (Preis, Rabatt)
- Filter (Angebote, Auf Lager)

### 3. **Warenkorb-System**
- Produkte hinzufügen/entfernen
- Mengenänderung
- Persistenz via localStorage
- Warenkorb-Badge im Header

### 4. **Favoriten-System**
- Herz-Icon zum Favorisieren
- Separate Favoriten-Seite
- Persistenz via localStorage

### 5. **Checkout-Prozess**
- 3-Schritt-Checkout (Versand → Zahlung → Bestätigung)
- Formularvalidierung
- Bestellbestätigung-Seite

### 6. **Authentifizierung**
- Login/Registrierung
- Konto-Verwaltung
- Supabase Auth Integration

### 7. **Mehrsprachigkeit (i18n)**
- Deutsch (Standard)
- Englisch
- Sprachumschalter im Header
- Persistenz der Spracheinstellung

### 8. **Cookie-Banner & DSGVO**
- Cookie-Banner beim ersten Besuch
- "Einverstanden & Weiter" Button
- "Nur Essentielle" Button
- Link zu Cookie-Einstellungen
- **Cookie-Einstellungen-Seite** (`/cookie-settings`)
  - Essentielle Cookies (immer aktiv)
  - Analyse-Cookies (optional)
  - Marketing-Cookies (optional)
  - Alle akzeptieren / Alle ablehnen / Auswahl speichern

### 9. **SEO & Meta-Tags**
- Dynamische Title-Tags
- Meta-Descriptions
- Open Graph Tags
- Semantisches HTML

### 10. **Rechtliche Seiten**
- Impressum (`/imprint`)
- Datenschutz (`/privacy`)
- AGB (`/terms`)
- FAQ (`/faq`)
- Versand (`/shipping`)
- Rückgabe (`/returns`)
- Kontakt (`/contact`)
- Über uns (`/about`)

### 11. **UI/UX Features**
- Smooth Scroll-to-Top Button
- Lazy Loading für Seiten (Code-Splitting)
- Loading Skeletons
- Error Boundary
- Responsive Navigation
- Toast-Benachrichtigungen

---

## 🎨 Design-System

### Farben (HSL in `index.css`)
```css
--background: 30 25% 96%      /* Warmer Beige-Hintergrund */
--foreground: 30 10% 15%      /* Dunkler Text */
--primary: 35 75% 50%         /* Gold/Orange Akzent */
--card: 30 30% 99%            /* Karten-Hintergrund */
--muted: 30 15% 90%           /* Gedämpfte Elemente */
```

### Typografie
- Display Font für Headlines
- System Font Stack für Body

### Komponenten
- Alle UI-Komponenten basieren auf **shadcn/ui**
- Konsistente Spacing-Skala
- Einheitliche Border-Radii

---

## 🔧 Konfiguration

### Site-Konfiguration (`src/constants/index.ts`)
```typescript
SITE_CONFIG = {
  name: 'Noor',
  email: 'info@noor-shop.de',
  phone: '+49 123 456 789'
}

SHIPPING_CONFIG = {
  freeShippingThreshold: 50,  // Kostenloser Versand ab 50€
  standardShippingCost: 4.99
}
```

### LocalStorage Keys
| Key | Verwendung |
|-----|------------|
| `noor-cart` | Warenkorb-Daten |
| `noor-favorites` | Favoriten-Liste |
| `noor-language` | Spracheinstellung (de/en) |
| `noor-policy-accepted` | Cookie-Banner akzeptiert |
| `cookie-preferences` | Detaillierte Cookie-Präferenzen |
| `cookie-essential-only` | Nur essentielle Cookies |

---

## 📱 Seiten-Routen

| Route | Seite |
|-------|-------|
| `/` | Startseite |
| `/products` | Alle Produkte |
| `/product/:id` | Produktdetails |
| `/category/:slug` | Kategorie-Ansicht |
| `/categories` | Alle Kategorien |
| `/cart` | Warenkorb |
| `/checkout` | Kasse |
| `/order-confirmation` | Bestellbestätigung |
| `/favorites` | Favoriten |
| `/auth` | Login/Registrierung |
| `/account` | Mein Konto |
| `/cookie-settings` | Cookie-Einstellungen |
| `/faq` | FAQ |
| `/shipping` | Versandinformationen |
| `/returns` | Rückgabe |
| `/contact` | Kontakt |
| `/about` | Über uns |
| `/imprint` | Impressum |
| `/privacy` | Datenschutz |
| `/terms` | AGB |

---

## 🚀 Deployment

Das Projekt ist deployed auf **Vercel**:
- Automatische Deployments bei Git-Push
- Preview-Deployments für Pull Requests
- Production: https://connect-access.vercel.app/

---

## 📝 Changelog / Was wurde gemacht

### Phase 1: Grundstruktur
- React + TypeScript + Vite Setup
- Tailwind CSS Konfiguration
- shadcn/ui Installation
- Grundlegende Seitenstruktur

### Phase 2: E-Commerce Core
- Produktdaten-Struktur
- Kategorien mit Icons
- ProductCard Komponente
- Warenkorb-Logik (CartContext)
- Favoriten-Logik (FavoritesContext)

### Phase 3: Seiten
- Homepage mit Banner-Karussell
- Produktliste mit Filter/Sortierung
- Kategorie-Ansichten
- Produktdetail-Seite
- Checkout-Flow

### Phase 4: Mehrsprachigkeit
- LanguageContext erstellt
- Übersetzungen für DE/EN
- Sprachumschalter im Header

### Phase 5: Authentifizierung
- Supabase/Lovable Cloud Integration
- AuthContext
- Login/Registrierung
- Account-Seite

### Phase 6: Cookie-Compliance
- ~~Welcome-Screen (Fullscreen Modal)~~
- **Cookie-Banner** (unaufdringliches Banner unten)
- "Nur Essentielle" Button hinzugefügt
- **Cookie-Einstellungen-Seite** erstellt
  - Toggle für Analyse-Cookies
  - Toggle für Marketing-Cookies
  - Alle akzeptieren/ablehnen Buttons

### Phase 7: SEO & Rechtliches
- SEO Komponente mit Meta-Tags
- Impressum, Datenschutz, AGB
- FAQ, Versand, Rückgabe, Kontakt

---

## 🔜 Mögliche Erweiterungen

- [ ] Produktsuche mit Elasticsearch
- [ ] Benutzer-Bewertungen
- [ ] Wunschlisten-Sharing
- [ ] Newsletter-Integration
- [ ] Payment-Integration (Stripe)
- [ ] Admin-Dashboard
- [ ] Bestandsverwaltung
- [ ] Gutschein-System

---

## 👥 Mitwirkende

Entwickelt mit **Lovable AI** 🤖

---

*Letzte Aktualisierung: Januar 2026*
