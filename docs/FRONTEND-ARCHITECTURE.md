# The Final Bet - Frontend Architecture

## Overview

This document provides detailed documentation of the frontend architecture for **The Final Bet** Twitch Extension. The frontend is implemented using two approaches: a modern React/Next.js application for development and maintenance, and production-ready vanilla JavaScript files for Twitch Extension deployment.

**Dual Implementation Strategy:**
- **Next.js App** (`/src`): Modern development environment with React components
- **Extension Files** (`/extension`): Production vanilla JS files for Twitch deployment

---

## Architecture Overview

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Root                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
   ┌────▼────┐                 ┌────▼────┐
   │ Config  │                 │ Viewer  │
   │  View   │                 │  View   │
   └────┬────┘                 └────┬────┘
        │                           │
   ┌────▼────┐                 ┌────▼────┐
   │Config   │                 │Betting  │
   │Components│                │Interface│
   └─────────┘                 └─────────┘
```

### Technology Stack

**Development Stack (React/Next.js):**
- **Next.js 15**: App Router with TypeScript
- **React 18**: Modern hooks and concurrent features
- **Tailwind CSS**: Utility-first responsive styling
- **TypeScript**: Type safety and developer experience

**Production Stack (Extension Files):**
- **Vanilla JavaScript**: Direct DOM manipulation
- **CSS3**: Custom responsive styles
- **Twitch Extension SDK**: Direct platform integration

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with global styles
│   ├── page.tsx                 # Home page (development)
│   ├── config/
│   │   └── page.tsx             # Streamer configuration interface
│   ├── viewer/
│   │   └── page.tsx             # Viewer betting interface
│   ├── globals.css              # Global Tailwind styles
│   ├── privacy/
│   │   └── page.tsx             # Privacy policy page
│   └── eula/
│       └── page.tsx             # EULA page
├── components/                   # Reusable React components
│   ├── LogoIcon.tsx             # Brand logo component
│   ├── PredictionCard.tsx       # Active betting interface
│   ├── GameProgress.tsx         # Locked state display
│   ├── Leaderboard.tsx          # Rankings and statistics
│   └── config/                  # Configuration UI components
│       ├── ConfigSection.tsx    # Wrapper for config sections
│       ├── PredictionForm.tsx   # Prediction creation form
│       ├── QuickActions.tsx     # State transition buttons
│       ├── SettingsForm.tsx     # Extension settings
│       └── HowItWorks.tsx       # Help documentation
├── types/                       # TypeScript type definitions
│   ├── config.ts               # Configuration-related types
│   ├── twitch.ts               # Twitch Extension types
│   └── twitch-ext.d.ts         # Global Twitch SDK declarations
└── dist/                       # Built production files
    ├── viewer.html             # Viewer interface (production)
    ├── viewer.js               # Viewer logic (vanilla JS)
    ├── config.html             # Streamer config (production)
    ├── config.js               # Config logic with state machine
    ├── styles.css              # Production styles
    └── manifest.json           # Twitch Extension manifest
```

---

## Component Architecture

### Core Components

#### 1. Layout Component (`src/app/layout.tsx`)

