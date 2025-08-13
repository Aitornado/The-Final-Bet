# The Final Bet - Twitch Integration Guide

## Overview

This document provides comprehensive guidance for integrating **The Final Bet** with the Twitch platform, including Extension SDK usage, Bits integration, authentication flows, and submission requirements.

**Twitch Extension Features:**
- Multi-view support (Mobile, Panel, Video Overlay, Configuration)
- Twitch Bits monetization with 6 product tiers
- Real-time viewer authentication and authorization
- Channel-specific data isolation and management

---

## Twitch Extension SDK Integration

### SDK Initialization

**React/Next.js Integration** (`src/app/viewer/page.tsx`):
```typescript
import { TwitchAuth, TwitchContext } from '@/types/twitch-ext'

export default function ViewerPage() {
  const [twitchAuth, setTwitchAuth] = useState<TwitchAuth | null>(null)
  const [twitchContext, setTwitchContext] = useState<TwitchContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Twitch Extension SDK
    if (typeof window !== 'undefined' && window.Twitch?.ext) {
      console.log('Initializing Twitch Extension SDK...')
      
      // Authentication handler
      window.Twitch.ext.onAuthorized((auth: TwitchAuth) => {
        console.log('Twitch Extension Authorized:', auth)
        setTwitchAuth(auth)
        setIsLoading(false)
        
        // Initialize real-time connection with authenticated user
        initializeWebSocketConnection(auth)
      })

      // Context updates (theme, mode, language)
      window.Twitch.ext.onContext((context: TwitchContext) => {
        console.log('Twitch Context Updated:', context)
        setTwitchContext(context)
        
        // Apply theme changes
        applyTwitchTheme(context.theme)
      })

      // Error handling
      window.Twitch.ext.onError((err: any) => {
        console.error('Twitch Extension Error:', err)
        setError('Failed to connect to Twitch')
        setIsLoading(false)
      })
      
    } else {
      // Development fallback
      console.log('Development mode: Twitch Extension SDK not available')
      initializeMockTwitchEnvironment()
      setIsLoading(false)
    }
  }, [])

  return (
    // Component JSX
  )
}
```

**Vanilla JavaScript Integration** (production build output):
```javascript
// Initialize Twitch Extension in production environment
document.addEventListener('DOMContentLoaded', function() {
  console.log('The Final Bet Extension Loading...')
  
  // Check for Twitch Extension SDK
  if (window.Twitch && window.Twitch.ext) {
    console.log('Twitch Extension SDK detected')
    
    // Set up authentication
    window.Twitch.ext.onAuthorized(function(auth) {
      console.log('Extension authorized:', auth)
      
      // Store auth data
      twitchAuth = {
        token: auth.token,
        userId: auth.userId,
        channelId: auth.channelId,
        role: auth.role
      }
      
      // Initialize extension with authenticated user
      initializeExtension()
    })
    
    // Handle context changes
    window.Twitch.ext.onContext(function(context, changed) {
      console.log('Context updated:', context, changed)
      
      // Apply theme if changed
      if (changed.includes('theme')) {
        applyTheme(context.theme)
      }
    })
    
  } else {
    console.error('Twitch Extension SDK not available')
    showErrorState('Extension failed to load')
  }
})
```

### Authentication & Authorization

**JWT Token Structure:**
```javascript
// Twitch Extension JWT payload
{
  "exp": 1641234567,           // Token expiration
  "iat": 1641230967,           // Issued at
  "opaque_user_id": "U12345",  // Anonymous user ID
  "user_id": "12345678",       // Authenticated user ID (if logged in)
  "channel_id": "87654321",    // Current channel
  "role": "viewer",            // User role: viewer, moderator, broadcaster
  "is_unlinked": false,        // User account linkage status
  "pubsub_perms": {
    "send": ["broadcast"],     // PubSub permissions
    "listen": ["broadcast", "global"]
  }
}
```

