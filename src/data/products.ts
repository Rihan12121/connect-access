export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  inStock: boolean;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  image: string;
}

export interface Subcategory {
  slug: string;
  name: string;
  category: string;
}

export const subcategories: Subcategory[] = [
  { slug: 'baby-kleidung', name: 'Babykleidung', category: 'baby' },
  { slug: 'baby-pflege', name: 'Babypflege', category: 'baby' },
  { slug: 'baby-moebel', name: 'Babymöbel', category: 'baby' },
  { slug: 'hautpflege', name: 'Hautpflege', category: 'schoenheit' },
  { slug: 'haarpflege', name: 'Haarpflege', category: 'schoenheit' },
  { slug: 'makeup', name: 'Make-up', category: 'schoenheit' },
  { slug: 'smartphones', name: 'Smartphones', category: 'elektronik' },
  { slug: 'kopfhoerer', name: 'Kopfhörer', category: 'elektronik' },
  { slug: 'fernseher', name: 'Fernseher', category: 'elektronik' },
  { slug: 'dessous', name: 'Dessous', category: 'sex-sinnlichkeit' },
  { slug: 'massage', name: 'Massage', category: 'sex-sinnlichkeit' },
  { slug: 'getraenke', name: 'Getränke', category: 'speisen-getraenke' },
  { slug: 'snacks', name: 'Snacks', category: 'speisen-getraenke' },
];

