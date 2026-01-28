const axios = require('axios');

/**
 * One Id OAuth Configuration
 */
const config = {
  clientId: process.env.ONEID_CLIENT_ID,
  clientSecret: process.env.ONEID_CLIENT_SECRET,
  authorizationUrl: process.env.ONEID_AUTHORIZATION_URL,
  tokenUrl: process.env.ONEID_TOKEN_URL,
  userInfoUrl: process.env.ONEID_USERINFO_URL,
  redirectUri: process.env.ONEID_REDIRECT_URI,
  scope: 'openid profile email' // Adjust scopes as needed
};

/**
 * Generate authorization URL for OAuth flow
 */
function getAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state: state
  });

  return `${config.authorizationUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code) {
  try {
    // Create URL-encoded form data
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    });

    const response = await axios.post(config.tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error('Failed to exchange authorization code');
  }
}

/**
 * Get user information from One Id provider
 */
async function getUserInfo(accessToken) {
  try {
    const response = await axios.get(config.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    throw new Error('Failed to fetch user information');
  }
}

/**
 * Validate configuration
 */
function validateConfig() {
  const required = ['clientId', 'clientSecret', 'authorizationUrl', 'tokenUrl', 'userInfoUrl', 'redirectUri'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing One Id configuration: ${missing.join(', ')}`);
    console.warn('Please check your .env file');
  }
}

validateConfig();

module.exports = {
  getAuthorizationUrl,
  exchangeCodeForToken,
  getUserInfo,
  config
};