**Role-Based Access Control:**
```typescript
// Type definitions for user roles
type TwitchRole = 'viewer' | 'moderator' | 'broadcaster'

interface TwitchAuth {
  token: string
  userId?: string
  opaqueUserId?: string
  channelId: string
  role: TwitchRole
}

// Permission checking utility
const hasPermission = (auth: TwitchAuth, action: string): boolean => {
  switch (action) {
    case 'create_prediction':
    case 'manage_prediction':
      return auth.role === 'broadcaster' || auth.role === 'moderator'
    
    case 'place_bet':
    case 'view_prediction':
      return true // All users can place bets and view
      
    case 'access_analytics':
      return auth.role === 'broadcaster'
      
    default:
      return false
  }
}

// Usage in components
const canManagePredictions = hasPermission(twitchAuth, 'create_prediction')
```

**Anonymous User Handling:**
```typescript
// Handle both authenticated and anonymous users
const getUserIdentifier = (auth: TwitchAuth): string => {
  // Prefer authenticated user ID, fallback to opaque ID
  return auth.userId || auth.opaqueUserId || 'anonymous'
}

const isAuthenticatedUser = (auth: TwitchAuth): boolean => {
  return !!auth.userId && !auth.is_unlinked
}

// Conditional UI based on authentication status
{isAuthenticatedUser(twitchAuth) ? (
  <AuthenticatedBettingInterface />
) : (
  <AnonymousBettingInterface 
    onLinkAccount={() => window.Twitch.ext.actions.requestIdShare()}
  />
)}
```

---

## Twitch Bits Integration

### Bits Products Configuration

**Manifest Configuration** (root `manifest.json`):
```json
{
  "bits_enabled": true,
  "bits_sku": "thefinalbetbits",
  "bits_products": [
    {
      "sku": "bet_10",
      "displayName": "10 Bits Bet",
      "amount": 10,
      "inDevelopment": false
    },
    {
      "sku": "bet_50", 
      "displayName": "50 Bits Bet",
      "amount": 50,
      "inDevelopment": false
    },
    {
      "sku": "bet_100",
      "displayName": "100 Bits Bet", 
      "amount": 100,
      "inDevelopment": false
    },
    {
      "sku": "bet_500",
      "displayName": "500 Bits Bet",
      "amount": 500,
      "inDevelopment": false
    },
    {
      "sku": "bet_1000",
      "displayName": "1000 Bits Bet",
      "amount": 1000,
      "inDevelopment": false
    },
    {
      "sku": "bet_custom",
      "displayName": "Custom Bet Amount",
      "amount": 0,
      "inDevelopment": false
    }
  ]
}
```

### Bits Transaction Flow

**Frontend Implementation:**
```typescript
const handlePlaceBet = async (option: string, amount: number) => {
  if (!prediction || !twitchAuth) return
  
  try {
    // Get available Bits products
    if (window.Twitch?.ext?.bits) {
      const products = await window.Twitch.ext.bits.getProducts()
      console.log('Available Bits products:', products)
      
      // Find matching product or use custom
      const product = products.find(p => p.cost.amount === amount) || 
                     products.find(p => p.sku === 'bet_custom')
      
      if (!product) {
        throw new Error('Bits product not available')
      }
      
      // Initiate Bits transaction
      window.Twitch.ext.bits.useBits(product.sku)
      
      // Set up transaction completion handler
      window.Twitch.ext.bits.onTransactionComplete((transaction) => {
        console.log('Bits transaction completed:', transaction)
        
        // Send transaction to backend for verification
        completeBetTransaction(option, amount, transaction)
      })
      
      // Handle transaction cancellation
      window.Twitch.ext.bits.onTransactionCancelled(() => {
        console.log('Bits transaction cancelled')
        setError('Transaction cancelled')
      })
      
    } else {
      // Development fallback - simulate transaction
      console.log(`Simulating Bits transaction: ${amount} bits for ${option}`)
      simulateBetPlacement(option, amount)
    }
    
  } catch (error) {
    console.error('Bits transaction error:', error)
    setError('Failed to process Bits transaction')
  }
}
```