export const categories: Category[] = [
  { slug: 'baby', name: 'Baby', icon: '👶', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop' },
  { slug: 'schoenheit', name: 'Schönheit', icon: '✨', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop' },
  { slug: 'elektronik', name: 'Elektronik', icon: '📱', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
  { slug: 'beleuchtung', name: 'Beleuchtung', icon: '💡', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop' },
  { slug: 'haus-kueche', name: 'Haus & Küche', icon: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop' },
  { slug: 'garten', name: 'Garten', icon: '🌱', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop' },
  { slug: 'schmuck', name: 'Schmuck', icon: '💎', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop' },
  { slug: 'spielzeug', name: 'Spielzeug', icon: '🎮', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop' },
  { slug: 'kleidung', name: 'Kleidung', icon: '👕', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=200&fit=crop' },
  { slug: 'sport-outdoor', name: 'Sport & Outdoor', icon: '⚽', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop' },
  { slug: 'sex-sinnlichkeit', name: 'Sex & Sinnlichkeit', icon: '❤️', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop' },
  { slug: 'speisen-getraenke', name: 'Speisen & Getränke', icon: '🍷', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop' },
];

export const products: Product[] = [
  // Baby
  { id: '1', name: 'Premium Babyphone mit Kamera', description: 'HD-Babyphone mit Nachtsicht, Zwei-Wege-Audio und Temperaturanzeige.', price: 89.99, originalPrice: 119.99, discount: 25, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', category: 'baby', tags: ['Premium', 'Digital'], inStock: true },
  { id: '2', name: 'Ergonomischer Kinderwagen', description: 'Leichter, zusammenklappbarer Kinderwagen mit Sonnendach.', price: 299.00, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&h=400&fit=crop', category: 'baby', tags: ['Ergonomisch', 'Kompakt'], inStock: true },
  
  // Schönheit
  { id: '3', name: 'Luxus Pflegeset Gesicht', description: 'Komplettes Hautpflege-Set mit Reinigung, Serum und Creme.', price: 79.99, originalPrice: 99.99, discount: 20, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', category: 'schoenheit', tags: ['Luxus', 'Premium'], inStock: true },
  { id: '4', name: 'Professioneller Haartrockner', description: 'Ionentechnologie für glänzendes Haar mit 3 Wärmestufen.', price: 59.99, image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&h=400&fit=crop', category: 'schoenheit', tags: ['Profi', 'Ionen'], inStock: true },
  
  // Elektronik
  { id: '5', name: 'Wireless Noise-Cancelling Kopfhörer', description: 'Premium Over-Ear Kopfhörer mit 30h Akkulaufzeit.', price: 249.00, originalPrice: 299.00, discount: 17, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Wireless', 'Premium'], inStock: true },
  { id: '6', name: 'Smart TV 55 Zoll 4K', description: '55 Zoll Ultra HD Smart TV mit HDR.', price: 549.00, originalPrice: 699.00, discount: 21, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Smart', '4K'], inStock: true },
  { id: '15', name: 'Smartwatch Fitness Pro', description: 'Fitness-Tracker mit GPS und 7 Tage Akku.', price: 199.00, originalPrice: 249.00, discount: 20, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Smart', 'Fitness'], inStock: true },
  { id: '16', name: 'Bluetooth Lautsprecher', description: 'Tragbarer Lautsprecher mit sattem Bass.', price: 79.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Bluetooth', 'Tragbar'], inStock: true },
  
  // Beleuchtung
  { id: '7', name: 'Smart LED Glühbirne Set', description: '4er Pack smarte RGB-Glühbirnen, App-gesteuert.', price: 49.99, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop', category: 'beleuchtung', tags: ['Smart', 'LED'], inStock: true },
  { id: '8', name: 'Design Stehlampe Modern', description: 'Elegante Stehlampe mit dimmbarem LED-Licht.', price: 129.00, originalPrice: 159.00, discount: 19, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', category: 'beleuchtung', tags: ['Design', 'Modern'], inStock: true },
  
  // Haus & Küche
  { id: '9', name: 'Küchenmaschine Multifunktion', description: 'Vielseitige Küchenmaschine zum Kneten und Mixen.', price: 249.00, originalPrice: 299.00, discount: 17, image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&h=400&fit=crop', category: 'haus-kueche', tags: ['Multifunktion', 'Profi'], inStock: true },
  
  // Garten
  { id: '10', name: 'Akku-Rasenmäher 40V', description: 'Leiser, kabelloser Rasenmäher mit Mulchfunktion.', price: 349.00, originalPrice: 429.00, discount: 19, image: 'https://images.unsplash.com/photo-1590212151175-e58edd96185b?w=400&h=400&fit=crop', category: 'garten', tags: ['Akku', 'Leise'], inStock: true },
  
  // Schmuck
  { id: '11', name: 'Silber Halskette mit Anhänger', description: 'Elegante 925 Sterling Silber Halskette.', price: 49.99, originalPrice: 69.99, discount: 29, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', category: 'schmuck', tags: ['Silber', 'Elegant'], inStock: true },
  
  // Spielzeug
  { id: '12', name: 'LEGO Architektur Set', description: 'Detailliertes Baustein-Set für Sammler.', price: 89.99, originalPrice: 109.99, discount: 18, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', category: 'spielzeug', tags: ['LEGO', 'Sammler'], inStock: true },
  
  // Kleidung
  { id: '13', name: 'Winter Daunenjacke', description: 'Warme, wasserabweisende Daunenjacke.', price: 179.00, originalPrice: 229.00, discount: 22, image: 'https://images.unsplash.com/photo-1544923246-77307dd628b4?w=400&h=400&fit=crop', category: 'kleidung', tags: ['Winter', 'Daunen'], inStock: true },
  
  // Sport & Outdoor
  { id: '14', name: 'Yoga Matte Premium', description: 'Rutschfeste, extra dicke Yogamatte.', price: 39.99, originalPrice: 49.99, discount: 20, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', category: 'sport-outdoor', tags: ['Yoga', 'Premium'], inStock: true },
  
  // Sex & Sinnlichkeit
  { id: '17', name: 'Romantisches Kerzen Set', description: 'Duftkerzen-Set für romantische Abende.', price: 29.99, originalPrice: 39.99, discount: 25, image: 'https://images.unsplash.com/photo-1602607135257-91c9dfa8db9f?w=400&h=400&fit=crop', category: 'sex-sinnlichkeit', tags: ['Romantik', 'Duft'], inStock: true },
  { id: '18', name: 'Massage Öl Premium', description: 'Hochwertiges Massageöl mit ätherischen Ölen.', price: 19.99, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop', category: 'sex-sinnlichkeit', tags: ['Massage', 'Premium'], inStock: true },
  { id: '19', name: 'Seiden Kimono', description: 'Eleganter Kimono aus hochwertiger Seide.', price: 89.99, originalPrice: 119.99, discount: 25, image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=400&fit=crop', category: 'sex-sinnlichkeit', tags: ['Seide', 'Elegant'], inStock: true },
  
  // Speisen & Getränke
  { id: '20', name: 'Premium Rotwein Set', description: '3er Set ausgewählter Rotweine aus Italien.', price: 59.99, originalPrice: 79.99, discount: 25, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop', category: 'speisen-getraenke', tags: ['Wein', 'Premium'], inStock: true },
  { id: '21', name: 'Gourmet Schokoladen Box', description: 'Handgemachte Pralinen aus belgischer Schokolade.', price: 34.99, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop', category: 'speisen-getraenke', tags: ['Schokolade', 'Gourmet'], inStock: true },
  { id: '22', name: 'Bio Tee Geschenkset', description: 'Exklusive Bio-Tee Kollektion mit 6 Sorten.', price: 24.99, originalPrice: 34.99, discount: 29, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', category: 'speisen-getraenke', tags: ['Bio', 'Tee'], inStock: true },
  { id: '23', name: 'Italienisches Olivenöl Extra Vergine', description: 'Kaltgepresstes Olivenöl aus der Toskana.', price: 18.99, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop', category: 'speisen-getraenke', tags: ['Bio', 'Italien'], inStock: true },
];

export const banners = [
  {
    id: 1,
    title: 'NEUE KOLLEKTION',
    subtitle: 'FRÜHJAHRS-SALE',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    link: '/category/kleidung',
  },
  {
    id: 2,
    title: 'BIS ZU 30%',
    subtitle: 'AUF ELEKTRONIK',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop',
    link: '/category/elektronik',
  },
  {
    id: 3,
    title: 'OUTDOOR SAISON',
    subtitle: 'JETZT ENTDECKEN',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    link: '/category/sport-outdoor',
  },
];
