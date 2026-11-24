export const MOCK_CATEGORIES = [
  { _id: 'cat_fv', id: 'cat_fv', name: 'Fruits & Vegetables', image: '/assets/Apple.jpg', icon: 'Apple', isActive: true },
  { _id: 'cat_db', id: 'cat_db', name: 'Dairy & Breakfast', image: '/assets/Milk.jpg', icon: 'Milk', isActive: true },
  { _id: 'cat_munch', id: 'cat_munch', name: 'Munchies', image: '/assets/Lays%20Chips.jpg', icon: 'Cookie', isActive: true },
  { _id: 'cat_drinks', id: 'cat_drinks', name: 'Cold Drinks', image: '/assets/Coca%20Cola.jpg', icon: 'Coffee', isActive: true },
  { _id: 'cat_sweets', id: 'cat_sweets', name: 'Sweet Cravings', image: '/assets/Dairy%20Milk.jpg', icon: 'Candy', isActive: true },
  { _id: 'cat_clean', id: 'cat_clean', name: 'Cleaning & Household', image: '/assets/Floor%20Cleaner.jpg', icon: 'Sparkles', isActive: true },
  { _id: 'cat_instant', id: 'cat_instant', name: 'Frozen & Instant Food', image: '/assets/Frozen%20Peas.jpg', icon: 'Package', isActive: true },
  { _id: 'cat_dry', id: 'cat_dry', name: 'Dry Fruits & Nuts', image: '/assets/Almonds.jpg', icon: 'Nut', isActive: true }
];

export const MOCK_BANNERS = [
  {
    _id: 'b1',
    id: 'b1',
    title: 'Instant 10 Min Grocery Delivery',
    subtitle: 'Fresh veggies, dairy & essentials at your doorstep',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    position: 'hero',
    category: 'home',
    isActive: true,
    order: 1
  },
  {
    _id: 'b2',
    id: 'b2',
    title: 'Flat 50% Off on Fresh Fruits',
    subtitle: 'Farm fresh apples, oranges, bananas & more',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    position: 'hero',
    category: 'home',
    isActive: true,
    order: 2
  }
];

export const MOCK_STORES = [
  {
    _id: 'store_1',
    id: 'store_1',
    name: 'Quick Commerce Supermart',
    category: 'Groceries',
    rating: 4.8,
    deliveryTime: '10-15 mins',
    costForTwo: 300,
    featured: true,
    isActive: true,
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    distance: 1.2,
    address: 'Connaught Place, New Delhi'
  },
  {
    _id: 'store_2',
    id: 'store_2',
    name: 'Fresh Dairy & Daily Needs',
    category: 'Dairy',
    rating: 4.9,
    deliveryTime: '10 mins',
    costForTwo: 200,
    featured: true,
    isActive: true,
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    distance: 1.8,
    address: 'Barakhamba Road, New Delhi'
  }
];

