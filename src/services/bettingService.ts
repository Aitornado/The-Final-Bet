// Mock betting service - simulates backend for development
// In production, this would connect to a real backend API

export interface BetData {
  predictionId: string
  userId: string
  option: string
  amount: number
  timestamp: number
  bitsTransaction?: unknown // Optional Twitch Bits transaction data
}

export interface BetTotals {
  yes: number
  no: number
  totalBets: number
  totalPot: number
  betHistory: BetData[]
}

// Simple in-memory storage for development
class MockBettingService {
  private activeBets: Map<string, BetTotals> = new Map()
  private listeners: Map<string, (totals: BetTotals) => void> = new Map()

  // Place a bet for a prediction
  async placeBet(bet: BetData): Promise<BetTotals> {
    const predictionId = bet.predictionId
    
    // Get existing totals or create new ones
    const currentTotals = this.activeBets.get(predictionId) || {
      yes: 0,
      no: 0,
      totalBets: 0,
      totalPot: 0,
      betHistory: []
    }

    // Add the new bet
    const optionKey = bet.option.toLowerCase() as 'yes' | 'no'
    currentTotals[optionKey] += bet.amount
    currentTotals.totalPot += bet.amount
    currentTotals.totalBets += 1
    currentTotals.betHistory.push(bet)

    // Update storage
    this.activeBets.set(predictionId, currentTotals)

    // Notify listeners
    this.notifyListeners(predictionId, currentTotals)

    console.log(`Bet placed: ${bet.amount} bits on ${bet.option} for prediction ${predictionId}`)
    console.log(`New totals:`, currentTotals)

    return currentTotals
  }

  // Get current bet totals for a prediction
  getBetTotals(predictionId: string): BetTotals {
    return this.activeBets.get(predictionId) || {
      yes: 0,
      no: 0,
      totalBets: 0,
      totalPot: 0,
      betHistory: []
    }
  }

  // Listen for bet updates
  onBetUpdate(predictionId: string, callback: (totals: BetTotals) => void): () => void {
    const key = `${predictionId}_${Date.now()}`
    this.listeners.set(key, callback)

    // Return cleanup function
    return () => {
      this.listeners.delete(key)
    }
  }

  // Clear bets for a prediction (when resolved/ended)
  clearPrediction(predictionId: string): void {
    this.activeBets.delete(predictionId)
    this.notifyListeners(predictionId, {
      yes: 0,
      no: 0,
      totalBets: 0,
      totalPot: 0,
      betHistory: []
    })
  }

  // Notify all listeners for a prediction
  private notifyListeners(predictionId: string, totals: BetTotals): void {
    this.listeners.forEach((callback, key) => {
      if (key.startsWith(predictionId)) {
        callback(totals)
      }
    })
  }

  // Get all active predictions (for debugging)
  getActivePredictions(): string[] {
    return Array.from(this.activeBets.keys())
  }

  // Calculate payout for a user
  calculatePayout(predictionId: string, userBet: BetData, winningOption: string): number {
    const totals = this.getBetTotals(predictionId)
    
    if (userBet.option.toLowerCase() !== winningOption.toLowerCase()) {
      return 0 // Lost bet
    }

    // Winner takes all system - proportional payout
    const winnerPool = totals[winningOption.toLowerCase() as 'yes' | 'no']
    const userShare = userBet.amount / winnerPool
    const payout = Math.floor(userShare * totals.totalPot)

    return payout
  }
}

// Export singleton instance
export const bettingService = new MockBettingService()

// Utility function to generate user ID (in production, this would come from Twitch)
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}