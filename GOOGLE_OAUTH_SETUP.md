# Google OAuth Setup Guide

## Quick Setup (5 minutes)

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### 2. Create a New Project (if needed)
- Click "Select a project" → "New Project"
- Name it "OneId Integration Test"
- Click "Create"

### 3. Configure OAuth Consent Screen
- Click "OAuth consent screen" in the left menu
- Choose "External" (for testing)
- Click "Create"
- Fill in:
  - **App name**: OneId Integration App
  - **User support email**: Your email
  - **Developer contact**: Your email
- Click "Save and Continue"
- Skip Scopes (click "Save and Continue")
- Skip Test users (click "Save and Continue")
- Click "Back to Dashboard"

### 4. Create OAuth Credentials
- Click "Credentials" in the left menu
- Click "Create Credentials" → "OAuth client ID"
- Choose "Web application"
- Name it "OneId Web Client"
- Under "Authorized redirect URIs", add:
  ```
  http://localhost:3000/auth/callback
  ```
- Click "Create"
- **Copy the Client ID and Client Secret**

### 5. Update .env File
Replace these values in `backend/.env`:
```env
ONEID_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
ONEID_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
```

### 6. Restart Server
```bash
cd backend
npm start
```

### 7. Test
- Open: http://localhost:3000
- Click "Login with One Id"
- You'll be redirected to Google login
- After login, you'll see your dashboard with Google profile info

## That's it! 🎉

The application will now use Google as your "One Id" provider.

## Troubleshooting

**Redirect URI mismatch error:**
- Make sure `http://localhost:3000/auth/callback` is added in Google Console
- No trailing slash
- Use http (not https) for localhost

**Access blocked error:**
- Add your email as a test user in OAuth consent screen
- Or publish the app (not recommended for testing)