export const MOCK_PRODUCTS = [
  { _id: 'p1', id: 'p1', name: 'Fresh Red Apples', price: 140, originalPrice: 180, weight: '1 kg', category: { _id: 'cat_fv', name: 'Fruits & Vegetables' }, image: '/assets/Apple.jpg', rating: 4.8, inStock: true },
  { _id: 'p2', id: 'p2', name: 'Robusta Bananas', price: 45, originalPrice: 60, weight: '500 g', category: { _id: 'cat_fv', name: 'Fruits & Vegetables' }, image: '/assets/Banana.jpg', rating: 4.7, inStock: true },
  { _id: 'p3', id: 'p3', name: 'Fresh Green Broccoli', price: 90, originalPrice: 120, weight: '500 g', category: { _id: 'cat_fv', name: 'Fruits & Vegetables' }, image: '/assets/Broccoli.jpg', rating: 4.9, inStock: true },
  { _id: 'p4', id: 'p4', name: 'Farm Fresh Tomatoes', price: 35, originalPrice: 50, weight: '1 kg', category: { _id: 'cat_fv', name: 'Fruits & Vegetables' }, image: '/assets/Tomato.jpg', rating: 4.6, inStock: true },
  { _id: 'p5', id: 'p5', name: 'Fresh Onions', price: 40, originalPrice: 55, weight: '1 kg', category: { _id: 'cat_fv', name: 'Fruits & Vegetables' }, image: '/assets/Onion2.jpg', rating: 4.7, inStock: true },
  { _id: 'p6', id: 'p6', name: 'Amul Taaza Toned Milk', price: 32, originalPrice: 35, weight: '500 ml', category: { _id: 'cat_db', name: 'Dairy & Breakfast' }, image: '/assets/Milk.jpg', rating: 4.9, inStock: true },
  { _id: 'p7', id: 'p7', name: 'Amul Salted Butter', price: 58, originalPrice: 65, weight: '100 g', category: { _id: 'cat_db', name: 'Dairy & Breakfast' }, image: '/assets/Butter.jpg', rating: 4.9, inStock: true },
  { _id: 'p8', id: 'p8', name: 'Amul Malai Paneer', price: 95, originalPrice: 110, weight: '200 g', category: { _id: 'cat_db', name: 'Dairy & Breakfast' }, image: '/assets/Paneer.jpg', rating: 4.8, inStock: true },
  { _id: 'p9', id: 'p9', name: 'Lay\'s Classic Salted', price: 20, originalPrice: 20, weight: '50 g', category: { _id: 'cat_munch', name: 'Munchies' }, image: '/assets/Lays%20Chips.jpg', rating: 4.7, inStock: true },
  { _id: 'p10', id: 'p10', name: 'Kurkure Masala Munch', price: 20, originalPrice: 20, weight: '85 g', category: { _id: 'cat_munch', name: 'Munchies' }, image: '/assets/Kurkure.jpg', rating: 4.8, inStock: true },
  { _id: 'p11', id: 'p11', name: 'Coca-Cola Can', price: 40, originalPrice: 40, weight: '300 ml', category: { _id: 'cat_drinks', name: 'Cold Drinks' }, image: '/assets/Coca%20Cola.jpg', rating: 4.8, inStock: true },
  { _id: 'p12', id: 'p12', name: 'Sprite Lemon Lime Drink', price: 40, originalPrice: 40, weight: '300 ml', category: { _id: 'cat_drinks', name: 'Cold Drinks' }, image: '/assets/Sprite.jpg', rating: 4.7, inStock: true },
  { _id: 'p13', id: 'p13', name: 'Cadbury Dairy Milk Silk', price: 85, originalPrice: 95, weight: '60 g', category: { _id: 'cat_sweets', name: 'Sweet Cravings' }, image: '/assets/Dairy%20Milk.jpg', rating: 4.9, inStock: true },
  { _id: 'p14', id: 'p14', name: 'Nestle KitKat Share Bag', price: 60, originalPrice: 70, weight: '4 fingered', category: { _id: 'cat_sweets', name: 'Sweet Cravings' }, image: '/assets/KitKat.jpg', rating: 4.8, inStock: true },
  { _id: 'p15', id: 'p15', name: 'Lizol Disinfectant Floor Cleaner', price: 110, originalPrice: 130, weight: '500 ml', category: { _id: 'cat_clean', name: 'Cleaning & Household' }, image: '/assets/Floor%20Cleaner.jpg', rating: 4.8, inStock: true },
  { _id: 'p16', id: 'p16', name: 'Harpic Toilet Cleaner Power Plus', price: 99, originalPrice: 115, weight: '500 ml', category: { _id: 'cat_clean', name: 'Cleaning & Household' }, image: '/assets/Toilet%20Cleaner.jpg', rating: 4.9, inStock: true },
  { _id: 'p17', id: 'p17', name: 'Green Frozen Green Peas', price: 75, originalPrice: 95, weight: '500 g', category: { _id: 'cat_instant', name: 'Frozen & Instant Food' }, image: '/assets/Frozen%20Peas.jpg', rating: 4.7, inStock: true },
  { _id: 'p18', id: 'p18', name: 'California Premium Almonds', price: 299, originalPrice: 380, weight: '250 g', category: { _id: 'cat_dry', name: 'Dry Fruits & Nuts' }, image: '/assets/Almonds.jpg', rating: 4.9, inStock: true }
];

