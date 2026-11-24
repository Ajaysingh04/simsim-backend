import mongoose from 'mongoose';
import Settings from '../models/Settings.js';

const DEFAULT_SETTINGS = {
  siteTitle: 'RoseDash',
  adminHeaderText: 'RoseDash Admin',
  adminHeaderColor: '',
  faviconUrl: '',
  logoUrl: '/assets/RoshDash.png',
  primaryColor: '#10b981',
  customCharges: []
};

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(DEFAULT_SETTINGS);
    }
    let settings = await Settings.findOne();
    if (!settings) {
      settings = DEFAULT_SETTINGS;
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(200).json(DEFAULT_SETTINGS);
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ ...DEFAULT_SETTINGS, ...req.body });
    }
    const { siteTitle, adminHeaderText, adminHeaderColor, faviconUrl, logoUrl, primaryColor, contactEmail, contactPhone, contactAddress, socialLinks, globalNotice } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({});
    }
    
    if (siteTitle !== undefined) settings.siteTitle = siteTitle;
    if (adminHeaderText !== undefined) settings.adminHeaderText = adminHeaderText;
    if (adminHeaderColor !== undefined) settings.adminHeaderColor = adminHeaderColor;
    if (faviconUrl !== undefined) settings.faviconUrl = faviconUrl;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (contactAddress !== undefined) settings.contactAddress = contactAddress;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;
    if (globalNotice !== undefined) settings.globalNotice = globalNotice;

    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(200).json({ ...DEFAULT_SETTINGS, ...req.body });
  }
};
