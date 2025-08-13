# The Final Bet - Twitch Extension Deployment Guide

## Overview
This guide covers deploying "The Final Bet" as a Twitch Extension, including configuration, asset hosting, and backend requirements.

## Prerequisites
- Twitch Developer Account
- Extension registered in Twitch Developer Console
- CDN hosting for static assets
- Backend service for prediction state management

## 1. Extension Configuration

### Manifest Configuration
The `manifest.json` file contains all extension metadata. Update these fields before submission:

```json
{
  "developer_name": "YourDeveloperName",
  "support_email": "support@example.com", 
  "website_url": "https://yourwebsite.com",
  "privacy_policy_url": "https://yourwebsite.com/privacy",
  "sku": "your-unique-sku"
}
```

### Asset URLs
Update all placeholder URLs in manifest.json:
- `icon_urls`: Upload extension icons to your CDN
- `screenshot_urls`: Upload screenshots for store listing
- `assetPrefix` in next.config.ts: Set to your CDN URL

## 2. Build Process

### Production Build
```bash
npm run build
```

### Files to Upload to CDN
Upload the entire `dist/` folder contents to your CDN, maintaining the directory structure:
- `dist/config.html` → `https://your-cdn.com/config.html`
- `dist/viewer.html` → `https://your-cdn.com/viewer.html`
- `dist/static/` → `https://your-cdn.com/static/`

### Twitch Developer Console Setup
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create new extension or update existing
3. Upload `manifest.json`
4. Set asset hosting URLs:
   - Config URL: `https://your-cdn.com/config.html`
   - Viewer URL: `https://your-cdn.com/viewer.html`

## 3. Bits Integration

### Product Configuration
Configure Bits products in Twitch Developer Console:
- Navigate to Extensions → Your Extension → Monetization
- Create products matching `bits_products` in manifest.json
- Test transactions in local development

### Bits SKU Mapping
```javascript
const bitsProducts = {
  'bet_10': 10,
  'bet_50': 50,
  'bet_100': 100,
  'bet_500': 500,
  'bet_1000': 1000
}
```

## 4. Backend Requirements

### Required Endpoints
You'll need a backend service with these capabilities:

#### Authentication
- JWT validation using Twitch Extension Helper
- Channel ID and user ID extraction

#### Prediction Management
```
POST /api/predictions - Create new prediction
GET /api/predictions/:id - Get prediction details
PUT /api/predictions/:id - Update prediction (lock/resolve)
DELETE /api/predictions/:id - Cancel prediction
```

#### Betting System
```
POST /api/bets - Place a bet
GET /api/bets/user/:userId - Get user's bets
GET /api/predictions/:id/totals - Get bet totals
```

#### Real-time Updates
- WebSocket or PubSub for live bet updates
- Channel-specific rooms for predictions
- Broadcast bet totals and state changes

### Environment Variables
```bash
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

## 5. Security Considerations

### JWT Validation
Always validate Twitch JWTs on your backend:
```javascript
const jwt = require('jsonwebtoken');

function validateTwitchJWT(token) {
  return jwt.verify(token, Buffer.from(secret, 'base64'), {
    algorithms: ['HS256']
  });
}
```

### Bits Transaction Verification
- Verify all Bits transactions server-side
- Never trust client-side transaction data
- Store transaction receipts for audit trail

### Rate Limiting
- Implement rate limiting for bet placement
- Prevent spam and abuse
- Monitor for suspicious activity

## 6. Testing

### Local Testing
1. Use Twitch Extension Developer Rig
2. Load local files for testing
3. Test all extension views (mobile, panel, overlay, config)

### Bits Testing
- Use Twitch's sandbox environment
- Test transaction flows
- Verify payout calculations

### Browser Compatibility
- Test on all major browsers
- Verify mobile responsiveness
- Test on different Twitch themes (light/dark)

## 7. Submission Process

### Pre-submission Checklist
- [ ] All assets uploaded to CDN
- [ ] Manifest URLs updated
- [ ] Privacy policy accessible
- [ ] Screenshots and icons uploaded
- [ ] Extension tested in Twitch Developer Rig
- [ ] Bits integration tested
- [ ] Backend APIs deployed and tested

### Review Process
1. Submit for review in Twitch Developer Console
2. Address any feedback from Twitch review team
3. Update assets and resubmit if needed
4. Approval typically takes 2-4 weeks

## 8. Post-Launch

### Monitoring
- Monitor extension usage metrics
- Track Bits transaction volumes
- Monitor backend API performance
- Set up error logging and alerting

### Updates
- Use versioning for extension updates
- Test updates thoroughly before deployment
- Communicate changes to users if needed

### Support
- Provide clear support documentation
- Monitor support channels for issues
- Keep privacy policy and terms updated

## Common Issues

### CORS Errors
Ensure your CDN serves files with proper CORS headers:
```
Access-Control-Allow-Origin: https://extension-files.twitch.tv
```

### JWT Issues
- Verify JWT secret matches Twitch's base64 encoded secret
- Check token expiration times
- Validate token structure and claims

### Asset Loading
- Use HTTPS for all assets
- Ensure proper Content-Type headers
- Test asset loading from different regions

## Resources
- [Twitch Extensions Documentation](https://dev.twitch.tv/docs/extensions/)
- [Twitch Extensions Reference](https://dev.twitch.tv/docs/extensions/reference)
- [Twitch Developer Rig](https://github.com/twitchdev/developer-rig)
- [Extension Helper Library](https://dev.twitch.tv/docs/extensions/reference/#twitch-extension-helper-library)