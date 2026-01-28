const bcrypt = require('bcryptjs');
const DewaStore = require('./models/dewaStore');

async function testVendorPassword() {
  const vendor = DewaStore.getVendorByEmail('contact@dubaimall.com');
  
  if (!vendor) {
    console.log('Vendor not found!');
    return;
  }
  
  console.log('Vendor:', vendor.companyName);
  console.log('Vendor password hash:', vendor.passwordHash);
  
  // Test the password
  const password = 'Vendor@123';
  const isValid = await bcrypt.compare(password, vendor.passwordHash);
  
  console.log(`Password "${password}" matches hash:`, isValid);
}

testVendorPassword();
