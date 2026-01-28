/**
 * DEWA Store Data Models
 * In-memory storage for MVP (use database in production)
 */

// Vendors
const vendors = [];
let vendorIdCounter = 1;

// Offers
const offers = [];
let offerIdCounter = 1;

// Categories
const categories = [
  { id: '1', name: 'Food & Dining', nameAr: 'الطعام والمطاعم', icon: '🍽️', active: true },
  { id: '2', name: 'Shopping', nameAr: 'التسوق', icon: '🛍️', active: true },
  { id: '3', name: 'Entertainment', nameAr: 'الترفيه', icon: '🎭', active: true },
  { id: '4', name: 'Health & Fitness', nameAr: 'الصحة واللياقة', icon: '💪', active: true },
  { id: '5', name: 'Travel & Tourism', nameAr: 'السفر والسياحة', icon: '✈️', active: true },
  { id: '6', name: 'Beauty & Spa', nameAr: 'التجميل والسبا', icon: '💅', active: true },
  { id: '7', name: 'Electronics', nameAr: 'الإلكترونيات', icon: '📱', active: true },
  { id: '8', name: 'Education', nameAr: 'التعليم', icon: '📚', active: true },
];

// Redemptions
const redemptions = [];
let redemptionIdCounter = 1;

// Campaigns
const campaigns = [];
let campaignIdCounter = 1;

// Favorites
const favorites = new Map(); // userId -> [offerId]

// Vendor Model
class Vendor {
  constructor(data) {
    this.id = String(vendorIdCounter++);
    this.companyName = data.companyName;
    this.companyNameAr = data.companyNameAr || '';
    this.email = data.email;
    this.phone = data.phone;
    this.contactPerson = data.contactPerson;
    this.logo = data.logo || null;
    this.description = data.description || '';
    this.descriptionAr = data.descriptionAr || '';
    this.website = data.website || '';
    this.passwordHash = data.passwordHash || '';
    this.status = data.status || 'pending'; // pending, approved, rejected, blocked
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.approvedAt = null;
    this.approvedBy = null;
  }
}

// Offer Model
class Offer {
  constructor(data) {
    this.id = String(offerIdCounter++);
    this.vendorId = data.vendorId;
    this.title = data.title;
    this.titleAr = data.titleAr || '';
    this.description = data.description;
    this.descriptionAr = data.descriptionAr || '';
    this.categoryId = data.categoryId;
    this.discountType = data.discountType; // percentage, fixed, bogo
    this.discountValue = data.discountValue;
    this.originalPrice = data.originalPrice || null;
    this.images = data.images || [];
    this.locations = data.locations || []; // Array of {name, address, lat, lng}
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.terms = data.terms || '';
    this.termsAr = data.termsAr || '';
    this.quota = data.quota || null; // null = unlimited
    this.redemptionCount = 0;
    this.viewCount = 0;
    this.status = data.status || 'pending'; // pending, approved, rejected, active, expired, disabled
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.createdBy = data.createdBy; // vendor or admin
    this.approvedAt = null;
    this.approvedBy = null;
  }
}

// Redemption Model
class Redemption {
  constructor(data) {
    this.id = String(redemptionIdCounter++);
    this.offerId = data.offerId;
    this.userId = data.userId;
    this.vendorId = data.vendorId;
    this.qrCode = data.qrCode;
    this.location = data.location || null;
    this.redeemedAt = new Date();
    this.status = 'completed'; // completed, cancelled
  }
}

// Campaign Model
class Campaign {
  constructor(data) {
    this.id = String(campaignIdCounter++);
    this.name = data.name;
    this.nameAr = data.nameAr || '';
    this.description = data.description;
    this.descriptionAr = data.descriptionAr || '';
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.offerIds = data.offerIds || [];
    this.bannerImage = data.bannerImage || '';
    this.status = data.status || 'draft'; // draft, active, upcoming, completed
    this.createdAt = new Date();
    this.createdBy = data.createdBy;
  }
}

