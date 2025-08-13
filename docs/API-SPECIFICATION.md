# The Final Bet - API Specification

## Overview

This document defines the backend API requirements for **The Final Bet** Twitch Extension. The API handles prediction management, bet placement, real-time communication, and Twitch Bits integration.

**Base URL**: `https://api.yourbackend.com/v1`  
**Authentication**: JWT tokens provided by Twitch Extension SDK  
**Content-Type**: `application/json` for all requests  

---

## Authentication

### JWT Token Validation

All API requests must include a valid Twitch Extension JWT token:

```http
Authorization: Bearer <twitch_extension_jwt>
```

**JWT Payload Structure:**
```json
{
  "exp": 1641234567,
  "iat": 1641230967,
  "opaque_user_id": "U12345678",
  "user_id": "12345678",
  "channel_id": "87654321",
  "role": "viewer",
  "is_unlinked": false,
  "pubsub_perms": {
    "send": ["broadcast"]
  }
}
```

**Validation Requirements:**
- Verify JWT signature using Twitch's secret
- Check token expiration (`exp`)
- Extract `user_id`, `channel_id`, and `role`
- Handle anonymous users (`opaque_user_id` only)

### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| `broadcaster` | Create/manage predictions, access all channel data |
| `moderator` | Create/manage predictions, access all channel data |
| `viewer` | Place bets, view prediction data |

---

## Core API Endpoints

### 1. Predictions Management

#### Create Prediction
```http
POST /api/predictions
```

**Authorization**: Broadcaster or Moderator only

**Request Body:**
```json
{
  "question": "Will my team win this match?",
  "options": [
    {"id": "yes", "text": "Yes"},
    {"id": "no", "text": "No"}
  ]
}
```

**Response (201 Created):**
```json
{
  "prediction": {
    "id": "pred_1641234567890",
    "channel_id": "87654321",
    "question": "Will my team win this match?",
    "options": [
      {"id": "yes", "text": "Yes", "total_bits": 0, "total_bets": 0},
      {"id": "no", "text": "No", "total_bits": 0, "total_bets": 0}
    ],
    "status": "open",
    "total_pot": 0,
    "total_bets": 0,
    "created_at": "2022-01-03T12:34:56.789Z",
    "betting_window_seconds": 300
  }
}
```

**Error Responses:**
```json
// 400 - Invalid request
{
  "error": "INVALID_QUESTION",
  "message": "Question must be between 1 and 200 characters"
}

// 409 - Conflict
{
  "error": "PREDICTION_ALREADY_ACTIVE",
  "message": "Channel already has an active prediction"
}
```

#### Get Current Prediction
```http
GET /api/predictions/current?channel_id=87654321
```

**Response (200 OK):**
```json
{
  "prediction": {
    "id": "pred_1641234567890",
    "channel_id": "87654321",
    "question": "Will my team win this match?",
    "options": [
      {"id": "yes", "text": "Yes", "total_bits": 1250, "total_bets": 15},
      {"id": "no", "text": "No", "total_bits": 850, "total_bets": 12}
    ],
    "status": "open",
    "total_pot": 2100,
    "total_bets": 27,
    "created_at": "2022-01-03T12:34:56.789Z",
    "time_remaining": 245
  }
}

// 404 - No active prediction
{
  "error": "NO_ACTIVE_PREDICTION",
  "message": "No active prediction found for channel"
}
```

#### Close Betting Window
```http
PUT /api/predictions/{prediction_id}/close
```

**Authorization**: Broadcaster or Moderator only

**Response (200 OK):**
```json
{
  "prediction": {
    "id": "pred_1641234567890",
    "status": "locked",
    "closed_at": "2022-01-03T12:39:56.789Z"
  }
}
```

#### Resolve Prediction
```http
PUT /api/predictions/{prediction_id}/resolve
```

**Authorization**: Broadcaster or Moderator only

**Request Body:**
```json
{
  "winning_option": "yes"
}
```

**Response (200 OK):**
```json
{
  "prediction": {
    "id": "pred_1641234567890",
    "status": "resolved",
    "winning_option": "yes",
    "resolved_at": "2022-01-03T12:45:23.456Z"
  },
  "payouts": [
    {
      "user_id": "12345678",
      "bet_amount": 100,
      "payout_amount": 175,
      "profit": 75
    }
  ]
}
```

