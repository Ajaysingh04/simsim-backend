import express from 'express';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import {
  getAIRecommendations,
  getFilteredProducts,
  getSurpriseProduct,
  handleChatBot
} from '../controllers/aiController.js';
import {
  createGroupCart,
  joinGroupCart,
  addToGroupCart,
  splitBill,
  lockGroupCart
} from '../controllers/groupController.js';
import {
  spinWheel,
  getRewardsInfo
} from '../controllers/rewardsController.js';
import {
  toggleFollowUser,
  toggleLikeReview,
  addCommentToReview,
  getSocialFeed,
  createSocialReview
} from '../controllers/socialController.js';
import User from '../models/User.js';

const router = express.Router();

// --- AI & Recommendations ---
router.get('/ai/status', (req, res) => {
  const envKey = Object.keys(process.env).find(k => 
    k.toLowerCase() === 'gemini_api_key' || 
    k.toLowerCase() === 'gemini_key' || 
    k.toLowerCase() === 'google_api_key' ||
    k.toLowerCase() === 'gemini'
  );
  const key = envKey ? process.env[envKey] : null;
  res.json({
    status: 'online',
    detectedKeyName: envKey,
    hasGeminiKey: Boolean(key && key !== 'your_gemini_api_key' && key.trim().length > 0),
    keyPrefix: key ? (key.substring(0, 6) + '...') : null,
    keyLength: key ? key.length : 0
  });
});

router.get('/ai/test-key', async (req, res) => {
  const envKey = Object.keys(process.env).find(k => 
    k.toLowerCase() === 'gemini_api_key' || 
    k.toLowerCase() === 'gemini_key' || 
    k.toLowerCase() === 'google_api_key' ||
    k.toLowerCase() === 'gemini'
  );
  const key = envKey ? process.env[envKey] : null;
  if (!key) return res.json({ error: 'No key found' });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key.trim()}`;
    const testRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Say Hello in one word' }] }] })
    });
    const text = await testRes.text();
    res.json({
      googleStatus: testRes.status,
      googleResponse: text
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});
router.get('/ai/recommendations', protect, getAIRecommendations);
router.get('/ai/filter', getFilteredProducts);
router.get('/ai/surprise', getSurpriseProduct);
router.post('/ai/chatbot', optionalProtect, handleChatBot);

// --- Group Ordering ---
router.post('/group/create', protect, createGroupCart);
router.post('/group/join', protect, joinGroupCart);
router.post('/group/add', protect, addToGroupCart);
router.get('/group/split/:code', protect, splitBill);
router.post('/group/lock', protect, lockGroupCart);

// --- Rewards & Spin Wheel ---
router.post('/rewards/spin', protect, spinWheel);
router.get('/rewards/info', protect, getRewardsInfo);

// --- Social Features ---
router.post('/social/follow', protect, toggleFollowUser);
router.post('/social/like', protect, toggleLikeReview);
router.post('/social/comment', protect, addCommentToReview);
router.get('/social/feed', getSocialFeed);
router.post('/social/review', protect, createSocialReview);

// --- Subscription Plan ---
router.post('/subscription/subscribe', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.subscription.plan = 'monthly_premium';
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);
    user.subscription.expiresAt = expireDate;

    if (!user.loyalty.badges.includes('Pro Member')) {
      user.loyalty.badges.push('Pro Member');
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: 'Subscribed to RoseDash Pro successfully!',
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
