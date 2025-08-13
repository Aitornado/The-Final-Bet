# The Final Bet - Developer Setup Guide

## Overview

This guide provides comprehensive instructions for setting up a local development environment for **The Final Bet** Twitch Extension. It covers both frontend development and backend integration preparation.

**Prerequisites:**
- Node.js 18+ and npm/yarn
- Git for version control
- Modern web browser (Chrome/Firefox recommended)
- Twitch Developer Account (for extension testing)

---

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd the-final-bet

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### 2. Project Structure Overview

```
the-final-bet/
├── src/                    # Next.js application (React/TypeScript)
│   ├── app/               # App Router pages
│   ├── components/        # Reusable React components
│   └── types/            # TypeScript definitions
├── dist/                # Built production files
│   ├── viewer.html       # Viewer interface (vanilla JS)
│   ├── viewer.js         # Viewer logic
│   ├── config.html       # Streamer config (vanilla JS)
│   └── config.js         # Config logic with state machine
├── public/               # Static assets
└── docs/                 # Documentation files
```

---

## Frontend Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server  
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Kill development ports (utility)
npm run kill-ports
```

### Development Environment Configuration

**Environment Variables** (create `.env.local`):
```bash
# Development mode flag
NEXT_PUBLIC_DEV_MODE=true

# Twitch Extension Configuration (optional)
NEXT_PUBLIC_TWITCH_EXTENSION_CLIENT_ID=your_client_id
NEXT_PUBLIC_TWITCH_EXTENSION_VERSION=0.0.1
```

**Next.js Configuration** (`next.config.ts`):
```typescript
const nextConfig = {
  // Static export for Twitch Extension hosting
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  
  // Asset prefix for CDN deployment (production)
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://your-cdn.com' 
    : undefined,
}
```

### Component Development

**Key Components to Understand:**

1. **PredictionCard** (`/src/components/PredictionCard.tsx`)
   - Active betting interface for viewers
   - Handles bet placement and validation
   - Responsive design for different screen sizes

2. **GameProgress** (`/src/components/GameProgress.tsx`)
   - Shows locked prediction state
   - Displays vote breakdown and user's bet status
   - Real-time updates during game progress

3. **Config Components** (`/src/components/config/`)
   - Streamer management interface
   - Prediction creation and state control
   - Quick actions for prediction lifecycle

**Testing Components:**
```bash
# Run individual component in isolation
npm run dev
# Navigate to /config or /viewer to test interfaces
```

### State Management Testing

The application includes built-in testing controls:

**Viewer Interface Testing:**
- State toggle buttons (No Prediction → Active → Locked → Resolved)
- Mock bet placement and totals simulation
- User bet status simulation
- 100-viewer simulation button

**Config Interface Testing:**
- State machine validation
- Template prediction loading
- Quick action buttons for state transitions
- Error state simulation

---

## Twitch Extension Development

### Twitch Developer Rig Setup

1. **Install Twitch Developer Rig:**
   ```bash
   # Via npm (recommended)
   npm install -g @twitchdev/rig

   # Or download from: https://dev.twitch.tv/docs/extensions/rig/
   ```

2. **Configure Local Extension:**
   ```bash
   # Create new extension project in Rig
   # Point to your local server: http://localhost:3000
   # Configure views: config, viewer, mobile, panel
   ```

3. **Local HTTPS Setup** (required for Twitch Rig):
   ```bash
   # Install mkcert for local SSL certificates
   # macOS
   brew install mkcert
   mkcert -install
   mkcert localhost 127.0.0.1

   # Windows (using Chocolatey)
   choco install mkcert
   mkcert -install
   mkcert localhost 127.0.0.1

   # Update next.config.ts to use HTTPS in development
   ```

### Extension File Testing

**Production Extension Files** (built to `/dist/` directory):

These are the files built from the Next.js app that will be deployed to Twitch:

1. **viewer.html + viewer.js**
   - Vanilla JavaScript implementation
   - Self-contained with inline CSS
   - All Twitch Extension SDK integration
   - Production-ready with error handling

2. **config.html + config.js**  
   - Streamer management interface
   - State machine implementation
   - Template system for quick predictions
   - Real-time status updates

**Testing Extension Files:**
```bash
# Build and serve extension files locally
npm run build
npx http-server dist/ -p 8080 --cors

# Test in browser:
# Config: http://localhost:8080/config.html
# Viewer: http://localhost:8080/viewer.html
```

### Twitch Extension SDK Integration

**Mock Twitch Environment** (for development):
```javascript
// Add to development environment for testing
window.Twitch = {
  ext: {
    onAuthorized: (callback) => {
      callback({
        token: 'mock_jwt_token',
        userId: '12345678',
        channelId: '87654321'
      });
    },
    onContext: (callback) => {
      callback({
        theme: 'dark',
        mode: 'viewer'
      });
    },
    bits: {
      getProducts: () => Promise.resolve([
        { sku: 'bet_10', cost: { amount: 10, type: 'bits' } },
        { sku: 'bet_50', cost: { amount: 50, type: 'bits' } },
        { sku: 'bet_100', cost: { amount: 100, type: 'bits' } }
      ]),
      useBits: (sku) => console.log(`Mock Bits transaction: ${sku}`)
    }
  }
};
```

---

## Backend Development Preparation

### API Development Setup

**Recommended Stack:**
```bash
# Node.js backend setup
mkdir backend
cd backend
npm init -y