**Purpose**: Root layout providing global styles and configuration

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-950 text-white">
          {children}
        </div>
      </body>
    </html>
  )
}
```

**Key Features:**
- Global Tailwind CSS setup
- Dark theme optimization for Twitch
- Responsive container constraints
- Font optimization

#### 2. Viewer Page (`src/app/viewer/page.tsx`)

**Purpose**: Main viewer interface for bet placement and tracking

**Component Structure:**
```typescript
export default function ViewerPage() {
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [twitchAuth, setTwitchAuth] = useState<TwitchAuth | null>(null)
  const [currentState, setCurrentState] = useState<'none' | 'active' | 'locked' | 'resolved'>('none')
  const [userBet, setUserBet] = useState<UserBet | null>(null)

  // Twitch Extension SDK integration
  useEffect(() => {
    if (window.Twitch?.ext) {
      window.Twitch.ext.onAuthorized((auth) => setTwitchAuth(auth))
      window.Twitch.ext.onContext((context) => setTwitchContext(context))
    }
  }, [])

  // Component rendering based on state
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Testing controls */}
      {/* Main content based on prediction state */}
      {/* Leaderboard */}
    </div>
  )
}
```

**Key Features:**
- Twitch Extension SDK integration
- State-based UI rendering
- Built-in testing controls
- Responsive design for multiple viewports
- Mock data simulation for development

#### 3. Config Page (`src/app/config/page.tsx`)

**Purpose**: Streamer interface for prediction management

**Component Structure:**
```typescript
export default function ConfigPage() {
  // State management for streamer interface
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)

  // Streamer-specific functionality
  const createPrediction = async (question: string) => {
    // Implementation
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ConfigSection title="Prediction Management">
        <PredictionForm onSubmit={createPrediction} />
        <QuickActions />
      </ConfigSection>
      
      <ConfigSection title="Settings">
        <SettingsForm />
      </ConfigSection>
    </div>
  )
}
```

### Specialized Components

#### PredictionCard (`src/components/PredictionCard.tsx`)

**Purpose**: Interactive betting interface for active predictions

```typescript
interface PredictionCardProps {
  prediction: Prediction
  userBet: UserBet | null
  onPlaceBet: (option: string, amount: number) => void
}

