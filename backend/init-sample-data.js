const DewaStore = require('./models/dewaStore');
const bcrypt = require('bcryptjs');

/**
 * Initialize sample data for DEWA Store
 */
async function initializeSampleData() {
  console.log('Initializing sample data for DEWA Store...');

  try {
    // Create sample vendors
    const passwordHash = await bcrypt.hash('Vendor@123', 10);

    const vendor1 = DewaStore.createVendor({
      companyName: 'Dubai Mall Shopping',
      companyNameAr: 'تسوق دبي مول',
      email: 'contact@dubaimall.com',
      phone: '+971-4-362-7500',
      contactPerson: 'Ahmed Hassan',
      description: 'Luxury shopping destination in the heart of Dubai',
      descriptionAr: 'وجهة تسوق فاخرة في قلب دبي',
      website: 'https://thedubaimall.com',
      logo: '🏬',
      passwordHash,
      status: 'approved'
    });

    const vendor2 = DewaStore.createVendor({
      companyName: 'Carrefour UAE',
      companyNameAr: 'كارفور الإمارات',
      email: 'support@carrefouruae.com',
      phone: '+971-800-732',
      contactPerson: 'Sarah Ahmed',
      description: 'Leading hypermarket chain in UAE',
      descriptionAr: 'سلسلة هايبر ماركت رائدة في الإمارات',
      website: 'https://www.carrefouruae.com',
      logo: '🛒',
      passwordHash,
      status: 'approved'
    });

    const vendor3 = DewaStore.createVendor({
      companyName: 'Reel Cinemas',
      companyNameAr: 'ريل سينما',
      email: 'info@reelcinemas.ae',
      phone: '+971-4-448-8488',
      contactPerson: 'Mohammed Ali',
      description: 'Premium movie theater experience',
      descriptionAr: 'تجربة سينمائية متميزة',
      website: 'https://reelcinemas.ae',
      logo: '🎬',
      passwordHash,
      status: 'approved'
    });

    const vendor4 = DewaStore.createVendor({
      companyName: 'Fitness First',
      companyNameAr: 'فيتنس فيرست',
      email: 'hello@fitnessfirst.ae',
      phone: '+971-4-321-1500',
      contactPerson: 'John Smith',
      description: 'Premium fitness and wellness center',
      descriptionAr: 'مركز لياقة وصحة متميز',
      website: 'https://www.fitnessfirstme.com',
      logo: '💪',
      passwordHash,
      status: 'approved'
    });

    // Create pending vendors for admin approval
    const vendor5 = DewaStore.createVendor({
      companyName: 'Spinneys UAE',
      companyNameAr: 'سبينس الإمارات',
      email: 'info@spinneysuae.com',
      phone: '+971-4-400-5000',
      contactPerson: 'James Wilson',
      description: 'Premium supermarket chain offering quality products',
      descriptionAr: 'سلسلة سوبر ماركت متميزة تقدم منتجات عالية الجودة',
      website: 'https://www.spinneysuae.com',
      logo: '🛍️',
      passwordHash,
      status: 'pending'
    });

    const vendor6 = DewaStore.createVendor({
      companyName: 'VOX Cinemas',
      companyNameAr: 'فوكس سينما',
      email: 'contact@voxcinemas.com',
      phone: '+971-600-599905',
      contactPerson: 'Fatima Al Zaabi',
      description: 'Leading cinema entertainment destination',
      descriptionAr: 'وجهة ترفيه سينمائي رائدة',
      website: 'https://www.voxcinemas.com',
      logo: '🎥',
      passwordHash,
      status: 'pending'
    });

    console.log('✅ Created 6 vendors (4 approved, 2 pending)');

    // Create sample offers
    const categories = DewaStore.getCategories();

    // Shopping offers
    const offer1 = DewaStore.createOffer({
      vendorId: vendor1.id,
      title: '20% OFF on Fashion Brands',
      titleAr: 'خصم 20٪ على العلامات التجارية للأزياء',
      description: 'Get 20% discount on all fashion brands including Zara, H&M, and Mango',
      descriptionAr: 'احصل على خصم 20٪ على جميع العلامات التجارية للأزياء بما في ذلك زارا وH&M ومانجو',
      categoryId: '2',
      discountType: 'percentage',
      discountValue: 20,
      originalPrice: null,
      locations: [
        { name: 'Dubai Mall', address: 'Downtown Dubai', lat: 25.1972, lon: 55.2744 }
      ],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      terms: 'Valid on fashion brands only. Cannot be combined with other offers.',
      termsAr: 'صالح على العلامات التجارية للأزياء فقط. لا يمكن دمجه مع عروض أخرى.',
      quota: 500,
      status: 'active',
      createdBy: 'vendor'
    });

    const offer2 = DewaStore.createOffer({
      vendorId: vendor2.id,
      title: 'AED 50 OFF on AED 300 Purchase',
      titleAr: 'خصم 50 درهم على مشتريات 300 درهم',
      description: 'Shop for AED 300 or more and get AED 50 instant discount',
      descriptionAr: 'تسوق بقيمة 300 درهم أو أكثر واحصل على خصم فوري 50 درهم',
      categoryId: '1',
      discountType: 'fixed',
      discountValue: 50,
      originalPrice: 300,
      locations: [
        { name: 'Carrefour Mall of Emirates', address: 'Mall of Emirates, Al Barsha', lat: 25.1180, lon: 55.1997 },
        { name: 'Carrefour Dubai Festival City', address: 'Dubai Festival City', lat: 25.2225, lon: 55.3537 }
      ],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      terms: 'Minimum purchase of AED 300 required. Valid on all products.',
      termsAr: 'الحد الأدنى للشراء 300 درهم. صالح على جميع المنتجات.',
      quota: 1000,
      status: 'active',
      createdBy: 'vendor'
    });

    const offer3 = DewaStore.createOffer({
      vendorId: vendor3.id,
      title: 'Buy 1 Get 1 Free Movie Tickets',
      titleAr: 'اشتر تذكرة واحصل على الأخرى مجاناً',
      description: 'Purchase one movie ticket and get the second ticket absolutely free',
      descriptionAr: 'اشتر تذكرة سينما واحدة واحصل على التذكرة الثانية مجاناً',
      categoryId: '3',
      discountType: 'percentage',
      discountValue: 50,
      originalPrice: 75,
      locations: [
        { name: 'Reel Cinemas Dubai Marina', address: 'Dubai Marina Mall', lat: 25.0789, lon: 55.1385 },
        { name: 'Reel Cinemas JBR', address: 'The Beach, JBR', lat: 25.0772, lon: 55.1350 }
      ],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      terms: 'Valid Monday to Thursday only. Not valid on public holidays.',
      termsAr: 'صالح من الاثنين إلى الخميس فقط. غير صالح في العطلات الرسمية.',
      quota: 200,
      status: 'active',
      createdBy: 'vendor'
    });

    const offer4 = DewaStore.createOffer({
      vendorId: vendor4.id,
      title: '30% OFF Annual Membership',
      titleAr: 'خصم 30٪ على العضوية السنوية',
      description: 'Join Fitness First with 30% discount on annual membership',
      descriptionAr: 'انضم إلى فيتنس فيرست مع خصم 30٪ على العضوية السنوية',
      categoryId: '4',
      discountType: 'percentage',
      discountValue: 30,
      originalPrice: 3000,
      locations: [
        { name: 'Fitness First DIFC', address: 'DIFC, Gate Village', lat: 25.2138, lon: 55.2816 },
        { name: 'Fitness First Business Bay', address: 'Business Bay', lat: 25.1878, lon: 55.2590 }
      ],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      terms: 'Valid for new members only. One year commitment required.',
      termsAr: 'صالح للأعضاء الجدد فقط. التزام لمدة سنة واحدة مطلوب.',
      quota: 100,
      status: 'active',
      createdBy: 'vendor'
    });

    const offer5 = DewaStore.createOffer({
      vendorId: vendor1.id,
      title: 'Electronics Mega Sale - Up to 40% OFF',
      titleAr: 'التخفيضات الكبرى للإلكترونيات - خصم يصل إلى 40٪',
      description: 'Exclusive DEWA employee offer on latest electronics and gadgets',
      descriptionAr: 'عرض حصري لموظفي هيئة كهرباء ومياه دبي على أحدث الإلكترونيات',
      categoryId: '7',
      discountType: 'percentage',
      discountValue: 40,
      originalPrice: null,
      locations: [
        { name: 'Dubai Mall Electronics', address: 'Dubai Mall Level 2', lat: 25.1972, lon: 55.2744 }
      ],
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-28'),
      terms: 'Valid on selected electronics only. Stock subject to availability.',
      termsAr: 'صالح على الإلكترونيات المحددة فقط. المخزون يخضع للتوافر.',
      quota: 150,
      status: 'active',
      createdBy: 'vendor'
    });

    // Create pending offers for admin approval
    const offer6 = DewaStore.createOffer({
      vendorId: vendor5.id,
      title: '25% OFF Fresh Produce',
      titleAr: 'خصم 25٪ على المنتجات الطازجة',
      description: 'Get 25% discount on all fresh fruits and vegetables',
      descriptionAr: 'احصل على خصم 25٪ على جميع الفواكه والخضروات الطازجة',
      categoryId: '1',
      discountType: 'percentage',
      discountValue: 25,
      originalPrice: null,
      locations: [
        { name: 'Spinneys JBR', address: 'JBR The Walk', lat: 25.0772, lon: 55.1350 }
      ],
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-31'),
      terms: 'Valid on fresh produce only. Excludes imported items.',
      termsAr: 'صالح على المنتجات الطازجة فقط. لا يشمل العناصر المستوردة.',
      quota: 300,
      status: 'pending',
      createdBy: 'vendor'
    });

    const offer7 = DewaStore.createOffer({
      vendorId: vendor6.id,
      title: 'Free Large Popcorn with 2 Tickets',
      titleAr: 'فشار كبير مجاني مع تذكرتين',
      description: 'Purchase 2 movie tickets and get a large popcorn absolutely free',
      descriptionAr: 'اشتر تذكرتي سينما واحصل على فشار كبير مجاناً',
      categoryId: '3',
      discountType: 'fixed',
      discountValue: 25,
      originalPrice: 80,
      locations: [
        { name: 'VOX City Centre Deira', address: 'City Centre Deira', lat: 25.2525, lon: 55.3313 }
      ],
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-12-31'),
      terms: 'Valid for standard tickets only. Excludes IMAX and 4DX.',
      termsAr: 'صالح للتذاكر العادية فقط. لا يشمل IMAX و 4DX.',
      quota: 200,
      status: 'pending',
      createdBy: 'vendor'
    });

    console.log('✅ Created 7 offers (5 active, 2 pending)');

    // Create campaigns
    const campaign1 = DewaStore.createCampaign({
      name: 'Ramadan Special Offers 2024',
      nameAr: 'عروض رمضان الخاصة 2024',
      description: 'Exclusive offers for DEWA employees during Ramadan - Extra savings on dining, shopping, and entertainment',
      descriptionAr: 'عروض حصرية لموظفي هيئة كهرباء ومياه دبي خلال شهر رمضان - توفير إضافي على الطعام والتسوق والترفيه',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-30'),
      offerIds: [offer1.id, offer2.id, offer3.id],
      bannerImage: '🌙',
      status: 'active',
      createdBy: 'admin'
    });

    const campaign2 = DewaStore.createCampaign({
      name: 'Summer Sale 2024',
      nameAr: 'تخفيضات الصيف 2024',
      description: 'Beat the heat with cool deals on electronics, fashion, and fitness memberships',
      descriptionAr: 'تغلب على الحرارة مع صفقات رائعة على الإلكترونيات والأزياء وعضويات اللياقة البدنية',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      offerIds: [offer4.id, offer5.id],
      bannerImage: '☀️',
      status: 'active',
      createdBy: 'admin'
    });

    const campaign3 = DewaStore.createCampaign({
      name: 'Back to School',
      nameAr: 'العودة إلى المدرسة',
      description: 'Special discounts on stationery, electronics, and educational supplies for DEWA families',
      descriptionAr: 'خصومات خاصة على القرطاسية والإلكترونيات والمستلزمات التعليمية لعائلات هيئة كهرباء ومياه دبي',
      startDate: new Date('2024-08-15'),
      endDate: new Date('2024-09-15'),
      offerIds: [offer5.id],
      bannerImage: '📚',
      status: 'upcoming',
      createdBy: 'admin'
    });

    const campaign4 = DewaStore.createCampaign({
      name: 'UAE National Day Celebration',
      nameAr: 'احتفالات اليوم الوطني لدولة الإمارات',
      description: 'Celebrate UAE National Day with patriotic offers and special deals across all categories',
      descriptionAr: 'احتفل باليوم الوطني لدولة الإمارات مع عروض وطنية وصفقات خاصة في جميع الفئات',
      startDate: new Date('2024-11-20'),
      endDate: new Date('2024-12-10'),
      offerIds: [offer1.id, offer2.id, offer3.id, offer4.id, offer5.id],
      bannerImage: '🇦🇪',
      status: 'upcoming',
      createdBy: 'admin'
    });

    const campaign5 = DewaStore.createCampaign({
      name: 'Year End Mega Sale',
      nameAr: 'تخفيضات نهاية العام الكبرى',
      description: 'End the year with massive savings! Up to 50% off on selected categories',
      descriptionAr: 'أنهِ العام بتوفير هائل! خصم يصل إلى 50٪ على الفئات المختارة',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-31'),
      offerIds: [offer1.id, offer3.id, offer5.id],
      bannerImage: '🎉',
      status: 'upcoming',
      createdBy: 'admin'
    });

    console.log('✅ Created 5 campaigns (2 active, 3 upcoming)');

    // Create some sample redemptions
    const redemption1 = DewaStore.createRedemption({
      offerId: offer1.id,
      userId: '1', // demo user
      vendorId: vendor1.id,
      qrCode: 'SAMPLE_QR_123',
      location: { name: 'Dubai Mall', address: 'Downtown Dubai' }
    });

    const redemption2 = DewaStore.createRedemption({
      offerId: offer2.id,
      userId: '3', // vijayrahul97
      vendorId: vendor2.id,
      qrCode: 'SAMPLE_QR_456',
      location: { name: 'Carrefour Mall of Emirates', address: 'Al Barsha' }
    });

    console.log('✅ Created 2 sample redemptions');

    console.log('\n========================================');
    console.log('Sample Data Initialization Complete!');
    console.log('========================================\n');
    console.log('Vendor Credentials (All use password: Vendor@123):');
    console.log('  ✅ Approved: contact@dubaimall.com');
    console.log('  ✅ Approved: support@carrefouruae.com');
    console.log('  ✅ Approved: info@reelcinemas.ae');
    console.log('  ✅ Approved: hello@fitnessfirst.ae');
    console.log('  ⏳ Pending: info@spinneysuae.com');
    console.log('  ⏳ Pending: contact@voxcinemas.com\n');
    console.log('Statistics:');
    console.log(`  Total Vendors: ${DewaStore.getVendors({}).length}`);
    console.log(`  Approved Vendors: ${DewaStore.getVendors({ status: 'approved' }).length}`);
    console.log(`  Pending Vendors: ${DewaStore.getVendors({ status: 'pending' }).length}`);
    console.log(`  Total Offers: ${DewaStore.getOffers({}).length}`);
    console.log(`  Active Offers: ${DewaStore.getOffers({ status: 'active' }).length}`);
    console.log(`  Pending Offers: ${DewaStore.getOffers({ status: 'pending' }).length}`);
    console.log(`  Categories: ${categories.length}`);
    console.log(`  Campaigns: ${DewaStore.getCampaigns({}).length}`);
    console.log(`  Active Campaigns: ${DewaStore.getCampaigns({ status: 'active' }).length}`);
    console.log(`  Upcoming Campaigns: ${DewaStore.getCampaigns({ status: 'upcoming' }).length}`);
    console.log(`  Redemptions: ${DewaStore.getRedemptions({}).length}\n`);

  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  initializeSampleData();
}

module.exports = { initializeSampleData };
