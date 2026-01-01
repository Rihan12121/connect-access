export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
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
  // Baby (10+)
  { slug: 'baby-kleidung', name: 'Babykleidung', category: 'baby' },
  { slug: 'baby-pflege', name: 'Babypflege', category: 'baby' },
  { slug: 'baby-moebel', name: 'Babymöbel', category: 'baby' },
  { slug: 'baby-spielzeug', name: 'Babyspielzeug', category: 'baby' },
  { slug: 'baby-ernaehrung', name: 'Babyernährung', category: 'baby' },
  { slug: 'baby-sicherheit', name: 'Babysicherheit', category: 'baby' },
  { slug: 'kinderwagen', name: 'Kinderwagen', category: 'baby' },
  { slug: 'baby-betten', name: 'Babybetten', category: 'baby' },
  { slug: 'baby-hygiene', name: 'Hygiene & Windeln', category: 'baby' },
  { slug: 'baby-geschenke', name: 'Geschenksets', category: 'baby' },
  
  // Schönheit (10+)
  { slug: 'hautpflege', name: 'Hautpflege', category: 'schoenheit' },
  { slug: 'haarpflege', name: 'Haarpflege', category: 'schoenheit' },
  { slug: 'makeup', name: 'Make-up', category: 'schoenheit' },
  { slug: 'parfuem', name: 'Parfüm', category: 'schoenheit' },
  { slug: 'nagelpflege', name: 'Nagelpflege', category: 'schoenheit' },
  { slug: 'koerperpflege', name: 'Körperpflege', category: 'schoenheit' },
  { slug: 'gesichtspflege', name: 'Gesichtspflege', category: 'schoenheit' },
  { slug: 'sonnenschutz', name: 'Sonnenschutz', category: 'schoenheit' },
  { slug: 'anti-aging', name: 'Anti-Aging', category: 'schoenheit' },
  { slug: 'naturkosmetik', name: 'Naturkosmetik', category: 'schoenheit' },
  
  // Elektronik (10+)
  { slug: 'smartphones', name: 'Smartphones', category: 'elektronik' },
  { slug: 'kopfhoerer', name: 'Kopfhörer', category: 'elektronik' },
  { slug: 'fernseher', name: 'Fernseher', category: 'elektronik' },
  { slug: 'tablets', name: 'Tablets', category: 'elektronik' },
  { slug: 'laptops', name: 'Laptops', category: 'elektronik' },
  { slug: 'kameras', name: 'Kameras', category: 'elektronik' },
  { slug: 'smartwatches', name: 'Smartwatches', category: 'elektronik' },
  { slug: 'lautsprecher', name: 'Lautsprecher', category: 'elektronik' },
  { slug: 'gaming', name: 'Gaming', category: 'elektronik' },
  { slug: 'zubehoer', name: 'Zubehör', category: 'elektronik' },
  
  // Beleuchtung (10+)
  { slug: 'led-lampen', name: 'LED-Lampen', category: 'beleuchtung' },
  { slug: 'stehlampen', name: 'Stehlampen', category: 'beleuchtung' },
  { slug: 'tischlampen', name: 'Tischlampen', category: 'beleuchtung' },
  { slug: 'deckenleuchten', name: 'Deckenleuchten', category: 'beleuchtung' },
  { slug: 'wandleuchten', name: 'Wandleuchten', category: 'beleuchtung' },
  { slug: 'aussenbeleuchtung', name: 'Außenbeleuchtung', category: 'beleuchtung' },
  { slug: 'smart-beleuchtung', name: 'Smart-Beleuchtung', category: 'beleuchtung' },
  { slug: 'lichterketten', name: 'Lichterketten', category: 'beleuchtung' },
  { slug: 'kronleuchter', name: 'Kronleuchter', category: 'beleuchtung' },
  { slug: 'nachtlichter', name: 'Nachtlichter', category: 'beleuchtung' },
  
  // Haus & Küche (10+)
  { slug: 'kuechengeraete', name: 'Küchengeräte', category: 'haus-kueche' },
  { slug: 'kochgeschirr', name: 'Kochgeschirr', category: 'haus-kueche' },
  { slug: 'besteck', name: 'Besteck', category: 'haus-kueche' },
  { slug: 'geschirr', name: 'Geschirr', category: 'haus-kueche' },
  { slug: 'aufbewahrung', name: 'Aufbewahrung', category: 'haus-kueche' },
  { slug: 'reinigung', name: 'Reinigung', category: 'haus-kueche' },
  { slug: 'heimtextilien', name: 'Heimtextilien', category: 'haus-kueche' },
  { slug: 'moebel', name: 'Möbel', category: 'haus-kueche' },
  { slug: 'dekoration', name: 'Dekoration', category: 'haus-kueche' },
  { slug: 'bad-zubehoer', name: 'Bad-Zubehör', category: 'haus-kueche' },
  
  // Garten (10+)
  { slug: 'pflanzen', name: 'Pflanzen', category: 'garten' },
  { slug: 'gartenmoebel', name: 'Gartenmöbel', category: 'garten' },
  { slug: 'gartenwerkzeug', name: 'Gartenwerkzeug', category: 'garten' },
  { slug: 'bewaesserung', name: 'Bewässerung', category: 'garten' },
  { slug: 'grills', name: 'Grills & BBQ', category: 'garten' },
  { slug: 'gartenbeleuchtung', name: 'Gartenbeleuchtung', category: 'garten' },
  { slug: 'pools', name: 'Pools & Zubehör', category: 'garten' },
  { slug: 'samen-duenger', name: 'Samen & Dünger', category: 'garten' },
  { slug: 'sonnenschirme', name: 'Sonnenschirme', category: 'garten' },
  { slug: 'gewaechshaeuser', name: 'Gewächshäuser', category: 'garten' },
  
  // Schmuck (10+)
  { slug: 'halsketten', name: 'Halsketten', category: 'schmuck' },
  { slug: 'ohrringe', name: 'Ohrringe', category: 'schmuck' },
  { slug: 'armbaender', name: 'Armbänder', category: 'schmuck' },
  { slug: 'ringe', name: 'Ringe', category: 'schmuck' },
  { slug: 'uhren', name: 'Uhren', category: 'schmuck' },
  { slug: 'anhaenger', name: 'Anhänger', category: 'schmuck' },
  { slug: 'gold-schmuck', name: 'Goldschmuck', category: 'schmuck' },
  { slug: 'silber-schmuck', name: 'Silberschmuck', category: 'schmuck' },
  { slug: 'perlen', name: 'Perlenschmuck', category: 'schmuck' },
  { slug: 'schmuck-sets', name: 'Schmuck-Sets', category: 'schmuck' },
  
  // Spielzeug (10+)
  { slug: 'lego', name: 'LEGO & Bausteine', category: 'spielzeug' },
  { slug: 'puppen', name: 'Puppen', category: 'spielzeug' },
  { slug: 'autos', name: 'Autos & Fahrzeuge', category: 'spielzeug' },
  { slug: 'brettspiele', name: 'Brettspiele', category: 'spielzeug' },
  { slug: 'puzzles', name: 'Puzzles', category: 'spielzeug' },
  { slug: 'outdoor-spielzeug', name: 'Outdoor-Spielzeug', category: 'spielzeug' },
  { slug: 'lernspielzeug', name: 'Lernspielzeug', category: 'spielzeug' },
  { slug: 'plueschtiere', name: 'Plüschtiere', category: 'spielzeug' },
  { slug: 'actionfiguren', name: 'Actionfiguren', category: 'spielzeug' },
  { slug: 'kreativ-sets', name: 'Kreativ-Sets', category: 'spielzeug' },
  
  // Kleidung (10+)
  { slug: 'damen', name: 'Damenmode', category: 'kleidung' },
  { slug: 'herren', name: 'Herrenmode', category: 'kleidung' },
  { slug: 'kinder', name: 'Kindermode', category: 'kleidung' },
  { slug: 'schuhe', name: 'Schuhe', category: 'kleidung' },
  { slug: 'taschen', name: 'Taschen', category: 'kleidung' },
  { slug: 'accessoires', name: 'Accessoires', category: 'kleidung' },
  { slug: 'sportbekleidung', name: 'Sportbekleidung', category: 'kleidung' },
  { slug: 'wintermode', name: 'Wintermode', category: 'kleidung' },
  { slug: 'sommermode', name: 'Sommermode', category: 'kleidung' },
  { slug: 'unterwaesche', name: 'Unterwäsche', category: 'kleidung' },
  
  // Sport & Outdoor (10+)
  { slug: 'fitness', name: 'Fitness', category: 'sport-outdoor' },
  { slug: 'yoga', name: 'Yoga', category: 'sport-outdoor' },
  { slug: 'laufen', name: 'Laufen', category: 'sport-outdoor' },
  { slug: 'radfahren', name: 'Radfahren', category: 'sport-outdoor' },
  { slug: 'wandern', name: 'Wandern', category: 'sport-outdoor' },
  { slug: 'camping', name: 'Camping', category: 'sport-outdoor' },
  { slug: 'wassersport', name: 'Wassersport', category: 'sport-outdoor' },
  { slug: 'wintersport', name: 'Wintersport', category: 'sport-outdoor' },
  { slug: 'teamsport', name: 'Teamsport', category: 'sport-outdoor' },
  { slug: 'sportnahrung', name: 'Sportnahrung', category: 'sport-outdoor' },
  
  // Sex & Sinnlichkeit (10+)
  { slug: 'dessous', name: 'Dessous', category: 'sex-sinnlichkeit' },
  { slug: 'massage', name: 'Massage', category: 'sex-sinnlichkeit' },
  { slug: 'kerzen', name: 'Duftkerzen', category: 'sex-sinnlichkeit' },
  { slug: 'oele', name: 'Öle & Lotionen', category: 'sex-sinnlichkeit' },
  { slug: 'nachtwaesche', name: 'Nachtwäsche', category: 'sex-sinnlichkeit' },
  { slug: 'romantik', name: 'Romantik', category: 'sex-sinnlichkeit' },
  { slug: 'wellness', name: 'Wellness', category: 'sex-sinnlichkeit' },
  { slug: 'bademoden', name: 'Bademoden', category: 'sex-sinnlichkeit' },
  { slug: 'accessoires-intim', name: 'Accessoires', category: 'sex-sinnlichkeit' },
  { slug: 'geschenkideen', name: 'Geschenkideen', category: 'sex-sinnlichkeit' },
  
  // Speisen & Getränke (10+)
  { slug: 'getraenke', name: 'Getränke', category: 'speisen-getraenke' },
  { slug: 'snacks', name: 'Snacks', category: 'speisen-getraenke' },
  { slug: 'wein', name: 'Wein', category: 'speisen-getraenke' },
  { slug: 'spirituosen', name: 'Spirituosen', category: 'speisen-getraenke' },
  { slug: 'kaffee-tee', name: 'Kaffee & Tee', category: 'speisen-getraenke' },
  { slug: 'schokolade', name: 'Schokolade', category: 'speisen-getraenke' },
  { slug: 'feinkost', name: 'Feinkost', category: 'speisen-getraenke' },
  { slug: 'bio-produkte', name: 'Bio-Produkte', category: 'speisen-getraenke' },
  { slug: 'gewuerze', name: 'Gewürze', category: 'speisen-getraenke' },
  { slug: 'geschenkkoerbe', name: 'Geschenkkörbe', category: 'speisen-getraenke' },
];

