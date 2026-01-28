/**
 * Authentication middleware to protect routes
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    // Redirect to login page
    return res.redirect('/');
  }
  next();
}

/**
 * Check if user is authenticated (for JSON responses)
 */
function isAuthenticated(req, res, next) {
  req.isAuthenticated = !!(req.session && req.session.user);
  next();
}

module.exports = {
  requireAuth,
  isAuthenticated
};
