# Gmail Setup for Sending OTP Emails

## Steps to Enable Email Sending

### 1. Enable 2-Step Verification on Your Gmail Account
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Under "Signing in to Google", enable "2-Step Verification"
4. Follow the setup process

### 2. Create an App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter name: "OneID Portal"
5. Click "Generate"
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### 3. Update .env File
Edit `backend/.env` and add:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=OneID Portal <noreply@oneid.gov>
```

**Important:** Use the 16-character App Password, NOT your regular Gmail password!

### 4. Restart the Server
```bash
cd backend
npm start
```

## Alternative: Use a Different Email Service

### SendGrid (Recommended for Production)
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Outlook/Hotmail
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

### Custom SMTP Server
```env
EMAIL_HOST=smtp.yourserver.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASSWORD=your_password
EMAIL_SECURE=false
```

## Testing

After configuration:
1. Login with username: `vijayrahul97@gmail.com`
2. Password: `Demo@123`
3. Check your inbox for the OTP email
4. If email fails, the OTP will still show in the console/terminal

## Troubleshooting

**"Less secure app access"**: Gmail requires App Password with 2-Step Verification enabled.

**Email not arriving**: 
- Check spam/junk folder
- Verify App Password is correct (no spaces)
- Check console for error messages

**Still using console**: This means EMAIL_USER and EMAIL_PASSWORD are not set in .env file.
