# Noor – Vollständige Projektdokumentation

## 📋 Projektübersicht

**Noor** ist eine moderne E-Commerce Plattform, entwickelt mit React, TypeScript und Tailwind CSS. Die Website bietet eine elegante, benutzerfreundliche Oberfläche für den Verkauf verschiedener Produktkategorien.

**Live-URL:** https://connect-access.vercel.app/

---

## 🛠️ Technologie-Stack

| Technologie | Version | Verwendung |
|-------------|---------|------------|
| **React** | 18.3.1 | Frontend-Framework |
| **TypeScript** | - | Typsichere Entwicklung |
| **Tailwind CSS** | - | Styling & Design-System |
| **Vite** | - | Build-Tool & Dev-Server |
| **React Router** | 6.30.1 | Client-Side Routing (SPA) |
| **TanStack Query** | 5.83.0 | Daten-Fetching & Caching |
| **Radix UI** | - | Accessible UI-Komponenten |
| **shadcn/ui** | - | UI-Komponenten-Bibliothek |
| **Lucide React** | 0.462.0 | Icon-Bibliothek |
| **Sonner** | 1.7.4 | Toast-Benachrichtigungen |
| **React Helmet Async** | 2.0.5 | SEO Meta-Tags |
| **React Hook Form** | 7.61.1 | Formular-Handling |
| **Zod** | 3.25.76 | Schema-Validierung |
| **Supabase** | 2.89.0 | Backend (Lovable Cloud) |
| **date-fns** | 3.6.0 | Datum-Formatierung |
| **Recharts** | 2.15.4 | Charts (Admin) |

---

## 📁 Projektstruktur

```
noor-shop/
├── public/
│   ├── favicon.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/           # Wiederverwendbare UI-Komponenten
│   │   ├── ui/              # shadcn/ui Basiskomponenten
│   │   ├── Header.tsx       # Hauptnavigation
│   │   ├── Footer.tsx       # Footer mit Links
│   │   ├── ProductCard.tsx  # Produktkarten
│   │   ├── SearchBar.tsx    # Suchfunktion
│   │   ├── HeroSection.tsx  # Hero-Banner
│   │   ├── CookieConsentBanner.tsx  # Cookie-Banner
│   │   ├── ProductReviews.tsx       # Bewertungen
│   │   ├── AdminGuard.tsx           # Admin-Route-Schutz
│   │   └── ...
│   ├── pages/               # Seiten-Komponenten
│   │   ├── Index.tsx        # Startseite
│   │   ├── Products.tsx     # Alle Produkte
│   │   ├── ProductDetail.tsx # Produktdetails
│   │   ├── Category.tsx     # Kategorie-Ansicht
│   │   ├── Cart.tsx         # Warenkorb
│   │   ├── Checkout.tsx     # Kasse
│   │   ├── Auth.tsx         # Login/Registrierung
│   │   ├── Account.tsx      # Benutzerkonto
│   │   ├── admin/           # Admin-Bereich
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Reviews.tsx
│   │   │   └── Customers.tsx
│   │   └── ...
│   ├── context/             # React Context Provider
│   │   ├── AuthContext.tsx  # Authentifizierung
│   │   ├── CartContext.tsx  # Warenkorb-State
│   │   ├── FavoritesContext.tsx # Favoriten
│   │   └── LanguageContext.tsx  # Mehrsprachigkeit (DE/EN)
│   ├── hooks/               # Custom React Hooks
│   │   ├── useProducts.ts   # Produkt-Daten
│   │   ├── useIsAdmin.ts    # Admin-Check
│   │   ├── useHeroBanners.ts # Banner-Daten
│   │   ├── useImageUpload.ts # Bild-Upload
│   │   └── ...
│   ├── data/                # Statische Daten (Fallback)
│   │   └── products.ts      # Produkte, Kategorien
│   ├── constants/           # Konfiguration
│   │   └── index.ts         # Site-Config, Shipping
│   ├── types/               # TypeScript Typen
│   │   └── index.ts
│   ├── integrations/        # Supabase Integration
│   │   └── supabase/
│   │       ├── client.ts    # Supabase Client
│   │       └── types.ts     # DB-Typen (auto-generiert)
│   ├── lib/                 # Hilfsfunktionen
│   │   └── utils.ts         # cn() und Utilities
│   ├── App.tsx              # Haupt-App mit Routing
│   ├── main.tsx             # Entry Point
│   └── index.css            # Globale Styles
├── supabase/
│   └── config.toml          # Supabase Konfiguration
├── .env                     # Umgebungsvariablen (auto)
├── tailwind.config.ts       # Tailwind Konfiguration
├── vite.config.ts           # Vite Konfiguration
└── vercel.json              # Vercel Deployment Config
```