#### Cancel Prediction
```http
DELETE /api/predictions/{prediction_id}
```

**Authorization**: Broadcaster or Moderator only

**Response (200 OK):**
```json
{
  "prediction": {
    "id": "pred_1641234567890",
    "status": "cancelled",
    "cancelled_at": "2022-01-03T12:40:12.345Z"
  },
  "refunds": [
    {
      "user_id": "12345678",
      "refund_amount": 100
    }
  ]
}
```

### 2. Betting System

#### Place Bet
```http
POST /api/bets
```

**Request Body:**
```json
{
  "prediction_id": "pred_1641234567890",
  "option": "yes",
  "amount": 100,
  "transaction_token": "twitch_bits_transaction_token"
}
```

**Response (201 Created):**
```json
{
  "bet": {
    "id": "bet_1641234567890",
    "prediction_id": "pred_1641234567890",
    "user_id": "12345678",
    "option": "yes",
    "amount": 100,
    "potential_payout": 187,
    "transaction_id": "txn_abc123def456",
    "created_at": "2022-01-03T12:35:45.123Z"
  }
}
```

**Error Responses:**
```json
// 400 - Invalid bet amount
{
  "error": "INVALID_BET_AMOUNT",
  "message": "Bet amount must be between 1 and 10000 bits"
}

// 409 - Betting closed
{
  "error": "BETTING_CLOSED",
  "message": "Betting is no longer open for this prediction"
}

// 409 - User already bet
{
  "error": "USER_ALREADY_BET",
  "message": "User has already placed a bet on this prediction"
}

// 402 - Transaction failed
{
  "error": "TRANSACTION_FAILED",
  "message": "Bits transaction could not be processed"
}
```

#### Get User's Bet
```http
GET /api/bets/user?prediction_id=pred_1641234567890
```

**Response (200 OK):**
```json
{
  "bet": {
    "id": "bet_1641234567890",
    "prediction_id": "pred_1641234567890",
    "option": "yes",
    "amount": 100,
    "potential_payout": 187,
    "created_at": "2022-01-03T12:35:45.123Z"
  }
}

// 404 - No bet found
{
  "error": "NO_BET_FOUND",
  "message": "User has not placed a bet on this prediction"
}
```

#### Get Bet Totals
```http
GET /api/predictions/{prediction_id}/totals
```

**Response (200 OK):**
```json
{
  "prediction_id": "pred_1641234567890",
  "total_pot": 2100,
  "total_bets": 27,
  "options": [
    {
      "id": "yes",
      "text": "Yes",
      "total_bits": 1250,
      "total_bets": 15,
      "percentage": 59.5
    },
    {
      "id": "no",
      "text": "No", 
      "total_bits": 850,
      "total_bets": 12,
      "percentage": 40.5
    }
  ],
  "updated_at": "2022-01-03T12:35:45.123Z"
}
```

### 3. User Statistics

#### Get User Statistics
```http
GET /api/users/{user_id}/stats
```

**Response (200 OK):**
```json
{
  "user_id": "12345678",
  "total_bets": 45,
  "total_wagered": 4500,
  "total_won": 5200,
  "net_profit": 700,
  "win_rate": 0.67,
  "largest_win": 850,
  "current_streak": 3,
  "rank": 15
}
```

#### Get Channel Leaderboard
```http
GET /api/channels/{channel_id}/leaderboard?limit=10
```

**Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "12345678",
      "username": "GamerPro123",
      "total_wins": 850,
      "win_rate": 0.75,
      "net_profit": 2500
    }
  ],
  "total_users": 156,
  "updated_at": "2022-01-03T12:35:45.123Z"
}
```

---

## WebSocket Real-Time API

### Connection
```javascript
// Client connection
const ws = new WebSocket('wss://api.yourbackend.com/ws/channels/87654321');
```

### Authentication
```javascript
// Send JWT token after connection
ws.send(JSON.stringify({
  type: 'auth',
  token: 'twitch_extension_jwt_token'
}));
```

### Message Types

#### Prediction State Updates
```json
{
  "type": "prediction_state_change",
  "data": {
    "prediction_id": "pred_1641234567890",
    "status": "locked",
    "closed_at": "2022-01-03T12:39:56.789Z"
  }
}
```

#### Bet Totals Updates
```json
{
  "type": "bet_totals_update",
  "data": {
    "prediction_id": "pred_1641234567890",
    "total_pot": 2200,
    "total_bets": 28,
    "options": [
      {"id": "yes", "total_bits": 1300, "total_bets": 16},
      {"id": "no", "total_bits": 900, "total_bets": 12}
    ]
  }
}
```

#### New Bet Placed
```json
{
  "type": "bet_placed",
  "data": {
    "prediction_id": "pred_1641234567890",
    "option": "yes",
    "amount": 50,
    "anonymous": true
  }
}
```

#### Prediction Resolved
```json
{
  "type": "prediction_resolved",
  "data": {
    "prediction_id": "pred_1641234567890",
    "winning_option": "yes",
    "total_payouts": 2100,
    "winners_count": 16
  }
}
```

#### User-Specific Notifications
```json
{
  "type": "payout_notification",
  "data": {
    "user_id": "12345678",
    "prediction_id": "pred_1641234567890",
    "bet_amount": 100,
    "payout_amount": 175,
    "profit": 75
  }
}
```

---

## Twitch Bits Integration

### Transaction Verification

When a bet is placed, verify the Bits transaction server-side:

```http
POST https://api.twitch.tv/extensions/transactions
Authorization: Bearer {app_access_token}
Client-Id: {your_client_id}

