# Email and OAuth Configuration Test

## Current Issues

### Issue 1: OTP Not Coming to Email
**Status**: The email service is configured but may not be sending actual emails.

**Root Cause**: 
- Gmail requires an "App Password" not your regular Gmail password
- The password `skeeltwegrzysglm` appears to be an App Password

**To Fix Gmail SMTP**:

1. **Verify Gmail App Password is Active**:
   - Go to: https://myaccount.google.com/apppasswords
   - Login with vijayrahul97@gmail.com
   - If the app password is deleted, create a new one:
     - Select "Mail" as the app
     - Select "Other" as the device
     - Name it "OneID Portal"
     - Copy the generated 16-character password
     - Update `.env` file with: `EMAIL_PASSWORD=<new-app-password>`

2. **Enable Less Secure App Access** (if App Passwords don't work):
   - Go to: https://myaccount.google.com/lesssecureapps
   - Turn ON "Allow less secure apps"
   - Note: This is less secure but may be necessary for testing

3. **Check 2-Step Verification**:
   - App Passwords require 2-Step Verification to be enabled
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

### Issue 2: Google OAuth Not Working
**Status**: Configuration is now loaded correctly

**Current Configuration**:
```
ONEID_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
ONEID_CLIENT_SECRET=GOCSPX-your-client-secret
ONEID_REDIRECT_URI=http://localhost:3000/auth/callback
```

**To Verify Google OAuth Setup**:

1. **Check OAuth Consent Screen**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Select your project
   - Go to "OAuth consent screen"
   - Ensure status is "In production" or "Testing"
   - Add vijayrahul97@gmail.com to test users if in Testing mode

2. **Verify Redirect URI**:
   - Go to "Credentials" tab
   - Click on your OAuth 2.0 Client ID
   - Under "Authorized redirect URIs", ensure you have:
     - `http://localhost:3000/auth/callback`
   - Click "Save" if you add it

3. **Test OAuth Flow**:
   - Click "Login with OneID (Google)" button on login page
   - Should redirect to Google login
   - After login, should redirect back to your app

## Testing Steps

### Test 1: Check Configuration Loaded
```bash
curl http://localhost:3000/api/test-config
```

Expected output should show all fields as "Configured"

### Test 2: Test Custom Login with OTP
1. Go to: http://localhost:3000
2. Enter credentials:
   - Username: `vijayrahul97`
   - Password: `Demo@123`
3. Click "Login"
4. Check terminal for OTP (will show in console if email fails)
5. Check email inbox for OTP
6. Enter OTP on verification page

### Test 3: Test Google OAuth
1. Go to: http://localhost:3000
2. Click "Login with OneID (Google)"
3. Should redirect to Google
4. Login with vijayrahul97@gmail.com
5. Should redirect back to dashboard

## Current Email Configuration

File: `backend/.env`
```env
EMAIL_SERVICE=gmail
EMAIL_USER=vijayrahul97@gmail.com
EMAIL_PASSWORD=skeeltwegrzysglm
EMAIL_FROM=OneID Portal <noreply@oneid.gov>
```

## Email Service Code

The email service in `backend/services/emailService.js` now uses:
```javascript
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
}
```

## Quick Fixes Applied

1. ✅ Fixed `.env` loading path in server.js
2. ✅ Updated email transporter to use explicit Gmail SMTP settings
3. ✅ Added configuration test endpoint
4. ✅ Added email transporter logging
5. ✅ Added error handling with console fallback

## Next Steps

1. **Verify App Password**: Most likely cause of email issues
2. **Test OAuth Redirect URI**: Ensure it's added in Google Console
3. **Check Email Inbox**: Including spam folder
4. **Review Terminal Logs**: Check for email sending confirmation

## Alternative: Use Console OTP for Testing

If email continues to fail, the system will show OTP in the terminal console. This is acceptable for development/testing.

Look for output like:
```
==================================================
📧 OTP EMAIL (Email failed - showing in console)
==================================================
To: vijayrahul97@gmail.com
Name: Vijay Rahul
OTP Code: 123456
Valid for: 10 minutes
==================================================
```

## Troubleshooting Commands

```powershell
# Check if server is running
Get-Process -Name node

# View server logs in real-time
Get-Content "server.log" -Wait

# Test email configuration
curl http://localhost:3000/api/test-config

# Restart server
Stop-Process -Name node -Force
cd "c:\Users\vijay\Hackthon Challenge"
node backend/server.js
```

## Support

If issues persist:
1. Check Gmail account security settings
2. Try creating a new App Password
3. Verify 2-Step Verification is enabled
4. Check Google OAuth consent screen configuration
5. Ensure redirect URI matches exactly (including protocol and port)
