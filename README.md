# One Id OAuth Integration - Node.js Application

A complete implementation of One Id OAuth 2.0 authentication for login functionality.

## Features

✅ OAuth 2.0 authorization flow  
✅ Secure session management  
✅ Protected routes and API endpoints  
✅ User profile retrieval  
✅ CSRF protection with state parameter  
✅ Clean and modern UI  

## Project Structure

```
Hackthon Challenge/
├── backend/
│   ├── server.js              # Express server
│   ├── config/
│   │   └── oneid.js          # One Id OAuth configuration
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   └── auth.js           # Authentication routes
│   └── package.json
├── public/
│   ├── index.html            # Login page
│   └── dashboard.html        # Protected dashboard
├── .env.example              # Environment variables template
├── .gitignore
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure One Id Credentials

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your One Id OAuth credentials:

```env
PORT=3000
NODE_ENV=development

# One Id OAuth Configuration
ONEID_CLIENT_ID=your_actual_client_id
ONEID_CLIENT_SECRET=your_actual_client_secret
ONEID_AUTHORIZATION_URL=https://your-provider.com/oauth/authorize
ONEID_TOKEN_URL=https://your-provider.com/oauth/token
ONEID_USERINFO_URL=https://your-provider.com/oauth/userinfo
ONEID_REDIRECT_URI=http://localhost:3000/auth/callback

# Session Secret (generate a strong random string)
SESSION_SECRET=generate_a_strong_random_string_here
```

### 3. Register Your Application

Register your application with your One Id provider and configure:

- **Redirect URI**: `http://localhost:3000/auth/callback`
- **Scopes**: `openid profile email`
- Save the Client ID and Client Secret

### 4. Run the Application

```bash
# From the backend directory
npm start

# Or for development with auto-reload
npm run dev
```

The application will be available at: `http://localhost:3000`

## How It Works

### OAuth 2.0 Flow

1. **User clicks "Login with One Id"**
   - Redirects to `/auth/login`
   - Server generates a random state for CSRF protection
   - Redirects to One Id authorization URL

2. **User authenticates with One Id**
   - User logs in on One Id provider's page
   - One Id redirects back to your callback URL with authorization code

3. **Exchange code for token**
   - Server receives the callback at `/auth/callback`
   - Validates the state parameter
   - Exchanges authorization code for access token

4. **Fetch user information**
   - Uses access token to fetch user profile
   - Creates a secure session
   - Redirects to dashboard

5. **Protected routes**
   - Dashboard and API endpoints check for valid session
   - Unauthorized users are redirected to login

## API Endpoints

### Authentication
- `GET /auth/login` - Initiate OAuth flow
- `GET /auth/callback` - OAuth callback handler
- `GET /auth/user` - Get current user session
- `POST /auth/logout` - Logout and destroy session

### Protected Routes
- `GET /dashboard` - Protected dashboard page
- `GET /api/profile` - Protected API endpoint (returns user data as JSON)

## Configuration Options

### One Id Provider Examples

#### Azure AD / Microsoft Entra ID
```env
ONEID_AUTHORIZATION_URL=https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
ONEID_TOKEN_URL=https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
ONEID_USERINFO_URL=https://graph.microsoft.com/v1.0/me
```

#### Okta
```env
ONEID_AUTHORIZATION_URL=https://{your-domain}.okta.com/oauth2/default/v1/authorize
ONEID_TOKEN_URL=https://{your-domain}.okta.com/oauth2/default/v1/token
ONEID_USERINFO_URL=https://{your-domain}.okta.com/oauth2/default/v1/userinfo
```

#### Auth0
```env
ONEID_AUTHORIZATION_URL=https://{your-domain}.auth0.com/authorize
ONEID_TOKEN_URL=https://{your-domain}.auth0.com/oauth/token
ONEID_USERINFO_URL=https://{your-domain}.auth0.com/userinfo
```

#### Generic OAuth 2.0 Provider
```env
ONEID_AUTHORIZATION_URL=https://provider.com/oauth/authorize
ONEID_TOKEN_URL=https://provider.com/oauth/token
ONEID_USERINFO_URL=https://provider.com/oauth/userinfo
```

## Security Features

- **CSRF Protection**: State parameter validation
- **Secure Sessions**: HTTP-only cookies with secure flag in production
- **Token Storage**: Access tokens stored in server-side sessions
- **Environment Variables**: Sensitive credentials kept out of code
- **Session Expiration**: 24-hour session timeout

## Customization

### Adjust Session Duration

Edit [backend/server.js](backend/server.js#L17-L22):
```javascript
cookie: {
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}
```

### Change OAuth Scopes

Edit [backend/config/oneid.js](backend/config/oneid.js#L11):
```javascript
scope: 'openid profile email' // Add or remove scopes
```

### Add More Protected Routes

Edit [backend/server.js](backend/server.js):
```javascript
app.get('/api/your-endpoint', requireAuth, (req, res) => {
  // Your protected logic
  res.json({ data: 'protected data' });
});
```

## Troubleshooting

### "Missing One Id configuration" warning
- Check that `.env` file exists and has all required variables
- Ensure `.env` file is in the root directory

### Redirect URI mismatch
- Verify the redirect URI in your One Id provider matches exactly
- Check for http vs https
- Ensure port numbers match

### "Invalid state parameter"
- This is a security feature
- Can occur if cookies are disabled
- Try clearing browser cookies and cache

### Authentication fails
- Check One Id credentials are correct
- Verify OAuth endpoints are accessible
- Check network tab in browser dev tools for error responses

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong, unique `SESSION_SECRET`
3. Enable HTTPS (cookies with `secure: true`)
4. Update `ONEID_REDIRECT_URI` to your production domain
5. Consider using a session store (Redis, MongoDB) instead of memory
6. Add rate limiting to prevent abuse

## License

MIT

## Support

For issues or questions, please check:
- One Id provider documentation
- OAuth 2.0 specification
- Express.js documentation
