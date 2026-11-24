import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

// AI Product Recommendations
export const getAIRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch user search history and wishlist to tailor recommendations
    const user = await User.findById(userId).populate('wishlist');
    const searchTerms = user?.searchHistory || [];
    const wishlistIds = user?.wishlist?.map(item => item._id) || [];

    // 2. Based on previous orders
    const prevOrders = await Order.find({ user: userId, status: 'delivered' })
      .populate('items.product')
      .limit(5);

    let favoriteCategories = [];
    prevOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.category) {
          favoriteCategories.push(item.product.category.toString());
        }
      });
    });

    // Unique categories
    favoriteCategories = [...new Set(favoriteCategories)];

    // Fetch products matching these categories
    let basedOnOrders = [];
    if (favoriteCategories.length > 0) {
      basedOnOrders = await Product.find({
        category: { $in: favoriteCategories },
        inStock: true
      }).limit(5);
    } else {
      // Fallback to top-rated
      basedOnOrders = await Product.find({ rating: { $gte: 4 }, inStock: true }).limit(5);
    }

    // 3. Recommended for you (Wishlist + matches search terms)
    let recommendedForYou = [];
    if (searchTerms.length > 0) {
      // Search matching product names/description
      const regexQueries = searchTerms.map(term => new RegExp(term, 'i'));
      recommendedForYou = await Product.find({
        $or: [
          { name: { $in: regexQueries } },
          { description: { $in: regexQueries } }
        ],
        inStock: true
      }).limit(5);
    }

    // Combine with wishlist items or high-rated if empty
    if (recommendedForYou.length < 3) {
      const extra = await Product.find({
        _id: { $nin: recommendedForYou.map(f => f._id) },
        rating: { $gte: 4 },
        inStock: true
      }).limit(5 - recommendedForYou.length);
      recommendedForYou = [...recommendedForYou, ...extra];
    }

    // 4. You may like this (Popular items excluding what they already ordered)
    const youMayLike = await Product.find({
      rating: { $gte: 4.5 },
      inStock: true
    }).limit(5);

    res.status(200).json({
      success: true,
      basedOnOrders,
      recommendedForYou,
      youMayLike
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mood and Meal Planner filters
export const getFilteredProducts = async (req, res) => {
  try {
    const { mood, dietGoal } = req.query;
    let filter = { inStock: true };

    if (mood) {
      filter.mood = { $in: [mood] };
    }
    if (dietGoal) {
      filter.dietGoal = { $in: [dietGoal] };
    }

    const products = await Product.find(filter).populate('store').populate('category');
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// "I Can't Decide" - Surprise Product Recommender
export const getSurpriseProduct = async (req, res) => {
  try {
    const count = await Product.countDocuments({ inStock: true });
    if (count === 0) {
      return res.status(404).json({ success: false, message: 'No product items found' });
    }
    const randomIndex = Math.floor(Math.random() * count);
    const randomProduct = await Product.findOne({ inStock: true })
      .skip(randomIndex)
      .populate('store')
      .populate('category');

    res.status(200).json({ success: true, data: randomProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Google Gemini API integration (Free Tier via Google AI Studio)
const getGeminiApiKey = () => {
  const envKey = Object.keys(process.env).find(k => 
    k.toLowerCase() === 'gemini_api_key' || 
    k.toLowerCase() === 'gemini_key' || 
    k.toLowerCase() === 'google_api_key' ||
    k.toLowerCase() === 'gemini'
  );
  return envKey ? process.env[envKey] : null;
};

const callGeminiAI = async (userPrompt) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim().length === 0) {
    console.log('[AI Chef] GEMINI_API_KEY is not set or empty in environment.');
    return { text: null, reason: 'KEY_NOT_SET' };
  }

  const systemInstruction = `You are "SimSim AI Chef & Quick Grocery Assistant" for SimSim, an instant 10-minute grocery delivery app in India.
Your role:
1. Help customers with cooking recipes, step-by-step instructions, and quick meal ideas (under 15-20 minutes).
2. Recommend grocery ingredients available in an Indian supermarket (e.g. Amul Milk, Butter, Paneer, Curd, Fresh Tomatoes, Potatoes, Onions, Kashmiri Apples, Bread, Atta, Kurkure, Lays, Coca Cola, etc.).
3. When suggesting ingredients, bold the item names (e.g. **Fresh Farm Tomato**, **Amul Butter**, **Malai Paneer**) and mention they can order all of them on SimSim in 10 minutes.
4. If asked in Hindi, respond in friendly, natural Hindi or Hinglish. If asked in English, respond in English.
5. Keep responses concise, well-structured with bullet points and friendly emojis (⚡, 🥦, 🥘, 🍎, 🛒).`;

  const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nCustomer question: ${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AI Chef] Model ${model} call failed (${response.status}):`, errText);
        continue;
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) {
        return { text: replyText.trim(), modelUsed: model };
      }
    } catch (error) {
      console.error(`[AI Chef] Error querying ${model}:`, error.message);
    }
  }

  return { text: null, reason: 'ALL_MODELS_FAILED' };
};

// AI Chatbot Assistant handler
export const handleChatBot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id;
    const cleanMsg = (message || '').toLowerCase();

    // 0. Check ADD TO CART / ORDER intent
    if (cleanMsg.startsWith('add ') || cleanMsg.startsWith('order ') || cleanMsg.includes('to cart')) {
      let searchItem = cleanMsg.replace(/add /g, '').replace(/order /g, '').replace(/to cart/g, '').replace(/please/g, '').trim();
      
      if (searchItem) {
        // Find best matching product
        const regex = new RegExp(searchItem, 'i');
        const productItem = await Product.findOne({ 
          $or: [{ name: regex }, { description: regex }],
          inStock: true 
        }).populate('store');

        if (productItem) {
          return res.status(200).json({
            reply: `I found **${productItem.name}** for ₹${productItem.price}. I've added it to your cart! 🛒`,
            action: 'ADD_TO_CART',
            payload: {
              id: productItem._id,
              name: productItem.name,
              price: productItem.price,
              image: productItem.image,
              isVeg: productItem.isVeg,
              resId: productItem.store?._id || 'store_simsim',
              resName: productItem.store?.name || 'SimSim Quick Dark Store'
            }
          });
        }
      }
    }

    // 1. Check order query
    if (userId && (cleanMsg.includes('order') || cleanMsg.includes('status') || cleanMsg.includes('track') || cleanMsg.includes('where is my order'))) {
      const latestOrder = await Order.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .populate('store');

      if (latestOrder) {
        return res.status(200).json({
          reply: `Your latest order from **${latestOrder.store?.name || 'SimSim Store'}** is currently **${latestOrder.status.toUpperCase()}**.\n- Total bill: ₹${latestOrder.billDetails?.grandTotal || latestOrder.totalAmount}\n- Order placed: ${new Date(latestOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\nTap **Track Live Order** in your Profile to view live GPS tracking!`
        });
      }
    }

    // 2. Check coupon query
    if (cleanMsg.includes('coupon') || cleanMsg.includes('code') || cleanMsg.includes('discount') || cleanMsg.includes('offer')) {
      const coupons = await Coupon.find({ isActive: true }).limit(3);
      if (coupons.length > 0) {
        let couponList = coupons.map(c => `- **${c.code}**: Get ${c.discountPercent}% off on orders above ₹${c.minOrderValue || 0}`).join('\n');
        return res.status(200).json({
          reply: `Here are active discount coupons you can apply at checkout:\n\n${couponList}\n\nApply them at checkout to save instantly!`
        });
      }
    }

    // 3. Invoke Google Gemini Free AI
    const geminiResult = await callGeminiAI(message);
    if (geminiResult && geminiResult.text) {
      return res.status(200).json({
        reply: geminiResult.text,
        model: geminiResult.modelUsed
      });
    }

    // 4. Smart fallback if GEMINI_API_KEY is not configured or offline
    if (cleanMsg.includes('paneer')) {
      return res.status(200).json({
        reply: "🥘 **Paneer Butter Masala (Quick 15-Min Recipe)**:\n1. Sauté cumin, ginger-garlic paste and onions in butter.\n2. Add pureed tomatoes, cashew paste, turmeric, red chilli & garam masala.\n3. Simmer until aromatic, stir in fresh cream and soft paneer cubes.\n\n🛒 **Ingredients on SimSim**: **Fresh Malai Paneer**, **Amul Butter**, **Tomatoes**, **Cream** (Delivered in 10 mins)!\n\nType **'Add paneer to cart'** to auto-add!"
      });
    }

    if (cleanMsg.includes('salad') || cleanMsg.includes('healthy')) {
      return res.status(200).json({
        reply: "🥗 **Farm-Fresh Green Detox Salad**:\n- 1 cup diced crunchy Cucumbers & Carrots\n- 1/2 cup fresh Cherry Tomatoes\n- Crisp baby Spinach leaves\n- Dressing: Olive oil, lemon juice & pink salt.\n\nAll organic ingredients delivered in 10 minutes from SimSim!"
      });
    }

    // Default friendly AI persona
    res.status(200).json({
      reply: "Namaste! I am **SimSim AI Chef & Grocery Assistant** powered by Gemini! ⚡🥦\n\nAsk me anything! For example:\n- **'Paneer Butter Masala recipe'**\n- **'Healthy breakfast ideas'**\n- **'Add fresh tomatoes to cart'**\n- **'Active coupons'**\n\nWhat can I help you cook or order today?"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
