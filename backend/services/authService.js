const bcrypt = require('bcryptjs');

/**
 * In-memory user store (for demo purposes)
 * In production, use a real database like MongoDB, PostgreSQL, etc.
 */
const users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@oneid.gov',
    // Password: "Demo@123"
    passwordHash: '$2b$10$S5dIIsooNVg9UuesIhq5X.vny6ZpBmjtFluexGNvKDAh1/ThChGzW',
    name: 'Demo User'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@oneid.gov',
    // Password: "Admin@123"
    passwordHash: '$2b$10$MBy8feJrncjZLxa2BBvg4OB.Y4HM20RyxVL3xUDV14RSpNRmKAtci',
    name: 'Admin User'
  },
  {
    id: '3',
    username: 'vijayrahul97',
    email: 'vijayrahul97@gmail.com',
    // Password: "Demo@123"
    passwordHash: '$2b$10$S5dIIsooNVg9UuesIhq5X.vny6ZpBmjtFluexGNvKDAh1/ThChGzW',
    name: 'Vijay Rahul'
  }
];

/**
 * OTP storage (temporary - expires after 10 minutes)
 * In production, use Redis or database with TTL
 */
const otpStore = new Map();

/**
 * Find user by username
 */
function findUserByUsername(username) {
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

/**
 * Find user by email
 */
function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by ID
 */
function findUserById(id) {
  return users.find(u => u.id === id);
}

/**
 * Verify password
 */
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Hash password (for creating new users)
 */
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 10);
}

/**
 * Generate 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for user
 */
function storeOTP(userId, otp) {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(userId, { otp, expiresAt });
  
  // Auto-cleanup after expiration
  setTimeout(() => {
    otpStore.delete(userId);
  }, 10 * 60 * 1000);
}

/**
 * Verify OTP
 */
function verifyOTP(userId, otp) {
  const stored = otpStore.get(userId);
  
  if (!stored) {
    return { valid: false, error: 'OTP expired or not found' };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(userId);
    return { valid: false, error: 'OTP expired' };
  }
  
  if (stored.otp !== otp) {
    return { valid: false, error: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it
  otpStore.delete(userId);
  return { valid: true };
}

/**
 * Create new user (for admin/registration)
 */
async function createUser(username, email, password, name) {
  const id = (users.length + 1).toString();
  const passwordHash = await hashPassword(password);
  
  const user = {
    id,
    username,
    email,
    passwordHash,
    name
  };
  
  users.push(user);
  return user;
}

module.exports = {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  verifyPassword,
  hashPassword,
  generateOTP,
  storeOTP,
  verifyOTP,
  createUser
};