export default function PredictionCard({ prediction, userBet, onPlaceBet }: PredictionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [bitsAmount, setBitsAmount] = useState(50)

  const handlePlaceBet = () => {
    if (selectedOption && bitsAmount > 0) {
      onPlaceBet(selectedOption, bitsAmount)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6">
      {/* Prediction question */}
      {/* Option buttons with visual feedback */}
      {/* Bits input with validation */}
      {/* Bet placement button */}
      {/* User bet status (if bet placed) */}
    </div>
  )
}
```

**Key Features:**
- Visual option selection with color coding
- Bits input validation (1-10,000 range)
- Disabled states for different scenarios
- User bet confirmation display
- Responsive touch-friendly buttons

#### GameProgress (`src/components/GameProgress.tsx`)

**Purpose**: Display during locked/resolved prediction states

```typescript
interface GameProgressProps {
  prediction: Prediction
  userBet: UserBet | null
}

export default function GameProgress({ prediction, userBet }: GameProgressProps) {
  const calculatePotentialPayout = (bet: UserBet) => {
    // Proportional payout calculation
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      {/* Game status indicator */}
      {/* Pot summary (total bits, total bets) */}
      {/* Vote breakdown with percentages */}
      {/* User's bet status and potential payout */}
    </div>
  )
}
```

**Key Features:**
- Real-time vote percentage calculations
- Visual progress bars for vote distribution
- User's potential payout calculation
- Status indicators for game progress
- Responsive data visualization

---

## State Management

### React State Patterns

**Local State Management:**
```typescript
// Component-level state for UI interactions
const [selectedOption, setSelectedOption] = useState<string>('')
const [bitsAmount, setBitsAmount] = useState(50)

// Application-level state for extension data
const [currentState, setCurrentState] = useState<PredictionState>('none')
const [prediction, setPrediction] = useState<Prediction | null>(null)
const [userBet, setUserBet] = useState<UserBet | null>(null)
```

**State Synchronization Pattern:**
```typescript
// Sync with Twitch Extension SDK
useEffect(() => {
  if (window.Twitch?.ext) {
    window.Twitch.ext.onAuthorized((auth: TwitchAuth) => {
      setTwitchAuth(auth)
      // Initialize real-time connection
    })
  }
}, [])

// Mock data for development testing
const getMockPrediction = (): Prediction | null => {
  if (currentState === 'none') return null
  
  return {
    id: 'test-prediction-1',
    question: 'Will my team win this match?',
    options: [
      { id: 'yes', text: 'Yes', totalBets: betTotals.yes },
      { id: 'no', text: 'No', totalBets: betTotals.no }
    ],
    status: currentState,
    // ... other properties
  }
}
```

### Vanilla JS State Machine (Production)

**State Machine Implementation** (legacy reference - now in React components):
```javascript
class PredictionStateMachine {
  constructor() {
    this.states = {
      IDLE: 'idle',
      BETTING_OPEN: 'betting_open',
      BETTING_LOCKED: 'betting_locked', 
      RESOLVED: 'resolved'
    }
    
    this.currentState = this.states.IDLE
    this.currentPrediction = null
  }

  // State transition methods
  startBettingWindow() {
    if (this.currentState !== this.states.IDLE) return
    
    this.currentState = this.states.BETTING_OPEN
    this.updateUI()
    this.broadcastStateChange()
  }

  closeBetting() {
    if (this.currentState !== this.states.BETTING_OPEN) return
    
    this.currentState = this.states.BETTING_LOCKED
    this.updateUI()
    this.broadcastStateChange()
  }

  resolvePrediction(outcome) {
    if (this.currentState !== this.states.BETTING_LOCKED) return
    
    this.currentState = this.states.RESOLVED
    this.calculatePayouts(outcome)
    this.updateUI()
    
    // Reset after brief display
    setTimeout(() => this.resetPrediction(), 3000)
  }
}
```

---

## Data Flow Architecture

### Development Environment Data Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│   React State    │───▶│   UI Update     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mock Data     │◄───│   State Logic    │───▶│  Testing Tools  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Production Environment Data Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  State Machine   │───▶│   DOM Update    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Backend API    │◄───│  Data Service    │───▶│   WebSocket     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Event Flow Patterns

**React Event Handling:**
```typescript
// User interaction → State update → UI re-render
const handlePlaceBet = async (option: string, amount: number) => {
  try {
    // Update local state immediately for responsive UI
    const newBet: UserBet = { predictionId, option, amount, potentialWin: 0 }
    setUserBet(newBet)
    
    // Call backend API (production)
    await placeBetAPI(newBet)
    
    // Update bet totals
    setBetTotals(prev => ({
      ...prev,
      [option]: prev[option] + amount
    }))
    
  } catch (error) {
    // Revert optimistic update on error
    setUserBet(null)
    setError('Failed to place bet')
  }
}
```

**Vanilla JS Event Handling:**
```javascript
// Direct DOM manipulation with state validation
function placeBet() {
  const option = selectedOption
  const amount = parseInt(document.getElementById('bits-amount').value)
  
  // Validate state and input
  if (predictionState !== 'betting_open') {
    showNotification('Betting is not currently open!', 'error')
    return
  }
  
  // Update UI immediately
  document.getElementById('user-bet').style.display = 'block'
  document.getElementById('user-bet-details').textContent = `${amount} Bits on ${option.toUpperCase()}`
  
  // Store bet data
  userBet = { option, amount, prediction: currentPrediction?.id }
  
  // Disable betting for this user
  disableBetting()
}
```

---

## Styling Architecture

### Tailwind CSS System (Development)

**Design System Configuration:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // Twitch brand colors
        'twitch-purple': '#9146FF',
        'twitch-purple-dark': '#772CE8',
        'bits-gradient-1': '#9146FF',
        'bits-gradient-2': '#00D4FF',
        
        // Extension-specific colors
        'success': '#00f593',
        'error': '#ff6b6b',
        'warning': '#ff9500',
      },
      
      screens: {
        // Extension viewport breakpoints
        'extension-sm': '320px',   // Panel view minimum
        'extension-md': '375px',   // Mobile view
        'extension-lg': '600px',   // Panel view maximum
      }
    }
  }
}
```

**Component Style Patterns:**
```typescript
// Consistent button styling
const buttonClasses = {
  primary: "px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors",
  secondary: "px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg",
  success: "px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium",
  bits: "flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded"
}

// Responsive containers
const containerClasses = "w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-3 sm:p-4 lg:p-6"
```

### Custom CSS System (Production)

**CSS Architecture** (production build output):
```css
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Twitch-optimized body styles */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0e0e10;  /* Twitch dark background */
  color: #efeff1;       /* Twitch text color */
  font-size: 14px;
  line-height: 1.4;
}

/* Component-specific styles with BEM methodology */
.prediction-card {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}

.option-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s;
}

.option-btn.selected {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

/* Responsive design for extension constraints */
@media (max-width: 300px) {
  .prediction-options {
    grid-template-columns: 1fr;
  }
}
```

---

## Responsive Design Strategy

### Multi-Viewport Support

**Twitch Extension Views:**
1. **Mobile**: 375×667px (portrait orientation)
2. **Panel**: 320-600px width, flexible height
3. **Video Overlay**: Variable size, minimal UI
4. **Config**: Desktop interface, 800px+ optimal

**Responsive Implementation:**
```typescript
// React responsive patterns
const ResponsiveContainer = ({ children }) => (
  <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
    {children}
  </div>
)

// Adaptive text sizing
const textClasses = "text-sm sm:text-base lg:text-lg"
const buttonClasses = "px-2 sm:px-3 py-1 min-h-[44px] text-xs sm:text-sm"
```

```css
/* CSS responsive patterns */
.prediction-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 300px) {
  .prediction-options {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

/* Touch-friendly interactive elements */
.option-btn, .place-bet-btn {
  min-height: 44px;  /* iOS touch target minimum */
  touch-action: manipulation;
}
```

---

## Performance Optimization

### Bundle Size Optimization

**Next.js Build Optimization:**
```typescript
// next.config.ts
const nextConfig = {
  // Static export for CDN deployment
  output: 'export',
  
  // Optimize images for extension constraints
  images: { unoptimized: true },
  
  // Remove unused CSS
  experimental: {
    optimizeCss: true
  }
}
```

**Component Lazy Loading:**
```typescript
// Lazy load non-critical components
const Leaderboard = dynamic(() => import('@/components/Leaderboard'), {
  loading: () => <div>Loading leaderboard...</div>
})

// Conditional loading based on state
{prediction?.status === 'resolved' && <Leaderboard />}
```

### Runtime Performance

**React Optimization Patterns:**
```typescript
// Memoize expensive calculations
const potentialPayout = useMemo(() => {
  if (!userBet || !betTotals) return 0
  return calculateProportionalPayout(userBet, betTotals)
}, [userBet, betTotals])

// Prevent unnecessary re-renders
const MemoizedPredictionCard = React.memo(PredictionCard)

// Optimize event handlers
const handleBetPlacement = useCallback((option: string, amount: number) => {
  placeBet(option, amount)
}, [placeBet])
```

**Vanilla JS Optimization:**
```javascript
// Debounce rapid updates
let updateTimeout
function updateBetTotals(newTotals) {
  clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    renderBetTotals(newTotals)
  }, 100)
}

// Cache DOM elements
const elements = {
  betsAmount: document.getElementById('bits-amount'),
  placeBetBtn: document.getElementById('place-bet'),
  userBetStatus: document.getElementById('user-bet')
}

// Efficient DOM updates
function updateUserBetDisplay(bet) {
  elements.userBetStatus.innerHTML = `
    <div class="bet-details">
      <span class="bet-option">${bet.option.toUpperCase()}</span>
      <span class="bet-amount">${bet.amount} Bits</span>
    </div>
  `
  elements.userBetStatus.style.display = 'block'
}
```

---

## Testing Architecture

### Component Testing Strategy

**React Testing Utilities:**
```typescript
// Custom testing utilities
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MockTwitchProvider>
      {ui}
    </MockTwitchProvider>
  )
}

// Mock Twitch Extension SDK
const MockTwitchProvider = ({ children }) => {
  useEffect(() => {
    window.Twitch = {
      ext: {
        onAuthorized: (callback) => callback(mockAuth),
        onContext: (callback) => callback(mockContext),
        bits: {
          getProducts: () => Promise.resolve(mockProducts),
          useBits: (sku) => console.log('Mock bits transaction:', sku)
        }
      }
    }
  }, [])
  
  return children
}
```

**State Testing Patterns:**
```typescript
// Test all prediction states
const predictionStates = ['none', 'active', 'locked', 'resolved']

predictionStates.forEach(state => {
  test(`renders correctly in ${state} state`, () => {
    const { getByText } = renderWithProviders(
      <ViewerPage initialState={state} />
    )
    
    // Assert state-specific UI elements
    if (state === 'active') {
      expect(getByText('Place Bet')).toBeInTheDocument()
    }
    
    if (state === 'locked') {
      expect(getByText('Game in Progress')).toBeInTheDocument()
    }
  })
})
```

### Integration Testing

**End-to-End Workflow Testing:**
```javascript
// Vanilla JS integration tests
function testPredictionWorkflow() {
  console.log('Testing complete prediction workflow...')
  
  // 1. Start with idle state
  assert(predictionManager.currentState === 'idle')
  
  // 2. Create prediction
  predictionManager.startBettingWindow()
  assert(predictionManager.currentState === 'betting_open')
  
  // 3. Place bet
  placeBet('yes', 100)
  assert(userBet !== null)
  
  // 4. Close betting
  predictionManager.closeBetting()
  assert(predictionManager.currentState === 'betting_locked')
  
  // 5. Resolve prediction
  predictionManager.resolvePrediction('yes')
  assert(predictionManager.currentState === 'resolved')
  
  console.log('✅ Workflow test passed')
}
```

---

## Error Handling & Edge Cases

### Error Boundary Implementation

```typescript
class ExtensionErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Extension error:', error, errorInfo)
    
    // Report to error tracking service
    reportError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Extension
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Graceful Degradation

```typescript
// Handle Twitch SDK unavailability
const useTwitchExtension = () => {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.Twitch?.ext) {
      setIsReady(true)
    } else {
      // Fallback for development or SDK issues
      console.warn('Twitch Extension SDK not available, using mock data')
      setError('Running in development mode')
      setTimeout(() => setIsReady(true), 1000)
    }
  }, [])

  return { isReady, error }
}
```

---

## Migration Strategy

### Development to Production Migration

**1. Replace Mock Data with API Calls:**
```typescript
// Development (mock data)
const prediction = getMockPrediction()

