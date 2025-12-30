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
];

export const products: Product[] = [
  { id: '1', name: 'Premium Babyphone mit Kamera', description: 'HD-Babyphone mit Nachtsicht, Zwei-Wege-Audio und Temperaturanzeige.', price: 89.99, originalPrice: 119.99, discount: 25, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', category: 'baby', tags: ['Premium', 'Digital'], inStock: true },
  { id: '2', name: 'Ergonomischer Kinderwagen', description: 'Leichter, zusammenklappbarer Kinderwagen mit Sonnendach.', price: 299.00, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&h=400&fit=crop', category: 'baby', tags: ['Ergonomisch', 'Kompakt'], inStock: true },
  { id: '3', name: 'Luxus Pflegeset Gesicht', description: 'Komplettes Hautpflege-Set mit Reinigung, Serum und Creme.', price: 79.99, originalPrice: 99.99, discount: 20, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', category: 'schoenheit', tags: ['Luxus', 'Premium'], inStock: true },
  { id: '4', name: 'Professioneller Haartrockner', description: 'Ionentechnologie für glänzendes Haar mit 3 Wärmestufen.', price: 59.99, image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&h=400&fit=crop', category: 'schoenheit', tags: ['Profi', 'Ionen'], inStock: true },
  { id: '5', name: 'Wireless Noise-Cancelling Kopfhörer', description: 'Premium Over-Ear Kopfhörer mit 30h Akkulaufzeit.', price: 249.00, originalPrice: 299.00, discount: 17, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Wireless', 'Premium'], inStock: true },
  { id: '6', name: 'Smart TV 55 Zoll 4K', description: '55 Zoll Ultra HD Smart TV mit HDR.', price: 549.00, originalPrice: 699.00, discount: 21, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Smart', '4K'], inStock: true },
  { id: '7', name: 'Smart LED Glühbirne Set', description: '4er Pack smarte RGB-Glühbirnen, App-gesteuert.', price: 49.99, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop', category: 'beleuchtung', tags: ['Smart', 'LED'], inStock: true },
  { id: '8', name: 'Design Stehlampe Modern', description: 'Elegante Stehlampe mit dimmbarem LED-Licht.', price: 129.00, originalPrice: 159.00, discount: 19, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', category: 'beleuchtung', tags: ['Design', 'Modern'], inStock: true },
  { id: '9', name: 'Küchenmaschine Multifunktion', description: 'Vielseitige Küchenmaschine zum Kneten und Mixen.', price: 249.00, originalPrice: 299.00, discount: 17, image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&h=400&fit=crop', category: 'haus-kueche', tags: ['Multifunktion', 'Profi'], inStock: true },
  { id: '10', name: 'Akku-Rasenmäher 40V', description: 'Leiser, kabelloser Rasenmäher mit Mulchfunktion.', price: 349.00, originalPrice: 429.00, discount: 19, image: 'https://images.unsplash.com/photo-1590212151175-e58edd96185b?w=400&h=400&fit=crop', category: 'garten', tags: ['Akku', 'Leise'], inStock: true },
  { id: '11', name: 'Silber Halskette mit Anhänger', description: 'Elegante 925 Sterling Silber Halskette.', price: 49.99, originalPrice: 69.99, discount: 29, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', category: 'schmuck', tags: ['Silber', 'Elegant'], inStock: true },
  { id: '12', name: 'LEGO Architektur Set', description: 'Detailliertes Baustein-Set für Sammler.', price: 89.99, originalPrice: 109.99, discount: 18, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', category: 'spielzeug', tags: ['LEGO', 'Sammler'], inStock: true },
  { id: '13', name: 'Winter Daunenjacke', description: 'Warme, wasserabweisende Daunenjacke.', price: 179.00, originalPrice: 229.00, discount: 22, image: 'https://images.unsplash.com/photo-1544923246-77307dd628b4?w=400&h=400&fit=crop', category: 'kleidung', tags: ['Winter', 'Daunen'], inStock: true },
  { id: '14', name: 'Yoga Matte Premium', description: 'Rutschfeste, extra dicke Yogamatte.', price: 39.99, originalPrice: 49.99, discount: 20, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', category: 'sport-outdoor', tags: ['Yoga', 'Premium'], inStock: true },
  { id: '15', name: 'Smartwatch Fitness Pro', description: 'Fitness-Tracker mit GPS und 7 Tage Akku.', price: 199.00, originalPrice: 249.00, discount: 20, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Smart', 'Fitness'], inStock: true },
  { id: '16', name: 'Bluetooth Lautsprecher', description: 'Tragbarer Lautsprecher mit sattem Bass.', price: 79.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', category: 'elektronik', tags: ['Bluetooth', 'Tragbar'], inStock: true },
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
