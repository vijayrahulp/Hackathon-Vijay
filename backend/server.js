const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const vendorRoutes = require('./routes/vendor');
const adminRoutes = require('./routes/admin');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: false,
  rolling: true, // Reset expiry on every request
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  },
  name: 'oneid.sid' // Custom session name
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Test endpoint to check configuration
app.get('/api/test-config', (req, res) => {
  res.json({
    oauth: {
      clientId: process.env.ONEID_CLIENT_ID ? 'Configured' : 'Missing',
      clientSecret: process.env.ONEID_CLIENT_SECRET ? 'Configured' : 'Missing',
      redirectUri: process.env.ONEID_REDIRECT_URI || 'Missing'
    },
    email: {
      user: process.env.EMAIL_USER || 'Missing',
      password: process.env.EMAIL_PASSWORD ? 'Configured' : 'Missing',
      service: process.env.EMAIL_SERVICE || 'gmail'
    }
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);

// Protected route example
app.get('/api/profile', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.session.user
  });
});

// Protected dashboard route
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Home page
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Initialize sample data
const { initializeSampleData } = require('./init-sample-data');

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to configure your .env file with One Id credentials');
  
  // Initialize sample data for DEWA Store
  console.log('\nInitializing DEWA Store sample data...');
  await initializeSampleData();
});
