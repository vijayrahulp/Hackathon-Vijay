const express = require('express');
const DewaStore = require('../models/dewaStore');
const { hashPassword } = require('../services/authService');

const router = express.Router();

/**
 * Middleware to require admin authentication
 */
function requireAdminAuth(req, res, next) {
  console.log('Admin auth check - Session:', req.session);
  console.log('Admin auth check - User:', req.session?.user);
  
  if (!req.session || !req.session.user || req.session.user.username !== 'admin') {
    console.log('❌ Admin access denied');
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  console.log('✅ Admin access granted');
  next();
}

/**
 * Get Admin Dashboard Stats
 */
router.get('/dashboard', requireAdminAuth, (req, res) => {
  try {
    console.log('📊 Loading dashboard data...');
    const stats = DewaStore.getDashboardMetrics();
    console.log('Stats:', stats);
    
    // Get recent activities
    const pendingVendors = DewaStore.getVendors({ status: 'pending' }).slice(0, 5);
    console.log('Pending vendors:', pendingVendors.length);
    
    const pendingOffers = DewaStore.getOffers({ status: 'pending' }).slice(0, 10);
    console.log('Pending offers:', pendingOffers.length);
    
    const recentRedemptions = DewaStore.getRedemptions({}).slice(0, 10);
    const activeCampaigns = DewaStore.getCampaigns({ status: 'active' });

    res.json({
      success: true,
      stats,
      pendingVendors,
      pendingOffers,
      recentRedemptions,
      activeCampaigns
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard'
    });
  }
});

/**
 * Vendor Management - Get All Vendors
 */
router.get('/vendors', requireAdminAuth, (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const vendors = DewaStore.getVendors(filter);

    res.json({
      success: true,
      vendors
    });

  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve vendors'
    });
  }
});

/**
 * Approve Vendor
 */
router.post('/vendors/:id/approve', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const vendor = DewaStore.updateVendor(id, { 
      status: 'approved',
      approvedAt: new Date()
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor approved successfully',
      vendor
    });

  } catch (error) {
    console.error('Approve vendor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve vendor'
    });
  }
});

/**
 * Reject Vendor
 */
router.post('/vendors/:id/reject', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const vendor = DewaStore.updateVendor(id, { 
      status: 'rejected',
      rejectionReason: reason
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor rejected',
      vendor
    });

  } catch (error) {
    console.error('Reject vendor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject vendor'
    });
  }
});

/**
 * Block/Unblock Vendor
 */
router.post('/vendors/:id/toggle-block', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const vendor = DewaStore.getVendorById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    const newStatus = vendor.status === 'blocked' ? 'approved' : 'blocked';
    const updatedVendor = DewaStore.updateVendor(id, { status: newStatus });

    res.json({
      success: true,
      message: `Vendor ${newStatus}`,
      vendor: updatedVendor
    });

  } catch (error) {
    console.error('Toggle vendor block error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update vendor status'
    });
  }
});

/**
 * Offer Management - Get All Offers
 */
router.get('/offers', requireAdminAuth, (req, res) => {
  try {
    const { status, vendorId } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (vendorId) filter.vendorId = vendorId;

    const offers = DewaStore.getOffers(filter);

    // Enrich with vendor info
    const enrichedOffers = offers.map(offer => {
      const vendor = DewaStore.getVendorById(offer.vendorId);
      const category = DewaStore.getCategoryById(offer.categoryId);
      return {
        ...offer,
        vendor: vendor ? {
          companyName: vendor.companyName,
          email: vendor.email
        } : null,
        category: category || null
      };
    });

    res.json({
      success: true,
      offers: enrichedOffers
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
 * Approve Offer
 */
router.post('/offers/:id/approve', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const offer = DewaStore.updateOffer(id, { 
      status: 'active',
      approvedAt: new Date(),
      approvedBy: req.session.user.username
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Offer approved and activated',
      offer
    });

  } catch (error) {
    console.error('Approve offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve offer'
    });
  }
});

/**
 * Reject Offer
 */
router.post('/offers/:id/reject', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const offer = DewaStore.updateOffer(id, { 
      status: 'rejected',
      rejectionReason: reason
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Offer rejected',
      offer
    });

  } catch (error) {
    console.error('Reject offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject offer'
    });
  }
});

/**
 * Campaign Management - Get All Campaigns
 */
router.get('/campaigns', requireAdminAuth, (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const campaigns = DewaStore.getCampaigns(filter);

    res.json({
      success: true,
      campaigns
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve campaigns'
    });
  }
});

/**
 * Create Campaign
 */
router.post('/campaigns', requireAdminAuth, (req, res) => {
  try {
    const {
      name,
      nameAr,
      description,
      descriptionAr,
      startDate,
      endDate,
      offerIds,
      bannerImage
    } = req.body;

    const campaign = DewaStore.createCampaign({
      name,
      nameAr,
      description,
      descriptionAr,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      offerIds: offerIds || [],
      bannerImage,
      createdBy: req.session.user.username
    });

    res.json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });

  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign'
    });
  }
});

/**
 * Update Campaign
 */
router.put('/campaigns/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.startDate) updates.startDate = new Date(updates.startDate);
    if (updates.endDate) updates.endDate = new Date(updates.endDate);

    const campaign = DewaStore.updateCampaign(id, updates);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update campaign'
    });
  }
});

/**
 * Delete Campaign
 */
router.delete('/campaigns/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const success = DewaStore.deleteCampaign(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete campaign'
    });
  }
});

/**
 * Category Management - Create Category
 */
router.post('/categories', requireAdminAuth, (req, res) => {
  try {
    const { name, nameAr, icon } = req.body;

    const category = DewaStore.createCategory({
      name,
      nameAr,
      icon
    });

    res.json({
      success: true,
      message: 'Category created successfully',
      category
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

/**
 * Analytics - Get Detailed Reports
 */
router.get('/analytics', requireAdminAuth, (req, res) => {
  try {
    const { startDate, endDate, vendorId } = req.query;

    const metrics = DewaStore.getDashboardMetrics();

    // Get redemption trends
    const redemptions = DewaStore.getRedemptions({});
    const redemptionsByDate = {};
    redemptions.forEach(r => {
      const date = r.redeemedAt.toISOString().split('T')[0];
      redemptionsByDate[date] = (redemptionsByDate[date] || 0) + 1;
    });

    // Top performing offers
    const offers = DewaStore.getOffers({ status: 'active' });
    const topOffers = offers
      .sort((a, b) => b.redemptionCount - a.redemptionCount)
      .slice(0, 10)
      .map(offer => {
        const vendor = DewaStore.getVendorById(offer.vendorId);
        return {
          id: offer.id,
          title: offer.title,
          vendor: vendor ? vendor.companyName : 'Unknown',
          redemptions: offer.redemptionCount,
          views: offer.viewCount
        };
      });

    // Category performance
    const categoryStats = {};
    offers.forEach(offer => {
      const catId = offer.categoryId;
      if (!categoryStats[catId]) {
        const category = DewaStore.getCategoryById(catId);
        categoryStats[catId] = {
          category: category ? category.name : 'Unknown',
          offers: 0,
          redemptions: 0,
          views: 0
        };
      }
      categoryStats[catId].offers++;
      categoryStats[catId].redemptions += offer.redemptionCount;
      categoryStats[catId].views += offer.viewCount;
    });

    res.json({
      success: true,
      metrics,
      redemptionsByDate,
      topOffers,
      categoryPerformance: Object.values(categoryStats)
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate analytics'
    });
  }
});

module.exports = router;
