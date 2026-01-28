const crypto = require('crypto');

/**
 * Generate QR Code data for offer redemption
 */
function generateQRCode(offerId, userId) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const data = `${offerId}:${userId}:${timestamp}`;
  
  // Create a signature to prevent tampering
  const secret = process.env.QR_SECRET || 'dewa-store-secret-key';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
    .substring(0, 16);
  
  return {
    code: `${data}:${signature}`,
    data: {
      offerId,
      userId,
      timestamp,
      signature
    }
  };
}

/**
 * Validate QR Code
 */
function validateQRCode(qrCode) {
  try {
    const parts = qrCode.split(':');
    if (parts.length !== 4) {
      return { valid: false, error: 'Invalid QR code format' };
    }

    const [offerId, userId, timestamp, signature] = parts;
    
    // Check if QR code is not too old (valid for 5 minutes)
    const now = Date.now();
    const qrTimestamp = parseInt(timestamp);
    const fiveMinutes = 5 * 60 * 1000;
    
    if (now - qrTimestamp > fiveMinutes) {
      return { valid: false, error: 'QR code has expired' };
    }

    // Verify signature
    const data = `${offerId}:${userId}:${timestamp}`;
    const secret = process.env.QR_SECRET || 'dewa-store-secret-key';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex')
      .substring(0, 16);

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid QR code signature' };
    }

    return {
      valid: true,
      data: {
        offerId,
        userId,
        timestamp: qrTimestamp
      }
    };
  } catch (error) {
    return { valid: false, error: 'QR code validation failed' };
  }
}

/**
 * Generate QR code URL for display
 */
function generateQRCodeURL(offerId, userId) {
  const qrData = generateQRCode(offerId, userId);
  // In production, this would generate an actual QR code image
  // For now, we return the encoded data
  const encoded = encodeURIComponent(qrData.code);
  return `/api/qr/${encoded}`;
}

module.exports = {
  generateQRCode,
  validateQRCode,
  generateQRCodeURL
};
