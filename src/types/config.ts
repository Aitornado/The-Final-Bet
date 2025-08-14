export interface ExtensionSettings {
  minBits: number
  maxBits: number
  autoResolve: 'manual' | 'timer'
  predictionTimeout: number
  currentPrediction?: ActivePrediction | null
}

export interface PredictionTemplate {
  id: string
  name: string
  question: string
  options: string[]
  category: string
}

export interface ActivePrediction {
  id: string
  question: string
  options: string[]
  timeRemaining: number
  status: 'betting' | 'locked' | 'resolved'
  totalPot: number
  totalBets: number
  winningOption?: string
  createdAt: number
}

export interface ConfigurationData {
  settings: ExtensionSettings
  templates: PredictionTemplate[]
  activePrediction?: ActivePrediction
}