**Backend Transaction Verification:**
```javascript
// Verify Bits transaction server-side
async function verifyBitsTransaction(transactionToken) {
  try {
    const response = await fetch('https://api.twitch.tv/extensions/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${appAccessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        extension_client_id: process.env.TWITCH_EXTENSION_CLIENT_ID,
        user_id: userId,
        product: {
          sku: product.sku,
          cost: {
            amount: product.amount,
            type: 'bits'
          }
        },
        receipt: transactionToken
      })
    })

    const result = await response.json()
    
    if (result.status === 'FULFILLED') {
      return { success: true, transactionId: result.id }
    } else {
      return { success: false, error: result.status }
    }
    
  } catch (error) {
    console.error('Transaction verification failed:', error)
    return { success: false, error: 'VERIFICATION_FAILED' }
  }
}
```

### Bits UI Components

**Custom Bits Input Component:**
```typescript
const BitsInput: React.FC<{
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}> = ({ value, onChange, disabled = false }) => {
  const presetAmounts = [10, 50, 100, 500, 1000]
  
  return (
    <div className="bits-input-container">
      {/* Bits icon */}
      <div className="flex items-center gap-2 mb-3">
        <BitsIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Bits to bet:</span>
      </div>
      
      {/* Preset amount buttons */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {presetAmounts.map(amount => (
          <button
            key={amount}
            onClick={() => onChange(amount)}
            disabled={disabled}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              value === amount
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
            } border`}
          >
            {amount}
          </button>
        ))}
      </div>
      
      {/* Custom amount input */}
      <div className="flex items-center gap-2">
        <BitsIcon className="w-4 h-4 text-purple-400" />
        <input
          type="number"
          min={1}
          max={10000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          placeholder="Custom amount"
        />
      </div>
    </div>
  )
}

// Bits icon component
const BitsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M8 0L12 4L8 8L4 4L8 0Z" fill="url(#bitsGradient)"/>
    <path d="M8 8L12 12L8 16L4 12L8 8Z" fill="url(#bitsGradient2)"/>
    <defs>
      <linearGradient id="bitsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9146FF"/>
        <stop offset="50%" stopColor="#00D4FF"/>
        <stop offset="100%" stopColor="#9146FF"/>
      </linearGradient>
      <linearGradient id="bitsGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF"/>
        <stop offset="50%" stopColor="#9146FF"/>
        <stop offset="100%" stopColor="#00D4FF"/>
      </linearGradient>
    </defs>
  </svg>
)
```

---

## Extension Views Configuration

### Multi-View Architecture

**View Specifications:**
```json
{
  "views": {
    "mobile": {
      "viewer_url": "viewer.html",
      "aspect_width": 375,
      "aspect_height": 667,
      "autoscale": true,
      "scale_pixels": 1080,
      "zoom": true,
      "zoom_pixels": 1024
    },
    "panel": {
      "viewer_url": "viewer.html",
      "height": 600,
      "can_link_external_content": false
    },
    "video_overlay": {
      "viewer_url": "viewer.html",
      "can_link_external_content": false
    },
    "config": {
      "viewer_url": "config.html",
      "can_link_external_content": false
    }
  }
}
```

### Responsive View Handling

**View-Aware Component Design:**
```typescript
// Detect current Twitch view context
const useTwitchViewContext = () => {
  const [viewContext, setViewContext] = useState<{
    mode: string
    theme: string
    language: string
  } | null>(null)

  useEffect(() => {
    if (window.Twitch?.ext) {
      window.Twitch.ext.onContext((context) => {
        setViewContext({
          mode: context.mode,        // 'viewer', 'dashboard', 'config'
          theme: context.theme,      // 'light', 'dark'
          language: context.language // 'en', 'es', etc.
        })
      })
    }
  }, [])

  return viewContext
}

