const express = require('express');
const DewaStore = require('../models/dewaStore');
const { hashPassword, verifyPassword } = require('../services/authService');

const router = express.Router();

/**
 * Vendor Registration
 */
router.post('/register', async (req, res) => {
  try {
    const { companyName, companyNameAr, email, phone, contactPerson, password, description, descriptionAr, website } = req.body;

    // Check if vendor already exists
    const existingVendor = DewaStore.getVendorByEmail(email);
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        error: 'Vendor with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create vendor
    const vendor = DewaStore.createVendor({
      companyName,
      companyNameAr,
      email,
      phone,
      contactPerson,
      description,
      descriptionAr,
      website,
      passwordHash
    });

    res.json({
      success: true,
      message: 'Vendor registration successful. Awaiting approval.',
      vendor: {
        id: vendor.id,
        companyName: vendor.companyName,
        email: vendor.email,
        status: vendor.status
      }
    });

  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

/**
 * Vendor Login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = DewaStore.getVendorByEmail(email);
    
    if (!vendor) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if vendor is approved
    if (vendor.status === 'pending') {
      return res.status(403).json({
        success: false,
        error: 'Your account is pending approval'
      });
    }

    if (vendor.status === 'rejected' || vendor.status === 'blocked') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been ' + vendor.status
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, vendor.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Create vendor session
    req.session.vendor = {
      id: vendor.id,
      companyName: vendor.companyName,
      email: vendor.email,
      role: 'vendor'
    };

    res.json({
      success: true,
      message: 'Login successful',
      vendor: req.session.vendor
    });

  } catch (error) {
    console.error('Vendor login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * Get Vendor Dashboard Data
 */
router.get('/dashboard', requireVendorAuth, (req, res) => {
  try {
    const vendorId = req.session.vendor.id;
    const vendor = DewaStore.getVendorById(vendorId);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    // Get vendor's offers
    const offers = DewaStore.getOffers({ vendorId });
    const redemptions = DewaStore.getRedemptions({ vendorId });

    const stats = {
      totalOffers: offers.length,
      activeOffers: offers.filter(o => o.status === 'active').length,
      pendingOffers: offers.filter(o => o.status === 'pending').length,
      totalRedemptions: redemptions.length,
      totalViews: offers.reduce((sum, o) => sum + o.viewCount, 0)
    };

    res.json({
      success: true,
      vendor: {
        ...vendor,
        passwordHash: undefined // Don't send password hash
      },
      stats,
      recentOffers: offers.slice(0, 5),
      recentRedemptions: redemptions.slice(0, 10)
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard'
    });
  }
});

/**
 * Create New Offer
 */
router.post('/offers', requireVendorAuth, (req, res) => {
  try {
    const vendorId = req.session.vendor.id;
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      categoryId,
      discountType,
      discountValue,
      originalPrice,
      locations,
      startDate,
      endDate,
      terms,
      termsAr,
      quota
    } = req.body;

    const offer = DewaStore.createOffer({
      vendorId,
      title,
      titleAr,
      description,
      descriptionAr,
      categoryId,
      discountType,
      discountValue,
      originalPrice,
      locations,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      terms,
      termsAr,
      quota,
      createdBy: 'vendor'
    });

    res.json({
      success: true,
      message: 'Offer created successfully. Awaiting approval.',
      offer
    });

  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create offer'
    });
  }
});

/**
 * Get Vendor's Offers
 */
router.get('/offers', requireVendorAuth, (req, res) => {
  try {
    const vendorId = req.session.vendor.id;
    const { status } = req.query;

    const filter = { vendorId };
    if (status) {
      filter.status = status;
    }

    const offers = DewaStore.getOffers(filter);

    res.json({
      success: true,
      offers
    });

  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve offers'
    });
  }
});

/**
 * Update Offer
 */
router.put('/offers/:id', requireVendorAuth, (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.session.vendor.id;
    
    const offer = DewaStore.getOfferById(id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }

    // Verify ownership
    if (offer.vendorId !== vendorId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to update this offer'
      });
    }

    // Update offer (requires re-approval)
    const updates = { ...req.body, status: 'pending', updatedAt: new Date() };
    const updatedOffer = DewaStore.updateOffer(id, updates);

    res.json({
      success: true,
      message: 'Offer updated. Awaiting re-approval.',
      offer: updatedOffer
    });

  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update offer'
    });
  }
});

/**
 * Get Vendor's Redemptions
 */
router.get('/redemptions', requireVendorAuth, (req, res) => {
  try {
    const vendorId = req.session.vendor.id;
    const redemptions = DewaStore.getRedemptions({ vendorId });

    // Enrich with offer details
    const enrichedRedemptions = redemptions.map(r => {
      const offer = DewaStore.getOfferById(r.offerId);
      return {
        ...r,
        offer: offer ? {
          title: offer.title,
          discountType: offer.discountType,
          discountValue: offer.discountValue
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
 * Vendor Logout
 */
router.post('/logout', (req, res) => {
  delete req.session.vendor;
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * Middleware to require vendor authentication
 */
function requireVendorAuth(req, res, next) {
  if (!req.session || !req.session.vendor) {
    return res.status(401).json({
      success: false,
      error: 'Vendor authentication required'
    });
  }
  next();
}

module.exports = router;