---

## 🗄️ Datenbank-Schema (Supabase)

### Tabellen

#### `products`
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount INTEGER,
  image TEXT NOT NULL,
  images TEXT[],
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[],
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `categories`
```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  image TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `orders`
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `order_items`
```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER DEFAULT 1,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `reviews`
```sql
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `profiles`
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `user_roles`
```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enum für Rollen
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');
```

#### `hero_banners`
```sql
CREATE TABLE public.hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  link TEXT DEFAULT '/',
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `blocked_users`
```sql
CREATE TABLE public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  display_name TEXT,
  bank_account TEXT,
  reason TEXT,
  blocked_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Datenbank-Funktionen

```sql
-- Admin-Rolle prüfen
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Benutzer blockiert prüfen
CREATE FUNCTION is_user_blocked(check_email TEXT, check_name TEXT, check_bank TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE 
      (email IS NOT NULL AND LOWER(email) = LOWER(check_email))
      OR (check_name IS NOT NULL AND display_name IS NOT NULL AND LOWER(display_name) = LOWER(check_name))
      OR (check_bank IS NOT NULL AND bank_account IS NOT NULL AND bank_account = check_bank)
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profil bei Registrierung erstellen
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Storage Buckets

| Bucket | Öffentlich | Verwendung |
|--------|------------|------------|
| `product-images` | Ja | Produktbilder |
| `avatars` | Ja | Benutzer-Avatare |

---

## 🎨 Design-System

### CSS-Variablen (`src/index.css`)

```css
:root {
  /* Farben (HSL) */
  --background: 40 30% 97%;      /* Warmer Beige */
  --foreground: 30 15% 12%;      /* Dunkelbraun */
  --primary: 35 85% 45%;         /* Gold/Amber */
  --primary-foreground: 0 0% 100%;
  --secondary: 35 20% 94%;
  --muted: 35 15% 92%;
  --accent: 35 50% 92%;
  --destructive: 0 72% 51%;
  --card: 0 0% 100%;
  --border: 35 15% 88%;
  --header: 30 25% 10%;          /* Dunkler Header */
  
  /* Spezielle Farben */
  --success: 152 60% 40%;
  --deal: 0 70% 50%;             /* Rot für Angebote */
  --favorite: 350 80% 50%;       /* Herz-Farbe */
  
  /* Schatten */
  --shadow-soft: 0 1px 3px 0 hsl(30 15% 12% / 0.04);
  --shadow-card: 0 4px 6px -1px hsl(30 15% 12% / 0.05);
  --shadow-elevated: 0 20px 25px -5px hsl(30 15% 12% / 0.08);
  --shadow-glow: 0 0 40px -10px hsl(35 85% 45% / 0.25);
  
  /* Typografie */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  
  --radius: 0.5rem;
}
```

### Dark Mode

```css
.dark {
  --background: 30 20% 6%;
  --foreground: 40 15% 92%;
  --primary: 35 80% 55%;
  --card: 30 18% 10%;
  --border: 30 12% 18%;
  --header: 30 25% 8%;
}
```

### Custom CSS-Klassen

| Klasse | Verwendung |
|--------|------------|
| `.product-card` | Produktkarten mit Hover-Effekt |
| `.category-chip` | Kategorie-Buttons |
| `.btn-primary` | Primärer Button-Style |
| `.search-input` | Such-Eingabefelder |
| `.badge-deal` | Rabatt-Badge |
| `.icon-btn` | Icon-Buttons |
| `.premium-link` | Elegante Links |
| `.hover-underline` | Animierte Unterstriche |
| `.text-gradient` | Gradient-Text |
| `.stagger-children` | Animierte Liste |

---

## 🔧 Konfiguration

### Site-Konfiguration (`src/constants/index.ts`)

```typescript
export const SITE_CONFIG = {
  name: 'Noor',
  title: 'Noor - E-Commerce',
  description: 'Deine E-Commerce Plattform...',
  url: 'https://noor.de',
  email: 'info@noor.de',
  phone: '+49 123 456 789',
};

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 50,    // Kostenloser Versand ab 50€
  standardShippingCost: 4.99,
  expressShippingCost: 9.99,
};

export const PAGINATION = {
  productsPerPage: 12,
  defaultPage: 1,
};

export const STORAGE_KEYS = {
  cart: 'noor-cart',
  favorites: 'noor-favorites',
  language: 'noor-language',
  policyAccepted: 'noor-policy-accepted',
  theme: 'noor-theme',
};
```

### Umgebungsvariablen (`.env` - automatisch)

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
VITE_SUPABASE_PROJECT_ID=xxx
```

---

## 📱 Routen

### Öffentliche Seiten

| Route | Komponente | Beschreibung |
|-------|------------|--------------|
| `/` | `Index` | Startseite |
| `/products` | `Products` | Alle Produkte |
| `/product/:id` | `ProductDetail` | Produktdetails |
| `/category/:slug` | `Category` | Kategorie-Ansicht |
| `/categories` | `Categories` | Alle Kategorien |
| `/cart` | `Cart` | Warenkorb |
| `/favorites` | `Favorites` | Wunschliste |
| `/auth` | `Auth` | Login/Registrierung |
| `/faq` | `FAQ` | FAQ |
| `/shipping` | `Shipping` | Versandinfos |
| `/returns` | `Returns` | Rückgabe |
| `/contact` | `Contact` | Kontaktformular |
| `/about` | `About` | Über uns |
| `/imprint` | `Imprint` | Impressum |
| `/privacy` | `Privacy` | Datenschutz |
| `/terms` | `Terms` | AGB |

### Geschützte Seiten (Auth erforderlich)

| Route | Komponente | Beschreibung |
|-------|------------|--------------|
| `/account` | `Account` | Mein Konto |
| `/checkout` | `Checkout` | Kasse |
| `/orders` | `OrderHistory` | Bestellverlauf |
| `/order-confirmation` | `OrderConfirmation` | Bestellbestätigung |

### Admin-Bereich (Admin-Rolle erforderlich)

| Route | Komponente | Beschreibung |
|-------|------------|--------------|
| `/admin` | `Dashboard` | Admin-Dashboard |
| `/admin/products` | `Products` | Produktverwaltung |
| `/admin/orders` | `Orders` | Bestellungen |
| `/admin/reviews` | `Reviews` | Bewertungen |
| `/admin/customers` | `Customers` | Kunden |

---

## 🔐 Authentifizierung

### Setup

```typescript
// src/context/AuthContext.tsx
import { supabase } from '@/integrations/supabase/client';

// Login
const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
};