// Production (API integration)
const { data: prediction } = useQuery('/api/predictions/current', {
  refetchInterval: 5000 // Poll for updates
})
```

**2. Add Real-Time Communication:**
```typescript
// WebSocket integration
useEffect(() => {
  const ws = new WebSocket(`wss://api.yourbackend.com/channels/${channelId}`)
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    
    switch (message.type) {
      case 'bet_totals_update':
        setBetTotals(message.data)
        break
      case 'prediction_state_change':
        setPredictionState(message.data.status)
        break
    }
  }
  
  return () => ws.close()
}, [channelId])
```

**3. Production Build Process:**
```bash
# Build optimized React app
npm run build

# Production build creates optimized files in dist/
npm run build

# Deploy dist/ contents to CDN
# Update manifest.json with production URLs
```

---

## Future Architecture Considerations

### Scalability Enhancements

1. **State Management Library Integration:**
   - Redux Toolkit for complex state
   - Zustand for lightweight state management
   - React Query for server state

2. **Micro-Frontend Architecture:**
   - Separate bundles for config/viewer
   - Independent deployment cycles
   - Shared component library

3. **Progressive Enhancement:**
   - Core functionality in vanilla JS
   - Enhanced features with React
   - Graceful degradation for all browsers

### Performance Improvements

1. **Code Splitting:**
   - Route-based splitting
   - Component-based lazy loading
   - Feature-flag-based bundling

2. **Caching Strategy:**
   - Service worker for offline support
   - Intelligent data caching
   - CDN optimization

---

*This frontend architecture documentation provides a comprehensive guide to understanding and extending The Final Bet extension. The dual implementation strategy ensures both maintainable development and optimal production performance.*