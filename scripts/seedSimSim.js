import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Store from '../models/Store.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ajay:Simsim%4012345@cluster0.ylzsyef.mongodb.net/simsim?retryWrites=true&w=majority';

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Atlas successfully!');

    // 1. Create Default Admin User
    let admin = await User.findOne({ email: 'admin@simsim.com' });
    if (!admin) {
      admin = await User.create({
        name: 'SimSim Admin',
        email: 'admin@simsim.com',
        phone: '9876543210',
        password: 'AdminPassword@123',
        role: 'admin',
        isVerified: true
      });
      console.log('Created Admin: admin@simsim.com');
    }

    // 2. Create Default SimSim Dark Store
    let store = await Store.findOne({ name: 'SimSim Dark Store (Noida Central)' });
    if (!store) {
      store = await Store.create({
        name: 'SimSim Dark Store (Noida Central)',
        description: 'SimSim 10-Minute Express Dark Store Hub - Fresh vegetables, dairy & groceries.',
        bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        storeType: 'grocery',
        rating: 4.9,
        reviewsCount: 342,
        deliveryTime: 10,
        distance: 1.2,
        isActive: true,
        featured: true,
        status: 'approved',
        owner: admin._id
      });
      console.log('Created SimSim Dark Store!');
    }

    // 3. Create Categories
    const categoriesData = [
      { name: 'Fruits & Vegetables', icon: '🥦', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80' },
      { name: 'Dairy & Milk', icon: '🥛', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80' },
      { name: 'Bakery & Biscuits', icon: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
      { name: 'Beverages & Drinks', icon: '🧃', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80' },
      { name: 'Snacks & Munchies', icon: '🍿', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Instant Food', icon: '🍜', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80' },
      { name: 'Personal Care', icon: '🧴', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
      { name: 'Household Essentials', icon: '🧼', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80' }
    ];

    const categoryMap = {};
    for (const c of categoriesData) {
      let cat = await Category.findOne({ name: c.name });
      if (!cat) {
        cat = await Category.create(c);
      }
      categoryMap[c.name] = cat._id;
    }
    console.log('Categories created/verified!');

    // 4. Products Data
    const productsData = [
      {
        name: 'Fresh Hybrid Tomatoes',
        description: 'Locally grown, pesticide-free fresh ripe tomatoes.',
        price: 35,
        originalPrice: 45,
        discount: '22% OFF',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Fruits & Vegetables'],
        store: store._id,
        isPopular: true,
        rating: 4.8
      },
      {
        name: 'Fresh Jyoti Potato',
        description: 'Farm-fresh premium quality Jyoti potatoes, thin skin and great taste.',
        price: 30,
        originalPrice: 40,
        discount: '25% OFF',
        weight: '1 kg',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Fruits & Vegetables'],
        store: store._id,
        isPopular: true,
        rating: 4.7
      },
      {
        name: 'Kashmir Royal Apples',
        description: 'Crisp, sweet, juicy red Kashmiri apples.',
        price: 120,
        originalPrice: 160,
        discount: '25% OFF',
        weight: '4 pcs (approx 600g)',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Fruits & Vegetables'],
        store: store._id,
        isPopular: true,
        rating: 4.9
      },
      {
        name: 'Fresh Green Seedless Grapes',
        description: 'Crunchy sweet green grapes directly sourced from Nashik.',
        price: 85,
        originalPrice: 110,
        discount: '23% OFF',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Fruits & Vegetables'],
        store: store._id,
        isPopular: true,
        rating: 4.6
      },
      {
        name: 'Amul Taaza Homogenised Toned Milk',
        description: 'Pasteurized toned milk with vitamins A & D, wholesome and fresh.',
        price: 27,
        originalPrice: 28,
        discount: '4% OFF',
        weight: '500ml',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Dairy & Milk'],
        store: store._id,
        isPopular: true,
        rating: 4.9
      },
      {
        name: 'Amul Salted Butter',
        description: 'Classic delicious creamy golden butter.',
        price: 56,
        originalPrice: 60,
        discount: '7% OFF',
        weight: '100g',
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Dairy & Milk'],
        store: store._id,
        isPopular: true,
        rating: 4.9
      },
      {
        name: 'Fresh Malai Paneer',
        description: 'Soft, melt-in-the-mouth paneer cubes rich in protein.',
        price: 85,
        originalPrice: 100,
        discount: '15% OFF',
        weight: '200g',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Dairy & Milk'],
        store: store._id,
        isPopular: true,
        rating: 4.8
      },
      {
        name: 'Dutch Truffle Pastry',
        description: 'Decadent chocolate sponge layered with rich dark chocolate ganache.',
        price: 75,
        originalPrice: 95,
        discount: '21% OFF',
        weight: '1 pc (120g)',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Bakery & Biscuits'],
        store: store._id,
        isPopular: true,
        rating: 4.9
      },
      {
        name: 'Rich Choco Chip Cookies',
        description: 'Oven-baked crunchy cookies packed with Belgian chocolate chips.',
        price: 60,
        originalPrice: 80,
        discount: '25% OFF',
        weight: '200g pack',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Bakery & Biscuits'],
        store: store._id,
        isPopular: true,
        rating: 4.7
      },
      {
        name: 'Traditional Kaju Katli',
        description: 'Pure cashew sweet with silver foil, festive premium delicacy.',
        price: 199,
        originalPrice: 250,
        discount: '20% OFF',
        weight: '250g box',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Bakery & Biscuits'],
        store: store._id,
        isPopular: true,
        rating: 4.9
      },
      {
        name: 'Coca-Cola Zero Sugar Can',
        description: 'Refreshing sparkling soft drink with zero sugar and crisp taste.',
        price: 40,
        originalPrice: 40,
        discount: '0% OFF',
        weight: '300ml',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Beverages & Drinks'],
        store: store._id,
        isPopular: true,
        rating: 4.8
      },
      {
        name: 'Maggi 2-Minute Masala Noodles',
        description: 'Favorite Indian instant noodles made with authentic spices.',
        price: 14,
        originalPrice: 14,
        discount: '0% OFF',
        weight: '70g pack',
        image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
        category: categoryMap['Instant Food'],
        store: store._id,
        isPopular: true,
        rating: 4.9
      }
    ];

    for (const p of productsData) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
      }
    }
    console.log('Products created/verified!');

    // 5. Create Default Coupons
    const couponsData = [
      {
        code: 'SIMSIM60',
        discountType: 'percentage',
        discountValue: 60,
        maxDiscount: 120,
        minOrderValue: 149,
        isActive: true,
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        code: 'WELCOME50',
        discountType: 'percentage',
        discountValue: 50,
        maxDiscount: 100,
        minOrderValue: 120,
        isActive: true,
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        code: 'FREEDEL',
        discountType: 'flat',
        discountValue: 30,
        maxDiscount: 30,
        minOrderValue: 99,
        isActive: true,
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const cp of couponsData) {
      const exists = await Coupon.findOne({ code: cp.code });
      if (!exists) {
        await Coupon.create(cp);
      }
    }
    console.log('Coupons created/verified!');

    const prodCount = await Product.countDocuments();
    const catCount = await Category.countDocuments();
    console.log(`\n🎉 SEED COMPLETED SUCCESSFULLY!`);
    console.log(`- Categories in DB: ${catCount}`);
    console.log(`- Products in DB: ${prodCount}`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