// Registrierung
const signUp = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/` }
  });
  return { error };
};

// Logout
const signOut = async () => {
  await supabase.auth.signOut();
};
```

### Admin-Schutz

```typescript
// src/components/AdminGuard.tsx
const AdminGuard = ({ children }) => {
  const { isAdmin, loading } = useIsAdmin();
  
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

// src/hooks/useIsAdmin.ts
const useIsAdmin = () => {
  const { user } = useAuth();
  // Prüft user_roles Tabelle für admin-Rolle
};
```

---

## 🛒 State Management

### Cart Context

```typescript
// src/context/CartContext.tsx
interface CartItem {
  product: Product;
  quantity: number;
}

// Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
// Persistenz: localStorage ('noor-cart')
```

### Favorites Context

```typescript
// src/context/FavoritesContext.tsx
// Speichert Produkt-IDs in localStorage ('noor-favorites')
// Lädt vollständige Produkt-Daten bei Bedarf
```

### Language Context

```typescript
// src/context/LanguageContext.tsx
type Language = 'de' | 'en';

// Übersetzungen für alle UI-Texte
// Kategorien-Übersetzungen
// Persistenz: localStorage ('noor-language')
```

---

## 📦 TypeScript Typen

```typescript
// src/types/index.ts

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  inStock: boolean;
}

interface Category {
  slug: string;
  name: string;
  image: string;
  icon?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: ShippingAddress;
}

type Language = 'de' | 'en';
```

