declare global {
  interface Window {
    Twitch: {
      ext: {
        onAuthorized: (callback: (auth: Record<string, unknown>) => void) => void
        onContext: (callback: (context: Record<string, unknown>, changed: string[]) => void) => void
        onError: (callback: (error: unknown) => void) => void
        configuration: {
          broadcaster?: { content?: string }
          developer?: { content?: string }
          global?: { content?: string }
          set: (segment: string, version: string, content: string) => void
          onChanged: (callback: () => void) => void
        }
        bits: {
          getProducts: () => Promise<TwitchBitsProduct[]>
          onTransactionComplete: (callback: (transaction: TwitchTransaction) => void) => void
          onTransactionCancelled: (callback: (transaction: TwitchTransaction) => void) => void
          useBits: (sku: string) => void
        }
        actions: {
          onFollow: (callback: (didFollow: boolean, channelName: string) => void) => void
          followChannel: (channelName: string) => void
          minimize: () => void
          requestIdShare: () => void
        }
        features: {
          isChatEnabled: boolean
          isBitsEnabled: boolean
          isSubscriptionStatusAvailable: boolean
        }
        rig: {
          log: (message: string) => void
        }
      }
    }
  }
}

export interface TwitchAuth {
  channelId: string
  clientId: string
  token: string
  userId?: string
}

export interface TwitchContext {
  arePlayerControlsVisible: boolean
  bitrate: number
  bufferSize: number
  displayResolution: string
  game: string
  hlsLatencyBroadcaster: number
  hostingInfo?: {
    hostedChannelId: string
    hostingChannelId: string
  }
  isFullScreen: boolean
  isMuted: boolean
  isPaused: boolean
  isTheatreMode: boolean
  language: string
  mode: 'viewer' | 'dashboard' | 'config'
  playbackMode: 'video' | 'audio' | 'remote' | 'chat-only'
  theme: 'light' | 'dark'
  videoResolution: string
  volume: number
}

export interface TwitchBitsProduct {
  sku: string
  cost: {
    amount: number
    type: 'bits'
  }
  displayName: string
  inDevelopment?: boolean
}

export interface TwitchTransaction {
  transactionID: string
  product: {
    sku: string
    displayName: string
    cost: {
      amount: number
      type: 'bits'
    }
  }
  userId: string
  displayName: string
  initiator: 'current_user' | 'other'
  transactionReceipt: string
}

export {}