# Core dependencies
npm install express cors helmet dotenv
npm install jsonwebtoken axios socket.io
npm install mysql2 redis  # or your preferred database

# Development dependencies  
npm install -D nodemon typescript @types/node
npm install -D @types/express @types/jsonwebtoken
```

**Basic Express Server** (`backend/server.js`):
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-extension-domain.com'
    : 'http://localhost:3000'
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/bets', require('./routes/bets'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

### Database Setup

**MySQL Schema** (see API-SPECIFICATION.md for complete schema):
```sql
-- Create development database
CREATE DATABASE thefinalbetdev;
USE thefinalbetdev;

-- Run schema creation scripts
SOURCE db/schema.sql;

-- Insert test data
SOURCE db/test-data.sql;
```

**Environment Variables** (`.env`):
```bash
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=thefinalbetdev
DATABASE_USER=your_user
DATABASE_PASS=your_password

# Twitch Extension
TWITCH_EXTENSION_CLIENT_ID=your_client_id
TWITCH_EXTENSION_SECRET=your_base64_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379
```

### WebSocket Development

**Socket.io Setup** (`backend/websocket.js`):
```javascript
const { Server } = require('socket.io');

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Channel-specific rooms
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_channel', (channelId) => {
      socket.join(`channel_${channelId}`);
      console.log(`Socket ${socket.id} joined channel ${channelId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

// Broadcast to channel
function broadcastToChannel(io, channelId, event, data) {
  io.to(`channel_${channelId}`).emit(event, data);
}

module.exports = { initWebSocket, broadcastToChannel };
```

---

## Testing & Debugging

### Frontend Testing

**Component Testing:**
```bash
# Visual testing with different states
npm run dev

# Navigate through all prediction states:
# 1. http://localhost:3000/viewer (test viewer interface)
# 2. http://localhost:3000/config (test streamer interface)

# Use built-in testing controls to simulate:
# - State transitions
# - Bet placement
# - Error conditions
# - Responsive design
```

**Browser Developer Tools:**
- Check Console for extension SDK integration
- Network tab to monitor API calls (when backend connected)
- Responsive design testing for different screen sizes
- Performance profiling for extension constraints

### Extension File Testing

**Manual Testing Workflow:**
```bash
# 1. Build and test extension files
npm run build
npx http-server dist/ -p 8080

# 2. Open in browser with developer tools
# Config: http://localhost:8080/config.html
# Viewer: http://localhost:8080/viewer.html

# 3. Test all state transitions:
# - Create prediction (config)
# - Place bet (viewer)  
# - Close betting (config)
# - Resolve prediction (config)

# 4. Test error conditions:
# - Invalid inputs
# - Network errors
# - State conflicts
```

**Integration Testing with Twitch Developer Rig:**
1. Configure extension in Rig with local URLs
2. Test all views (mobile, panel, overlay, config)
3. Verify Twitch SDK integration
4. Test with different user roles (broadcaster, viewer)
5. Validate responsive design across viewports

### Backend API Testing

**Manual API Testing** (using curl or Postman):
```bash
# Health check
curl http://localhost:3001/health

# Create prediction (with mock JWT)
curl -X POST http://localhost:3001/api/predictions \
  -H "Authorization: Bearer mock_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"question":"Will my team win?","options":[{"id":"yes","text":"Yes"},{"id":"no","text":"No"}]}'

# Place bet
curl -X POST http://localhost:3001/api/bets \
  -H "Authorization: Bearer mock_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"prediction_id":"pred_123","option":"yes","amount":100}'
```

**WebSocket Testing:**
```javascript
// Test WebSocket connection in browser console
const ws = new WebSocket('ws://localhost:3001');
ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Message:', event.data);

// Test channel subscription
ws.send(JSON.stringify({
  type: 'join_channel',
  channel_id: '87654321'
}));
```

---

## Production Build & Deployment

### Frontend Build Process

```bash
# Clean build
rm -rf .next dist

# Production build
npm run build

# Verify build output
ls -la dist/
```

**Build Output Structure:**
```
dist/
├── config.html          # Streamer interface
├── viewer.html           # Viewer interface  
├── static/              # Optimized assets
│   ├── chunks/          # JavaScript bundles
│   └── css/             # Stylesheets
└── _next/               # Next.js build artifacts
```

### CDN Deployment Preparation

**Asset Upload Checklist:**
- [ ] Upload entire `dist/` folder to CDN
- [ ] Maintain directory structure
- [ ] Configure CORS headers
- [ ] Set proper Content-Type headers
- [ ] Enable gzip compression
- [ ] Configure cache headers

**Manifest URL Updates:**
```json
// Update manifest.json before Twitch submission
{
  "views": {
    "config": {
      "viewer_url": "https://your-cdn.com/config.html"
    },
    "panel": {
      "viewer_url": "https://your-cdn.com/viewer.html"  
    }
  }
}
```

### Backend Deployment

**Production Environment Variables:**
```bash
NODE_ENV=production
PORT=3001

# Database (production)
DATABASE_HOST=your-production-db-host
DATABASE_NAME=thefinalbet

# Twitch Extension (production)
TWITCH_EXTENSION_CLIENT_ID=your_production_client_id
TWITCH_EXTENSION_SECRET=your_production_secret

# CORS configuration
ALLOWED_ORIGINS=https://extension-files.twitch.tv

# Security
HELMET_CSP_ENABLED=true
RATE_LIMIT_ENABLED=true
```

---

## Debugging & Troubleshooting

### Common Issues

**1. Twitch Extension SDK Not Loading**
```javascript
// Check if Twitch object exists
if (typeof window !== 'undefined' && window.Twitch?.ext) {
  console.log('Twitch Extension SDK loaded');
} else {
  console.error('Twitch Extension SDK not available');
  // Fallback to development mode
}
```

**2. CORS Issues in Development**
```javascript
// Next.js development server CORS
// Add to next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};
```

**3. JWT Validation Issues**
```javascript
// Debug JWT payload
const jwt = require('jsonwebtoken');
const token = 'your_jwt_token';

try {
  const decoded = jwt.decode(token, { complete: true });
  console.log('JWT Header:', decoded.header);
  console.log('JWT Payload:', decoded.payload);
} catch (error) {
  console.error('JWT decode error:', error);
}
```

**4. State Machine Issues**
```javascript
// Enable state machine debugging
window.DEBUG_STATE_MACHINE = true;

// Check current state in browser console
console.log('Current state:', predictionManager.currentState);
console.log('Current prediction:', predictionManager.currentPrediction);
```

### Performance Debugging

**Extension Performance Constraints:**
- Maximum bundle size: ~1MB total
- First paint: <3 seconds
- Memory usage: <50MB per view
- No blocking operations >100ms

**Debugging Tools:**
```javascript
// Measure component render time
console.time('Component Render');
// ... component logic
console.timeEnd('Component Render');

// Monitor memory usage
console.log('Memory:', performance.memory);

// Check bundle size
webpack-bundle-analyzer dist/static/chunks/
```

---

## Development Workflow

### Recommended Development Flow

1. **Frontend First Development:**
   ```bash
   # Start with UI components
   npm run dev
   # Test all states with mock data
   # Verify responsive design
   # Validate user experience
   ```

2. **Extension Integration:**
   ```bash
   # Build and test production extension files
   npm run build
   npx http-server dist/ -p 8080
   # Verify Twitch SDK integration
   # Test in Twitch Developer Rig
   ```

3. **Backend Integration:**
   ```bash
   # Replace mock data with API calls
   # Implement WebSocket connection
   # Add error handling and retry logic
   # Test end-to-end workflows
   ```

4. **Production Deployment:**
   ```bash
   # Build and deploy frontend to CDN
   # Deploy backend to cloud provider
   # Update Twitch Extension manifest
   # Submit for review
   ```

### Version Control Best Practices

```bash
# Branch naming
feature/api-integration
feature/websocket-setup  
bugfix/jwt-validation
release/v1.0.0

# Commit messages
feat: add real-time bet totals updates
fix: resolve JWT validation edge case
docs: update API specification
refactor: optimize state machine performance
```

---

## Resources & References

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Twitch Extensions Documentation](https://dev.twitch.tv/docs/extensions/)
- [Twitch Developer Rig](https://github.com/twitchdev/developer-rig)
- [Twitch Bits Guide](https://dev.twitch.tv/docs/extensions/bits/)

### Development Tools
- [Twitch Extension Helper](https://www.npmjs.com/package/twitch-ext-helper)
- [JWT.io Debugger](https://jwt.io/)
- [Postman API Testing](https://www.postman.com/)
- [Socket.io Client Testing](https://socket.io/docs/v4/client-api/)

### Community Resources
- [Twitch Developers Discord](https://discord.gg/twitchdev)
- [Twitch Extensions Community](https://discuss.dev.twitch.tv/c/extensions)
- [GitHub Twitch Extensions Examples](https://github.com/twitchdev)

---

*This setup guide provides everything needed to start developing The Final Bet extension. Begin with frontend development using the built-in testing tools, then gradually integrate backend services as they're implemented.*