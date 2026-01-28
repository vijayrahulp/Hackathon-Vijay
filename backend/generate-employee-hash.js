const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('Employee@123', 10);
  console.log('Password hash for "Employee@123":');
  console.log(hash);
}

generateHash();
