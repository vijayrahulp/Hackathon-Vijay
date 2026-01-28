const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
function createTransporter() {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

/**
 * Send OTP via email
 */
async function sendOTPEmail(email, otp, userName) {
  const transporter = createTransporter();

  // If no email config, log to console
  if (!transporter) {
    console.log('\n' + '='.repeat(50));
    console.log('📧 OTP EMAIL (Console Mode - Email not configured)');
    console.log('='.repeat(50));
    console.log(`To: ${email}`);
    console.log(`Name: ${userName}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Valid for: 10 minutes`);
    console.log('='.repeat(50) + '\n');
    return true;
  }

  // Send actual email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'OneID Portal <noreply@oneid.gov>',
      to: email,
      subject: 'Your OneID Login OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d7a4f 0%, #1a5c3a 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-box { background: white; border: 2px solid #2d7a4f; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #2d7a4f; letter-spacing: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 OneID Portal</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>You have requested to login to OneID Portal. Please use the following One-Time Password (OTP) to complete your authentication:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>This code will expire in 10 minutes.</strong></p>
              
              <p>If you didn't request this code, please ignore this email or contact our support team.</p>
              
              <div class="footer">
                <p>This is an automated email from OneID Portal. Please do not reply.</p>
                <p>For assistance, contact Help desk at 045151555</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log(`✓ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    // Fallback to console
    console.log('\n' + '='.repeat(50));
    console.log('📧 OTP EMAIL (Email failed - showing in console)');
    console.log('='.repeat(50));
    console.log(`To: ${email}`);
    console.log(`Name: ${userName}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Valid for: 10 minutes`);
    console.log('='.repeat(50) + '\n');
    return true;
  }
}

module.exports = {
  sendOTPEmail
};