// View-specific styling
const getViewClasses = (mode: string) => {
  switch (mode) {
    case 'panel':
      return 'max-w-xs p-2 text-sm' // Compact panel layout
    case 'mobile':
      return 'max-w-sm p-3 text-base' // Mobile-optimized layout
    case 'overlay':
      return 'bg-black/80 backdrop-blur-sm' // Overlay transparency
    case 'config':
      return 'max-w-4xl p-6 text-lg' // Desktop configuration
    default:
      return 'max-w-md p-4'
  }
}
```

### Theme Integration

**Dynamic Theme Application:**
```typescript
const applyTwitchTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement
  
  if (theme === 'light') {
    root.classList.add('twitch-light-theme')
    root.classList.remove('twitch-dark-theme')
  } else {
    root.classList.add('twitch-dark-theme')
    root.classList.remove('twitch-light-theme')
  }
}

// CSS theme variables
:root {
  /* Dark theme (default) */
  --twitch-background: #0e0e10;
  --twitch-surface: #18181b;
  --twitch-text: #efeff1;
  --twitch-text-secondary: #adadb8;
  --twitch-border: #464649;
}

.twitch-light-theme {
  --twitch-background: #ffffff;
  --twitch-surface: #f7f8fa;
  --twitch-text: #0e0e10;
  --twitch-text-secondary: #53535f;
  --twitch-border: #dedee3;
}

/* Use theme variables in components */
.prediction-card {
  background: var(--twitch-surface);
  color: var(--twitch-text);
  border: 1px solid var(--twitch-border);
}
```

---

## Extension Configuration System

### Configuration Data Management

**Configuration Schema:**
```typescript
interface ExtensionConfig {
  // Broadcaster settings
  defaultBettingWindow: number      // seconds
  maxBetAmount: number             // Bits
  minBetAmount: number             // Bits
  enableLeaderboard: boolean
  enableStatistics: boolean
  
  // Appearance settings
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  
  // Game integration
  gameMode: 'manual' | 'api_integration'
  gameApiEndpoint?: string
  autoResolveTimeout?: number
  
  // Notification settings
  enableBetNotifications: boolean
  enableResultNotifications: boolean
  soundEnabled: boolean
}
```

**Configuration Storage:**
```javascript
// Store configuration using Twitch Extension API
function saveConfiguration(config) {
  const configString = JSON.stringify(config)
  
  window.Twitch.ext.configuration.set('broadcaster', '1.0', configString)
}

// Load configuration
function loadConfiguration() {
  const configData = window.Twitch.ext.configuration.broadcaster?.content
  
  if (configData) {
    return JSON.parse(configData)
  }
  
  // Return default configuration
  return getDefaultConfig()
}