{
  "extension_client_id": "your_extension_client_id",
  "user_id": "12345678",
  "product": {
    "sku": "bet_100",
    "cost": {
      "amount": 100,
      "type": "bits"
    }
  },
  "receipt": "transaction_receipt_from_client"
}
```

### Transaction Status Codes

| Status | Description | Action |
|--------|-------------|---------|
| `FULFILLED` | Transaction completed successfully | Process bet |
| `CANCELED` | User canceled transaction | Reject bet |
| `FAILED` | Transaction failed | Reject bet, log error |
| `PENDING` | Transaction in progress | Queue for retry |

### Error Handling

```json
{
  "error": "TRANSACTION_VERIFICATION_FAILED",
  "message": "Could not verify Bits transaction",
  "transaction_id": "txn_abc123def456",
  "retry_after": 5
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error description",
  "details": {
    "field": "Additional error context"
  },
  "timestamp": "2022-01-03T12:34:56.789Z",
  "request_id": "req_abc123def456"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_JWT` | 401 | JWT token invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `PREDICTION_NOT_FOUND` | 404 | Prediction ID not found |
| `BETTING_CLOSED` | 409 | Betting window closed |
| `USER_ALREADY_BET` | 409 | User already placed bet |
| `INVALID_BET_AMOUNT` | 400 | Bet amount outside valid range |
| `TRANSACTION_FAILED` | 402 | Bits transaction failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

### Limits by Endpoint

| Endpoint | Rate Limit | Window |
|----------|------------|---------|
| `POST /api/predictions` | 3 requests | 5 minutes |
| `POST /api/bets` | 10 requests | 1 minute |
| `GET /api/predictions/current` | 60 requests | 1 minute |
| `GET /api/predictions/*/totals` | 120 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1641234567
```

### Rate Limit Exceeded Response

```json
{
  "error": "RATE_LIMITED",
  "message": "Too many requests",
  "retry_after": 30,
  "limit": 10,
  "window": 60
}
```

---

## Data Models

### Database Schema

#### Predictions Table
```sql
CREATE TABLE predictions (
  id VARCHAR(50) PRIMARY KEY,
  channel_id VARCHAR(20) NOT NULL,
  question TEXT NOT NULL,
  status ENUM('open', 'locked', 'resolved', 'cancelled') NOT NULL,
  winning_option VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP NULL,
  resolved_at TIMESTAMP NULL,
  INDEX idx_channel_status (channel_id, status),
  INDEX idx_created_at (created_at)
);
```

#### Prediction Options Table
```sql
CREATE TABLE prediction_options (
  id VARCHAR(10) NOT NULL,
  prediction_id VARCHAR(50) NOT NULL,
  text VARCHAR(50) NOT NULL,
  PRIMARY KEY (prediction_id, id),
  FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE
);
```

#### Bets Table
```sql
CREATE TABLE bets (
  id VARCHAR(50) PRIMARY KEY,
  prediction_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(20) NOT NULL,
  option VARCHAR(10) NOT NULL,
  amount INTEGER NOT NULL,
  transaction_id VARCHAR(100) NOT NULL,
  payout_amount INTEGER NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_prediction (prediction_id, user_id),
  INDEX idx_user_id (user_id),
  INDEX idx_prediction_option (prediction_id, option)
);
```

#### User Statistics Table
```sql
CREATE TABLE user_stats (
  user_id VARCHAR(20) PRIMARY KEY,
  channel_id VARCHAR(20) NOT NULL,
  total_bets INTEGER DEFAULT 0,
  total_wagered INTEGER DEFAULT 0,
  total_won INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_channel_id (channel_id)
);
```

---

## Implementation Examples

### JWT Validation Middleware (Node.js/Express)

```javascript
const jwt = require('jsonwebtoken');

function validateTwitchJWT(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: 'MISSING_TOKEN',
      message: 'Authorization token required'
    });
  }

  try {
    const secret = Buffer.from(process.env.TWITCH_EXTENSION_SECRET, 'base64');
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    
    req.twitchUser = {
      userId: payload.user_id,
      channelId: payload.channel_id,
      role: payload.role,
      opaqueUserId: payload.opaque_user_id
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'INVALID_JWT',
      message: 'Invalid or expired token'
    });
  }
}
```

### Payout Calculation Algorithm

```javascript
function calculatePayouts(bets, winningOption, totalPot) {
  const winningBets = bets.filter(bet => bet.option === winningOption);
  const winningSideTotal = winningBets.reduce((sum, bet) => sum + bet.amount, 0);
  
  if (winningBets.length === 0 || winningSideTotal === 0) {
    return []; // No winners
  }

  // Calculate proportional payouts (rounded down)
  const payouts = winningBets.map(bet => ({
    userId: bet.user_id,
    betAmount: bet.amount,
    basePayout: Math.floor((totalPot * bet.amount) / winningSideTotal)
  }));

  // Calculate and distribute remainder
  const totalBasePayout = payouts.reduce((sum, payout) => sum + payout.basePayout, 0);
  const remainder = totalPot - totalBasePayout;

  // Find biggest bet to give remainder to
  const biggestBetIndex = payouts.reduce((maxIndex, current, index, array) => 
    current.betAmount > array[maxIndex].betAmount ? index : maxIndex, 0
  );

  // Distribute remainder
  payouts.forEach((payout, index) => {
    payout.finalPayout = payout.basePayout + (index === biggestBetIndex ? remainder : 0);
  });

  return payouts;
}
```

### WebSocket Event Broadcasting

```javascript
// Broadcast bet totals update to all channel subscribers
function broadcastBetTotals(channelId, predictionId) {
  const totals = calculateBetTotals(predictionId);
  
  const message = {
    type: 'bet_totals_update',
    data: {
      prediction_id: predictionId,
      total_pot: totals.totalPot,
      total_bets: totals.totalBets,
      options: totals.options
    }
  };

  // Send to all connected clients for this channel
  wss.clients.forEach(client => {
    if (client.channelId === channelId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
```

---

## Testing & Validation

### API Testing Checklist

- [ ] JWT token validation for all protected endpoints
- [ ] Rate limiting enforcement
- [ ] Proper error responses for all failure cases
- [ ] Bits transaction verification
- [ ] Payout calculation accuracy
- [ ] WebSocket connection management
- [ ] Database transaction consistency
- [ ] Concurrent bet placement handling

### Load Testing Scenarios

1. **Simultaneous Bet Placement**: 100+ users betting within same second
2. **High-Frequency Polling**: Rapid requests for bet totals
3. **WebSocket Scaling**: 1000+ concurrent connections per channel
4. **Database Stress**: Large prediction resolution with complex payouts

### Security Testing

- [ ] JWT tampering attempts
- [ ] SQL injection prevention
- [ ] Rate limit bypass attempts
- [ ] Bits transaction replay attacks
- [ ] Cross-channel data access attempts

---

*This API specification provides the complete backend requirements for The Final Bet extension. Implement endpoints incrementally, starting with authentication and basic prediction management.*