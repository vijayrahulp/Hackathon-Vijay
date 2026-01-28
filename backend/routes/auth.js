const express = require('express');
const crypto = require('crypto');
const { getAuthorizationUrl, exchangeCodeForToken, getUserInfo } = require('../config/oneid');
const { 
  findUserByUsername, 
  verifyPassword, 
  generateOTP, 
  storeOTP, 
  verifyOTP 
} = require('../services/authService');
const { sendOTPEmail } = require('../services/emailService');

const router = express.Router();

/**
 * Custom OneID Login with 2FA
 * Step 1: Verify username and password
 */
router.post('/login/custom', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Find user by username or email
    let user = findUserByUsername(username);
    if (!user) {
      const { findUserByEmail } = require('../services/authService');
      user = findUserByEmail(username);
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(user.id, otp);

    // Send OTP via email (or console for demo)
    sendOTPEmail(user.email, otp, user.name);

    // Store pending user ID in session
    req.session.pendingUserId = user.id;
    req.session.pendingUserEmail = user.email;

    res.json({
      success: true,
      requiresOTP: true,
      message: 'OTP sent to your registered email',
      email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Masked email
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
});

/**
 * Verify OTP - Step 2 of 2FA
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.session.pendingUserId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'No pending authentication. Please login first.'
      });
    }

    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP format'
      });
    }

    // Verify OTP
    const result = verifyOTP(userId, otp);

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }

    // OTP verified - get user and create session
    const { findUserById } = require('../services/authService');
    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Create authenticated session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name
    };

    // Clear pending authentication
    delete req.session.pendingUserId;
    delete req.session.pendingUserEmail;

    // Explicitly save the session
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to save session'
        });
      }

      res.json({
        success: true,
        message: 'Authentication successful',
        redirectTo: '/dashboard'
      });
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      error: 'OTP verification failed'
    });
  }
});

/**
 * Resend OTP
 */
router.post('/resend-otp', (req, res) => {
  try {
    const userId = req.session.pendingUserId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'No pending authentication'
      });
    }

    const { findUserById } = require('../services/authService');
    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    storeOTP(user.id, otp);
    sendOTPEmail(user.email, otp, user.name);

    res.json({
      success: true,
      message: 'OTP resent successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend OTP'
    });
  }
});

/**
 * Initiate OAuth login flow (keeping for compatibility)
 * Redirects user to One Id authorization page
 */
router.get('/login', (req, res) => {
  try {
    // Check if configuration is complete
    const { config } = require('../config/oneid');
    if (!config.clientId || !config.authorizationUrl) {
      return res.status(500).send(`
        <h1>Configuration Error</h1>
        <p>One Id OAuth is not configured. Please set up your .env file with:</p>
        <ul>
          <li>ONEID_CLIENT_ID</li>
          <li>ONEID_CLIENT_SECRET</li>
          <li>ONEID_AUTHORIZATION_URL</li>
          <li>ONEID_TOKEN_URL</li>
          <li>ONEID_USERINFO_URL</li>
          <li>ONEID_REDIRECT_URI</li>
        </ul>
        <p><a href="/">Back to Home</a></p>
      `);
    }

    // Generate random state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauthState = state;

    const authUrl = getAuthorizationUrl(state);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send(`
      <h1>Configuration Error</h1>
      <p>Failed to initiate login. Please check server logs.</p>
      <p><a href="/">Back to Home</a></p>
    `);
  }
});

/**
 * OAuth callback handler
 * Receives authorization code and exchanges it for access token
 */
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return res.redirect('/?error=oauth_failed');
  }

  // Validate state parameter (CSRF protection)
  if (!state || state !== req.session.oauthState) {
    console.error('Invalid state parameter');
    return res.redirect('/?error=invalid_state');
  }

  // Clear the state from session
  delete req.session.oauthState;

  if (!code) {
    return res.redirect('/?error=no_code');
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    const accessToken = tokenResponse.access_token;

    // Fetch user information
    const userInfo = await getUserInfo(accessToken);

    // Store user information in session
    req.session.user = {
      id: userInfo.sub || userInfo.id,
      email: userInfo.email,
      name: userInfo.name || userInfo.preferred_username,
      picture: userInfo.picture,
      accessToken: accessToken // Store for API calls if needed
    };

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.redirect('/?error=auth_failed');
  }
});

/**
 * Get current user session
 */
router.get('/user', (req, res) => {
  if (req.session.user) {
    // Return user info without access token
    const { accessToken, ...userInfo } = req.session.user;
    res.json({ authenticated: true, user: userInfo });
  } else {
    res.json({ authenticated: false });
  }
});

/**
 * Logout endpoint
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

/**
 * Catch-all for undefined auth routes
 */
router.all('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found', 
    message: 'Auth endpoint not found',
    availableEndpoints: ['/auth/login', '/auth/callback', '/auth/user', '/auth/logout']
  });
});

module.exports = router;