---

## 🪝 Custom Hooks

### `useProducts`

```typescript
// Produkte laden mit Optionen
const { products, isLoading } = useProducts({
  limit: 10,
  sortBy: 'price-asc',
  onlyDeals: true,
  onlyInStock: true,
});
```

### `useCategoryProducts`

```typescript
// Produkte einer Kategorie
const { products, isLoading } = useCategoryProducts('elektronik', {
  sortBy: 'discount',
});
```

### `useProduct`

```typescript
// Einzelnes Produkt
const { product, isLoading } = useProduct('product-id');
```

### `useIsAdmin`

```typescript
// Admin-Status prüfen
const { isAdmin, loading } = useIsAdmin();
```

### `useHeroBanners`

```typescript
// Hero-Banner laden
const { banners, isLoading } = useHeroBanners();
```

---

## 🚀 Deployment

### Vercel

1. **Build-Befehl:** `npm run build`
2. **Output-Verzeichnis:** `dist`
3. **Framework:** Vite

### vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Umgebungsvariablen (Vercel Dashboard)

```
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_PUBLISHABLE_KEY=xxx
```

---

## 🔄 Neu-Aufbau Anleitung

### 1. Projekt erstellen

```bash
# In Lovable: Neues Projekt erstellen
# Tech Stack: React + Vite + TypeScript + Tailwind
```

### 2. Dependencies installieren

Die wichtigsten Pakete (werden automatisch installiert):
- `@tanstack/react-query`
- `react-router-dom`
- `react-helmet-async`
- `react-hook-form` + `zod`
- `sonner`
- `lucide-react`
- `date-fns`
- `recharts`

### 3. Lovable Cloud aktivieren

1. Cloud-Tab in Lovable öffnen
2. Datenbank-Tabellen erstellen (siehe Schema oben)
3. RLS-Policies einrichten
4. Storage-Buckets erstellen

### 4. Dateien erstellen

1. `src/context/` - Alle Context-Provider
2. `src/components/` - UI-Komponenten
3. `src/pages/` - Seiten
4. `src/hooks/` - Custom Hooks
5. `src/types/` - TypeScript-Typen
6. `src/constants/` - Konfiguration
7. `src/index.css` - Design-System

### 5. Admin-Benutzer erstellen

```sql
-- Nach Registrierung: Admin-Rolle zuweisen
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin');
```

---

## 📝 Kategorien-Liste

| Slug | Name (DE) | Icon |
|------|-----------|------|
| `baby` | Baby | 👶 |
| `schoenheit` | Schönheit | ✨ |
| `elektronik` | Elektronik | 📱 |
| `beleuchtung` | Beleuchtung | 💡 |
| `haus-kueche` | Haus & Küche | 🏠 |
| `garten` | Garten | 🌱 |
| `schmuck` | Schmuck | 💎 |
| `spielzeug` | Spielzeug | 🎮 |
| `kleidung` | Kleidung | 👕 |
| `sport-outdoor` | Sport & Outdoor | ⚽ |
| `sex-sinnlichkeit` | Sex & Sinnlichkeit | ❤️ |
| `speisen-getraenke` | Speisen & Getränke | 🍷 |

---

## ✅ Features-Checkliste

- [x] Homepage mit Hero-Banner
- [x] Kategorien-Übersicht
- [x] Produktliste mit Filter/Sortierung
- [x] Produktdetail-Seite mit Galerie
- [x] Warenkorb (localStorage)
- [x] Favoriten/Wunschliste
- [x] Checkout (3 Schritte)
- [x] Authentifizierung (Supabase)
- [x] Benutzerkonto
- [x] Bestellverlauf
- [x] Mehrsprachigkeit (DE/EN)
- [x] Cookie-Banner (DSGVO)
- [x] Bewertungssystem
- [x] Admin-Dashboard
- [x] Admin: Produktverwaltung
- [x] Admin: Bestellungen
- [x] Admin: Kundenliste
- [x] SEO (Meta-Tags, sitemap.xml)
- [x] Responsive Design
- [x] Dark Mode Support

---

*Dokumentation erstellt: Januar 2026*
*Lovable AI 🤖*