// CRUD Operations
const DewaStore = {
  // Vendors
  createVendor(data) {
    const vendor = new Vendor(data);
    vendors.push(vendor);
    return vendor;
  },

  getVendors(filter = {}) {
    let results = vendors;
    if (filter.status) {
      results = results.filter(v => v.status === filter.status);
    }
    return results;
  },

  getVendorById(id) {
    return vendors.find(v => v.id === id);
  },

  getVendorByEmail(email) {
    return vendors.find(v => v.email.toLowerCase() === email.toLowerCase());
  },

  updateVendor(id, updates) {
    const vendor = vendors.find(v => v.id === id);
    if (vendor) {
      Object.assign(vendor, updates);
      vendor.updatedAt = new Date();
      return vendor;
    }
    return null;
  },

  // Offers
  createOffer(data) {
    const offer = new Offer(data);
    offers.push(offer);
    return offer;
  },

  getOffers(filter = {}) {
    let results = offers;
    
    if (filter.vendorId) {
      results = results.filter(o => o.vendorId === filter.vendorId);
    }
    if (filter.categoryId) {
      results = results.filter(o => o.categoryId === filter.categoryId);
    }
    if (filter.status) {
      results = results.filter(o => o.status === filter.status);
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      results = results.filter(o => 
        o.title.toLowerCase().includes(search) ||
        o.description.toLowerCase().includes(search)
      );
    }
    
    return results;
  },

  getOfferById(id) {
    return offers.find(o => o.id === id);
  },

  updateOffer(id, updates) {
    const offer = offers.find(o => o.id === id);
    if (offer) {
      Object.assign(offer, updates);
      offer.updatedAt = new Date();
      return offer;
    }
    return null;
  },

  incrementOfferView(id) {
    const offer = offers.find(o => o.id === id);
    if (offer) {
      offer.viewCount++;
      return offer;
    }
    return null;
  },

  // Redemptions
  createRedemption(data) {
    const redemption = new Redemption(data);
    redemptions.push(redemption);
    
    // Increment redemption count
    const offer = offers.find(o => o.id === data.offerId);
    if (offer) {
      offer.redemptionCount++;
    }
    
    return redemption;
  },

  getRedemptions(filter = {}) {
    let results = redemptions;
    
    if (filter.userId) {
      results = results.filter(r => r.userId === filter.userId);
    }
    if (filter.vendorId) {
      results = results.filter(r => r.vendorId === filter.vendorId);
    }
    if (filter.offerId) {
      results = results.filter(r => r.offerId === filter.offerId);
    }
    
    return results;
  },

  // Categories
  getCategories() {
    return categories.filter(c => c.active);
  },

  getCategoryById(id) {
    return categories.find(c => c.id === id);
  },

  // Favorites
  addFavorite(userId, offerId) {
    if (!favorites.has(userId)) {
      favorites.set(userId, []);
    }
    const userFavorites = favorites.get(userId);
    if (!userFavorites.includes(offerId)) {
      userFavorites.push(offerId);
    }
    return userFavorites;
  },

  removeFavorite(userId, offerId) {
    if (favorites.has(userId)) {
      const userFavorites = favorites.get(userId);
      const index = userFavorites.indexOf(offerId);
      if (index > -1) {
        userFavorites.splice(index, 1);
      }
      return userFavorites;
    }
    return [];
  },

  getFavorites(userId) {
    return favorites.get(userId) || [];
  },

  isFavorite(userId, offerId) {
    const userFavorites = favorites.get(userId) || [];
    return userFavorites.includes(offerId);
  },

  // Campaigns
  createCampaign(data) {
    const campaign = new Campaign(data);
    campaigns.push(campaign);
    return campaign;
  },

  getCampaigns(filter = {}) {
    let results = campaigns;
    if (filter.status) {
      results = results.filter(c => c.status === filter.status);
    }
    return results;
  },

  getCampaignById(id) {
    return campaigns.find(c => c.id === id);
  },

  updateCampaign(id, updates) {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      Object.assign(campaign, updates);
      return campaign;
    }
    return null;
  },

  // Analytics
  getAnalytics() {
    return {
      totalVendors: vendors.length,
      activeVendors: vendors.filter(v => v.status === 'approved').length,
      pendingVendors: vendors.filter(v => v.status === 'pending').length,
      totalOffers: offers.length,
      activeOffers: offers.filter(o => o.status === 'active').length,
      pendingOffers: offers.filter(o => o.status === 'pending').length,
      totalRedemptions: redemptions.length,
      todayRedemptions: redemptions.filter(r => {
        const today = new Date();
        return r.redeemedAt.toDateString() === today.toDateString();
      }).length,
    };
  },

  // Dashboard Metrics
  getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalVendors: vendors.length,
      approvedVendors: vendors.filter(v => v.status === 'approved').length,
      pendingVendors: vendors.filter(v => v.status === 'pending').length,
      totalOffers: offers.length,
      activeOffers: offers.filter(o => o.status === 'active').length,
      pendingOffers: offers.filter(o => o.status === 'pending').length,
      totalRedemptions: redemptions.length,
      todayRedemptions: redemptions.filter(r => {
        const redemptionDate = new Date(r.redeemedAt);
        redemptionDate.setHours(0, 0, 0, 0);
        return redemptionDate.getTime() === today.getTime();
      }).length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalCampaigns: campaigns.length,
      totalCategories: categories.filter(c => c.active).length
    };
  }
};

module.exports = DewaStore;
