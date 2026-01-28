const express = require('express');
const DewaStore = require('../models/dewaStore');
const { generateQRCode, validateQRCode } = require('../services/qrCodeService');
const { findNearbyOffers } = require('../services/locationService');

const router = express.Router();

/**
 * Get all categories
 */
router.get('/categories', (req, res) => {
  try {
    const categories = DewaStore.getCategories();
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories'
    });
  }
});

/**
 * Browse offers (with filters)
 */
router.get('/offers', (req, res) => {
  try {
    const { categoryId, search, lat, lng, radius } = req.query;

    const filter = { status: 'active' };
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (search) {
      filter.search = search;
    }

    let offers = DewaStore.getOffers(filter);

    // Filter by location if coordinates provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lng);
      const radiusKm = radius ? parseFloat(radius) : 10;
      offers = findNearbyOffers(offers, userLat, userLon, radiusKm);
    }

    // Enrich with vendor and category info
    const enrichedOffers = offers.map(offer => {
      const vendor = DewaStore.getVendorById(offer.vendorId);
      const category = DewaStore.getCategoryById(offer.categoryId);
      return {
        ...offer,
        vendor: vendor ? {
          companyName: vendor.companyName,
          companyNameAr: vendor.companyNameAr,
          logo: vendor.logo
        } : null,
        category: category || null
      };
    });

    res.json({
      success: true,
      offers: enrichedOffers,
      total: enrichedOffers.length
    });

  } catch (error) {
    console.error('Browse offers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to browse offers'
    });
  }
});

/**
 * Get offer details
 */
router.get('/offers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const offer = DewaStore.getOfferById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }

    // Increment view count
    DewaStore.incrementOfferView(id);

    // Enrich with vendor and category info
    const vendor = DewaStore.getVendorById(offer.vendorId);
    const category = DewaStore.getCategoryById(offer.categoryId);

    res.json({
      success: true,
      offer: {
        ...offer,
        vendor: vendor ? {
          companyName: vendor.companyName,
          companyNameAr: vendor.companyNameAr,
          logo: vendor.logo,
          description: vendor.description,
          descriptionAr: vendor.descriptionAr,
          website: vendor.website
        } : null,
        category: category || null
      }
    });

  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve offer'
    });
  }
});

/**
 * Generate QR code for redemption
 */
router.post('/offers/:id/qr', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    const offer = DewaStore.getOfferById(id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }

    if (offer.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Offer is not active'
      });
    }

    // Check quota
    if (offer.quota && offer.redemptionCount >= offer.quota) {
      return res.status(400).json({
        success: false,
        error: 'Offer quota reached'
      });
    }

    // Generate QR code
    const qrData = generateQRCode(id, userId);

    res.json({
      success: true,
      qrCode: qrData.code,
      expiresIn: 300 // 5 minutes
    });

  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code'
    });
  }
});

/**
 * Redeem offer with QR code
 */
router.post('/redeem', requireAuth, (req, res) => {
  try {
    const { qrCode, location } = req.body;
    const userId = req.session.user.id;

    // Validate QR code
    const validation = validateQRCode(qrCode);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { offerId } = validation.data;

    // Get offer
    const offer = DewaStore.getOfferById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }

    // Check quota
    if (offer.quota && offer.redemptionCount >= offer.quota) {
      return res.status(400).json({
        success: false,
        error: 'Offer quota reached'
      });
    }

    // Create redemption
    const redemption = DewaStore.createRedemption({
      offerId,
      userId,
      vendorId: offer.vendorId,
      qrCode,
      location
    });

    res.json({
      success: true,
      message: 'Offer redeemed successfully!',
      redemption: {
        id: redemption.id,
        offer: {
          title: offer.title,
          discountType: offer.discountType,
          discountValue: offer.discountValue
        },
        redeemedAt: redemption.redeemedAt
      }
    });

  } catch (error) {
    console.error('Redeem offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to redeem offer'
    });
  }
});

/**
 * Get user's favorites
 */
router.get('/favorites', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.id;
    const favoriteIds = DewaStore.getFavorites(userId);
    
    const favorites = favoriteIds
      .map(id => DewaStore.getOfferById(id))
      .filter(offer => offer && offer.status === 'active')
      .map(offer => {
        const vendor = DewaStore.getVendorById(offer.vendorId);
        const category = DewaStore.getCategoryById(offer.categoryId);
        return {
          ...offer,
          vendor: vendor ? {
            companyName: vendor.companyName,
            logo: vendor.logo
          } : null,
          category: category || null
        };
      });

    res.json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve favorites'
    });
  }
});

/**
 * Add to favorites
 */
router.post('/favorites/:offerId', requireAuth, (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.session.user.id;

    const offer = DewaStore.getOfferById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }

    DewaStore.addFavorite(userId, offerId);

    res.json({
      success: true,
      message: 'Added to favorites'
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add favorite'
    });
  }
});

/**
 * Remove from favorites
 */
router.delete('/favorites/:offerId', requireAuth, (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.session.user.id;

    DewaStore.removeFavorite(userId, offerId);

    res.json({
      success: true,
      message: 'Removed from favorites'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove favorite'
    });
  }
});

/**
 * Get user's redemption history
 */
router.get('/redemptions', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.id;
    const redemptions = DewaStore.getRedemptions({ userId });

    // Enrich with offer details
    const enrichedRedemptions = redemptions.map(r => {
      const offer = DewaStore.getOfferById(r.offerId);
      const vendor = offer ? DewaStore.getVendorById(offer.vendorId) : null;
      
      return {
        ...r,
        offer: offer ? {
          title: offer.title,
          titleAr: offer.titleAr,
          discountType: offer.discountType,
          discountValue: offer.discountValue
        } : null,
        vendor: vendor ? {
          companyName: vendor.companyName,
          companyNameAr: vendor.companyNameAr
        } : null
      };
    });

    res.json({
      success: true,
      redemptions: enrichedRedemptions
    });

  } catch (error) {
    console.error('Get redemptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve redemptions'
    });
  }
});

/**
 * Middleware to require user authentication
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  next();
}

module.exports = router;
