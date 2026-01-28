const bcrypt = require('bcryptjs');

const hash = '$2b$10$MBy8feJrncjZLxa2BBvg4OB.Y4HM20RyxVL3xUDV14RSpNRmKAtci';
const password = 'Admin@123';

bcrypt.compare(password, hash).then(result => {
  console.log('Password "Admin@123" matches hash:', result);
  if (!result) {
    // Generate new hash
    bcrypt.hash(password, 10).then(newHash => {
      console.log('New correct hash:', newHash);
    });
  }
});