export const categories: Category[] = [
  { slug: 'baby', name: 'Baby', icon: '👶', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop&q=80' },
  { slug: 'schoenheit', name: 'Schönheit', icon: '✨', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop&q=80' },
  { slug: 'elektronik', name: 'Elektronik', icon: '📱', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop&q=80' },
  { slug: 'beleuchtung', name: 'Beleuchtung', icon: '💡', image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=600&fit=crop&q=80' },
  { slug: 'haus-kueche', name: 'Haus & Küche', icon: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80' },
  { slug: 'garten', name: 'Garten', icon: '🌱', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop&q=80' },
  { slug: 'schmuck', name: 'Schmuck', icon: '💎', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop&q=80' },
  { slug: 'spielzeug', name: 'Spielzeug', icon: '🎮', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=600&fit=crop&q=80' },
  { slug: 'kleidung', name: 'Kleidung', icon: '👕', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80' },
  { slug: 'sport-outdoor', name: 'Sport & Outdoor', icon: '⚽', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop&q=80' },
  { slug: 'sex-sinnlichkeit', name: 'Sex & Sinnlichkeit', icon: '❤️', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80' },
  { slug: 'speisen-getraenke', name: 'Speisen & Getränke', icon: '🍷', image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop&q=80' },
];

export const products: Product[] = [
  // Baby
  { id: '1', name: 'Premium Babyphone mit Kamera', description: 'HD-Babyphone mit Nachtsicht, Zwei-Wege-Audio und Temperaturanzeige.', price: 89.99, originalPrice: 119.99, discount: 25, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=800&fit=crop'], category: 'baby', tags: ['Premium', 'Digital'], inStock: true },
  { id: '2', name: 'Ergonomischer Kinderwagen', description: 'Leichter, zusammenklappbarer Kinderwagen mit Sonnendach.', price: 299.00, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&h=800&fit=crop'], category: 'baby', tags: ['Ergonomisch', 'Kompakt'], inStock: true },
  
  // Schönheit
  { id: '3', name: 'Luxus Pflegeset Gesicht', description: 'Komplettes Hautpflege-Set mit Reinigung, Serum und Creme.', price: 79.99, originalPrice: 99.99, discount: 20, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=800&fit=crop'], category: 'schoenheit', tags: ['Luxus', 'Premium'], inStock: true },
  { id: '4', name: 'Professioneller Haartrockner', description: 'Ionentechnologie für glänzendes Haar mit 3 Wärmestufen.', price: 59.99, image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&h=800&fit=crop'], category: 'schoenheit', tags: ['Profi', 'Ionen'], inStock: true },
  
  // Elektronik
  { id: '5', name: 'Wireless Noise-Cancelling Kopfhörer', description: 'Premium Over-Ear Kopfhörer mit 30h Akkulaufzeit.', price: 249.00, originalPrice: 299.00, discount: 17, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop'], category: 'elektronik', tags: ['Wireless', 'Premium'], inStock: true },
  { id: '6', name: 'Smart TV 55 Zoll 4K', description: '55 Zoll Ultra HD Smart TV mit HDR.', price: 549.00, originalPrice: 699.00, discount: 21, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=800&h=800&fit=crop'], category: 'elektronik', tags: ['Smart', '4K'], inStock: true },
  { id: '15', name: 'Smartwatch Fitness Pro', description: 'Fitness-Tracker mit GPS und 7 Tage Akku.', price: 199.00, originalPrice: 249.00, discount: 20, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop'], category: 'elektronik', tags: ['Smart', 'Fitness'], inStock: true },
  { id: '16', name: 'Bluetooth Lautsprecher', description: 'Tragbarer Lautsprecher mit sattem Bass.', price: 79.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop'], category: 'elektronik', tags: ['Bluetooth', 'Tragbar'], inStock: true },
  
  // Beleuchtung
  { id: '7', name: 'Smart LED Glühbirne Set', description: '4er Pack smarte RGB-Glühbirnen, App-gesteuert.', price: 49.99, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'], category: 'beleuchtung', tags: ['Smart', 'LED'], inStock: true },
  { id: '8', name: 'Design Stehlampe Modern', description: 'Elegante Stehlampe mit dimmbarem LED-Licht.', price: 129.00, originalPrice: 159.00, discount: 19, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop'], category: 'beleuchtung', tags: ['Design', 'Modern'], inStock: true },
  
  // Haus & Küche
  { id: '9', name: 'Küchenmaschine Multifunktion', description: 'Vielseitige Küchenmaschine zum Kneten und Mixen.', price: 249.00, originalPrice: 299.00, discount: 17, image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=800&fit=crop'], category: 'haus-kueche', tags: ['Multifunktion', 'Profi'], inStock: true },
  
  // Garten
  { id: '10', name: 'Akku-Rasenmäher 40V', description: 'Leiser, kabelloser Rasenmäher mit Mulchfunktion.', price: 349.00, originalPrice: 429.00, discount: 19, image: 'https://images.unsplash.com/photo-1590212151175-e58edd96185b?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1590212151175-e58edd96185b?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=800&fit=crop'], category: 'garten', tags: ['Akku', 'Leise'], inStock: true },
  
  // Schmuck
  { id: '11', name: 'Silber Halskette mit Anhänger', description: 'Elegante 925 Sterling Silber Halskette.', price: 49.99, originalPrice: 69.99, discount: 29, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop'], category: 'schmuck', tags: ['Silber', 'Elegant'], inStock: true },
  
  // Spielzeug
  { id: '12', name: 'LEGO Architektur Set', description: 'Detailliertes Baustein-Set für Sammler.', price: 89.99, originalPrice: 109.99, discount: 18, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&h=800&fit=crop'], category: 'spielzeug', tags: ['LEGO', 'Sammler'], inStock: true },
  
  // Kleidung
  { id: '13', name: 'Winter Daunenjacke', description: 'Warme, wasserabweisende Daunenjacke.', price: 179.00, originalPrice: 229.00, discount: 22, image: 'https://images.unsplash.com/photo-1544923246-77307dd628b4?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1544923246-77307dd628b4?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop'], category: 'kleidung', tags: ['Winter', 'Daunen'], inStock: true },
  
  // Sport & Outdoor
  { id: '14', name: 'Yoga Matte Premium', description: 'Rutschfeste, extra dicke Yogamatte.', price: 39.99, originalPrice: 49.99, discount: 20, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop'], category: 'sport-outdoor', tags: ['Yoga', 'Premium'], inStock: true },
  
  // Sex & Sinnlichkeit
  { id: '17', name: 'Romantisches Kerzen Set', description: 'Duftkerzen-Set für romantische Abende.', price: 29.99, originalPrice: 39.99, discount: 25, image: 'https://images.unsplash.com/photo-1602607135257-91c9dfa8db9f?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1602607135257-91c9dfa8db9f?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=800&fit=crop'], category: 'sex-sinnlichkeit', tags: ['Romantik', 'Duft'], inStock: true },
  { id: '18', name: 'Massage Öl Premium', description: 'Hochwertiges Massageöl mit ätherischen Ölen.', price: 19.99, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=800&fit=crop'], category: 'sex-sinnlichkeit', tags: ['Massage', 'Premium'], inStock: true },
  { id: '19', name: 'Seiden Kimono', description: 'Eleganter Kimono aus hochwertiger Seide.', price: 89.99, originalPrice: 119.99, discount: 25, image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop'], category: 'sex-sinnlichkeit', tags: ['Seide', 'Elegant'], inStock: true },
  
  // Speisen & Getränke
  { id: '20', name: 'Premium Rotwein Set', description: '3er Set ausgewählter Rotweine aus Italien.', price: 59.99, originalPrice: 79.99, discount: 25, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=800&fit=crop'], category: 'speisen-getraenke', tags: ['Wein', 'Premium'], inStock: true },
  { id: '21', name: 'Gourmet Schokoladen Box', description: 'Handgemachte Pralinen aus belgischer Schokolade.', price: 34.99, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop'], category: 'speisen-getraenke', tags: ['Schokolade', 'Gourmet'], inStock: true },
  { id: '22', name: 'Bio Tee Geschenkset', description: 'Exklusive Bio-Tee Kollektion mit 6 Sorten.', price: 24.99, originalPrice: 34.99, discount: 29, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800&h=800&fit=crop'], category: 'speisen-getraenke', tags: ['Bio', 'Tee'], inStock: true },
  { id: '23', name: 'Italienisches Olivenöl Extra Vergine', description: 'Kaltgepresstes Olivenöl aus der Toskana.', price: 18.99, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop'], category: 'speisen-getraenke', tags: ['Bio', 'Italien'], inStock: true },
];

export const banners = [
  {
    id: 1,
    title: 'NEUE KOLLEKTION',
    subtitle: 'FRÜHJAHRS-SALE',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop&q=80',
    link: '/category/kleidung',
  },
  {
    id: 2,
    title: 'BIS ZU 30%',
    subtitle: 'AUF ELEKTRONIK',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=500&fit=crop&q=80',
    link: '/category/elektronik',
  },
  {
    id: 3,
    title: 'OUTDOOR SAISON',
    subtitle: 'JETZT ENTDECKEN',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=500&fit=crop&q=80',
    link: '/category/sport-outdoor',
  },
];
