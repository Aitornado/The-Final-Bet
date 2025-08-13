export interface TwitchExt {
  onAuthorized: (callback: (authData: Record<string, unknown>) => void) => void
  onContext: (context: Record<string, unknown>, changed: string[]) => void
  onError: (error: Error) => void
  onHighlightChanged: (isHighlighted: boolean) => void
  onPositionChanged: (position: Record<string, unknown>) => void
  onVisibilityChanged: (isVisible: boolean) => void
  actions: {
    followChannel: (channelName: string) => void
    minimize: () => void
    onFollow: (callback: (didFollow: boolean, channelName: string) => void) => void
    requestIdShare: () => void
  }
  bits: {
    getProducts: () => Promise<Record<string, unknown>>
    useBits: (sku: string) => void
    onTransactionCancelled: (callback: () => void) => void
    onTransactionComplete: (callback: (transaction: Record<string, unknown>) => void) => void
    setUseLoopback: (useLoopback: boolean) => void
  }
  configuration: {
    broadcaster?: { content: string }
    developer?: { content: string }
    global?: { content: string }
    segment: string
    set: (segment: string, version: string, content: string) => void
    onChanged: (callback: () => void) => void
  }
  rig: {
    log: (message: string) => void
  }
}

export interface PredictionOption {
  id: string
  text: string
  odds: number
  votes: number
  bits: number
  totalBets?: number // For backward compatibility
}

export interface Prediction {
  id: string
  question: string
  options: PredictionOption[]
  timeRemaining: number
  totalPot: number
  totalBets: number
  status: 'active' | 'locked' | 'resolved'
  winningOption?: string
}

export interface UserBet {
  predictionId: string
  option: string
  amount: number
  potentialWin: number
}

export interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  wins: number
}

// Global Window interface is declared in twitch-ext.d.ts