// Listen for configuration changes
window.Twitch.ext.configuration.onChanged(() => {
  const newConfig = loadConfiguration()
  applyConfiguration(newConfig)
})
```

### Configuration UI Implementation

**Config Form Component:**
```typescript
const ConfigurationForm: React.FC = () => {
  const [config, setConfig] = useState<ExtensionConfig>(getDefaultConfig())
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Validate configuration
      const validationErrors = validateConfig(config)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }
      
      // Save to Twitch
      await saveConfiguration(config)
      
      // Update UI
      showNotification('Configuration saved successfully!', 'success')
      
    } catch (error) {
      showNotification(`Failed to save: ${error.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <ConfigSection title="Betting Settings">
        <FormField
          label="Default Betting Window (seconds)"
          type="number"
          value={config.defaultBettingWindow}
          onChange={(value) => setConfig(prev => ({ ...prev, defaultBettingWindow: value }))}
          min={30}
          max={300}
        />
        
        <FormField
          label="Maximum Bet Amount (Bits)"
          type="number"
          value={config.maxBetAmount}
          onChange={(value) => setConfig(prev => ({ ...prev, maxBetAmount: value }))}
          min={1}
          max={10000}
        />
      </ConfigSection>
      
      <ConfigSection title="Appearance">
        <ColorPicker
          label="Primary Color"
          value={config.primaryColor}
          onChange={(color) => setConfig(prev => ({ ...prev, primaryColor: color }))}
        />
        
        <Toggle
          label="Enable Leaderboard"
          checked={config.enableLeaderboard}
          onChange={(checked) => setConfig(prev => ({ ...prev, enableLeaderboard: checked }))}
        />
      </ConfigSection>
      
      <div className="form-actions">
        <button 
          type="submit" 
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  )
}
```

---

## Real-Time Communication

### PubSub Integration

**Channel-Specific Broadcasting:**
```javascript
// Send message to all extension instances in channel
function broadcastToChannel(channelId, message) {
  if (window.Twitch?.ext?.pubsub) {
    const targets = ['broadcast'] // Send to all viewers
    
    window.Twitch.ext.pubsub.send(targets, JSON.stringify({
      type: message.type,
      data: message.data,
      timestamp: Date.now()
    }))
  }
}

// Listen for PubSub messages
window.Twitch.ext.pubsub.onMessage('broadcast', (target, contentType, message) => {
  try {
    const data = JSON.parse(message)
    
    switch (data.type) {
      case 'prediction_created':
        handlePredictionCreated(data.data)
        break
        
      case 'bet_placed':
        handleBetPlaced(data.data)
        break
        
      case 'prediction_resolved':
        handlePredictionResolved(data.data)
        break
    }
    
  } catch (error) {
    console.error('Failed to parse PubSub message:', error)
  }
})
```

### WebSocket Integration (Backend)

**Real-Time State Synchronization:**
```typescript
// WebSocket connection management
class TwitchExtensionWebSocket {
  private ws: WebSocket | null = null
  private channelId: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(channelId: string, authToken: string) {
    this.channelId = channelId
    this.connect(authToken)
  }

  private connect(authToken: string) {
    const wsUrl = `wss://api.yourbackend.com/ws/channels/${this.channelId}`
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      
      // Authenticate connection
      this.send({
        type: 'auth',
        token: authToken
      })
      
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.attemptReconnect(authToken)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case 'prediction_state_change':
        updatePredictionState(message.data)
        break
        
      case 'bet_totals_update':
        updateBetTotals(message.data)
        break
        
      case 'payout_notification':
        showPayoutNotification(message.data)
        break
    }
  }

  private attemptReconnect(authToken: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      
      setTimeout(() => {
        console.log(`Attempting WebSocket reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
        this.connect(authToken)
      }, Math.pow(2, this.reconnectAttempts) * 1000) // Exponential backoff
    }
  }

  public send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  public disconnect() {
    this.ws?.close()
  }
}
```

---

## Extension Submission & Review

### Pre-Submission Checklist

**Technical Requirements:**
- [ ] Extension tested in Twitch Developer Rig
- [ ] All views (mobile, panel, overlay, config) working correctly
- [ ] Responsive design verified across all viewports
- [ ] Bits integration tested in sandbox environment
- [ ] Error handling implemented for all failure scenarios
- [ ] Performance optimized (< 3s load time, < 50MB memory)

**Content Requirements:**
- [ ] Privacy policy URL accessible and current
- [ ] EULA terms clearly defined
- [ ] Extension description accurately represents functionality
- [ ] Screenshots showcase all major features
- [ ] Icons meet Twitch branding guidelines

**Security Requirements:**
- [ ] No external API calls without user consent
- [ ] All user data properly encrypted
- [ ] JWT tokens validated server-side
- [ ] Rate limiting implemented
- [ ] HTTPS used for all external resources

### Manifest Validation

**Final Manifest Configuration:**
```json
{
  "manifest_version": 1,
  "id": "the-final-bet",
  "version": "1.0.0",
  "name": "The Final Bet",
  "description": "Turn every gaming moment into interactive predictions. Engage your viewers with real-time betting using Twitch Bits.",
  "summary": "Interactive prediction extension with Bits betting",
  "developer_name": "Your Developer Name",
  "support_email": "support@yourdomain.com",
  "website_url": "https://yourdomain.com",
  "privacy_policy_url": "https://yourdomain.com/privacy",
  "sku": "final-bet-prod-v1",
  
  "icon_url": "https://your-cdn.com/icons/icon-300x300.png",
  "icon_urls": {
    "24x24": "https://your-cdn.com/icons/icon-24x24.png",
    "100x100": "https://your-cdn.com/icons/icon-100x100.png"
  },
  "screenshot_urls": [
    "https://your-cdn.com/screenshots/config-page-800x600.png",
    "https://your-cdn.com/screenshots/viewer-active-800x600.png",
    "https://your-cdn.com/screenshots/viewer-locked-800x600.png",
    "https://your-cdn.com/screenshots/mobile-view-400x800.png"
  ],
  
  "views": {
    "mobile": {
      "viewer_url": "https://your-cdn.com/viewer.html",
      "aspect_width": 375,
      "aspect_height": 667,
      "autoscale": true,
      "scale_pixels": 1080,
      "zoom": true,
      "zoom_pixels": 1024
    },
    "panel": {
      "viewer_url": "https://your-cdn.com/viewer.html",
      "height": 600,
      "can_link_external_content": false
    },
    "video_overlay": {
      "viewer_url": "https://your-cdn.com/viewer.html",
      "can_link_external_content": false
    },
    "config": {
      "viewer_url": "https://your-cdn.com/config.html",
      "can_link_external_content": false
    }
  },
  
  "bits_enabled": true,
  "bits_sku": "final-bet-bits-prod",
  "bits_products": [
    {
      "sku": "bet_10",
      "displayName": "10 Bits Bet",
      "amount": 10,
      "inDevelopment": false
    },
    {
      "sku": "bet_50", 
      "displayName": "50 Bits Bet",
      "amount": 50,
      "inDevelopment": false
    },
    {
      "sku": "bet_100",
      "displayName": "100 Bits Bet", 
      "amount": 100,
      "inDevelopment": false
    },
    {
      "sku": "bet_500",
      "displayName": "500 Bits Bet",
      "amount": 500,
      "inDevelopment": false
    },
    {
      "sku": "bet_1000",
      "displayName": "1000 Bits Bet",
      "amount": 1000,
      "inDevelopment": false
    },
    {
      "sku": "bet_custom",
      "displayName": "Custom Bet Amount",
      "amount": 0,
      "inDevelopment": false
    }
  ],
  
  "request_identity_link": false,
  "vendor_code": "",
  "installation_requirements": {
    "follow_requirement": "none",
    "subscription_requirement": "none"
  },
  "allowlisted_config_urls": [],
  "allowlisted_panel_urls": []
}
```

### Review Process Optimization

**Common Review Issues & Solutions:**

1. **Performance Issues:**
   - Bundle size too large → Implement code splitting
   - Slow load times → Optimize images and remove unused dependencies
   - Memory leaks → Add proper cleanup in useEffect hooks

2. **User Experience Issues:**
   - Unclear interface → Add tooltips and help documentation
   - Non-responsive design → Test and fix all viewport sizes
   - Poor error handling → Add user-friendly error messages

3. **Bits Integration Issues:**
   - Transaction failures → Add robust error handling and retry logic
   - Incorrect pricing → Verify all product SKUs and amounts
   - Missing receipts → Implement proper transaction verification

**Review Timeline:**
- Initial submission review: 7-14 days
- Feedback incorporation: 3-5 days per iteration
- Final approval: 3-7 days
- **Total timeline: 2-4 weeks average**

---

## Testing Strategies

### Local Testing Setup

**Twitch Developer Rig Configuration:**
```bash
# Install Twitch Developer Rig
npm install -g @twitchdev/rig

# Launch rig with local extension
twitch-rig --extension-id your-extension-id --local-hosting

# Test configurations:
# - Frontend: http://localhost:3000
# - Extension files: http://localhost:8080
# - Backend API: http://localhost:3001
```

**Test Scenarios:**
1. **Authentication Flow:**
   - Anonymous user experience
   - Authenticated user experience
   - Role-based permission testing

2. **Bits Integration:**
   - Small bet transactions (10-100 Bits)
   - Large bet transactions (500-1000 Bits)
   - Custom amount transactions
   - Transaction cancellation handling

3. **State Management:**
   - Complete prediction workflow
   - Error state handling
   - Network failure recovery

4. **Multi-View Testing:**
   - Mobile view (375x667)
   - Panel view (320-600px width)
   - Video overlay positioning
   - Configuration interface

### Production Testing

**Staging Environment:**
```javascript
// Staging configuration
const config = {
  apiBaseUrl: 'https://staging-api.yourdomain.com',
  wsUrl: 'wss://staging-api.yourdomain.com/ws',
  cdnUrl: 'https://staging-cdn.yourdomain.com',
  environment: 'staging'
}

// Feature flags for gradual rollout
const features = {
  advancedStatistics: false,
  multiLanguageSupport: false,
  gameModeIntegration: true
}
```

---

## Monitoring & Analytics

### Extension Performance Monitoring

**Key Metrics to Track:**
```javascript
// Performance monitoring
const trackExtensionMetrics = () => {
  // Load time tracking
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
  analytics.track('extension_load_time', { duration: loadTime })

  // User engagement
  analytics.track('extension_view', {
    view: twitchContext.mode,
    theme: twitchContext.theme,
    userId: twitchAuth.userId
  })

  // Bits transaction success rate
  analytics.track('bits_transaction_attempt', {
    amount: betAmount,
    product: productSku
  })
}

// Error tracking
window.addEventListener('error', (event) => {
  analytics.track('extension_error', {
    message: event.error.message,
    stack: event.error.stack,
    filename: event.filename,
    line: event.lineno
  })
})
```

**Business Metrics:**
- Daily/Monthly Active Users (DAU/MAU)
- Bits transaction volume and success rate
- Average bet amount and frequency
- Prediction completion rate
- User retention and engagement

---

## Troubleshooting Guide

### Common Issues & Solutions

**1. Extension Not Loading:**
```javascript
// Debug checklist
console.log('Twitch object:', window.Twitch)
console.log('Extension SDK:', window.Twitch?.ext)
console.log('Current URL:', window.location.href)

// Common fixes:
// - Verify HTTPS hosting
// - Check CORS headers
// - Validate manifest URLs
// - Test in incognito mode
```

**2. Bits Transactions Failing:**
```javascript
// Debug Bits integration
window.Twitch.ext.bits.getProducts().then(products => {
  console.log('Available products:', products)
}).catch(error => {
  console.error('Bits products error:', error)
})

// Common fixes:
// - Verify product SKUs in manifest
// - Check development vs. production mode
// - Validate user authentication
// - Test transaction flow step-by-step
```

**3. Authentication Issues:**
```javascript
// Debug authentication
window.Twitch.ext.onAuthorized((auth) => {
  console.log('Auth token:', auth.token)
  console.log('User ID:', auth.userId)
  console.log('Channel ID:', auth.channelId)
  console.log('Role:', auth.role)
  
  // Decode JWT for debugging
  const payload = JSON.parse(atob(auth.token.split('.')[1]))
  console.log('JWT payload:', payload)
})
```

### Support Resources

**Documentation:**
- [Twitch Extensions Developer Guide](https://dev.twitch.tv/docs/extensions/)
- [Extension Reference](https://dev.twitch.tv/docs/extensions/reference/)
- [Bits Integration Guide](https://dev.twitch.tv/docs/extensions/bits/)

**Community Support:**
- [Twitch Developers Discord](https://discord.gg/twitchdev)
- [Developer Forums](https://discuss.dev.twitch.tv/)
- [GitHub Examples](https://github.com/twitchdev)

---

*This Twitch Integration Guide provides comprehensive coverage of all aspects needed to successfully deploy The Final Bet as a Twitch Extension. Follow the guidelines systematically to ensure a smooth review and approval process.*