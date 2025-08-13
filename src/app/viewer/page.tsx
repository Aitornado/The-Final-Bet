'use client'

import { useEffect, useState } from 'react'
import { Prediction, UserBet, LeaderboardEntry } from '@/types/twitch'
import { TwitchAuth, TwitchContext } from '@/types/twitch-ext'
import LogoIcon from '@/components/LogoIcon'
import PredictionCard from '@/components/PredictionCard'
import GameProgress from '@/components/GameProgress'
import Leaderboard from '@/components/Leaderboard'

export default function ViewerPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [twitchAuth, setTwitchAuth] = useState<TwitchAuth | null>(null)
  const [twitchContext, setTwitchContext] = useState<TwitchContext | null>(null)
  const [currentState, setCurrentState] = useState<'none' | 'active' | 'locked' | 'resolved'>('active')
  const [userBet, setUserBet] = useState<UserBet | null>(null)
  const [betTotals, setBetTotals] = useState<{yes: number, no: number}>({yes: 0, no: 0})

  // Mock prediction data for different states
  const getPrediction = (): Prediction | null => {
    if (currentState === 'none') return null
    
    const totalPot = betTotals.yes + betTotals.no
    const totalBetsCount = Math.floor((betTotals.yes + betTotals.no) / 50) // Approximate number of bets
    
    const basePrediction: Prediction = {
      id: 'test-prediction-1',
      question: 'Will my team win this match?',
      options: [
        { 
          id: 'yes', 
          text: 'Yes', 
          odds: betTotals.no > 0 ? betTotals.no / betTotals.yes : 2.0,
          votes: Math.floor(betTotals.yes / 50),
          bits: betTotals.yes
        },
        { 
          id: 'no', 
          text: 'No', 
          odds: betTotals.yes > 0 ? betTotals.yes / betTotals.no : 2.0,
          votes: Math.floor(betTotals.no / 50),
          bits: betTotals.no
        }
      ],
      totalPot: totalPot,
      totalBets: totalBetsCount,
      timeRemaining: currentState === 'active' ? 45 : 0,
      status: currentState === 'resolved' ? 'resolved' : currentState,
      winningOption: currentState === 'resolved' ? 'yes' : undefined
    }

    return basePrediction
  }

  const prediction = getPrediction()

  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'GamerPro123', points: 850, wins: 125 },
    { rank: 2, username: 'BettingKing', points: 720, wins: 98 },
    { rank: 3, username: 'LuckyStreamer', points: 680, wins: 87 },
    { rank: 4, username: 'ViewerFan', points: 450, wins: 65 },
    { rank: 5, username: 'ChatMaster', points: 380, wins: 52 }
  ]

  useEffect(() => {
    // Initialize Twitch Extension
    if (typeof window !== 'undefined' && window.Twitch?.ext) {
      // Set up authentication
      window.Twitch.ext.onAuthorized((auth) => {
        console.log('Twitch Extension Authorized:', auth)
        setTwitchAuth(auth as unknown as TwitchAuth)
        setIsLoading(false)
      })

      // Set up context (theme, mode, etc.)
      // TODO: Fix type definition conflicts for onContext
      // window.Twitch.ext.onContext((context, changed) => {
      //   console.log('Twitch Context Updated:', context, 'Changed:', changed)
      //   setTwitchContext(context as unknown as TwitchContext)
      // })

      // Handle errors - commenting out due to type conflicts
      // window.Twitch.ext.onError((err: unknown) => {
      //   console.error('Twitch Extension Error:', err)
      //   setError('Failed to connect to Twitch')
      //   setIsLoading(false)
      // })
    } else {
      // Development mode - no Twitch available
      console.log('Development mode: Twitch Extension not available')
      setIsLoading(false)
      // Set some demo data for non-Twitch environments
      setBetTotals({yes: 1250, no: 850})
      // Start with active state for immediate demo
      setCurrentState('active')
    }
  }, [])

  const handlePlaceBet = async (option: string, amount: number) => {
    if (!prediction || !twitchAuth) return
    
    try {
      // In production, this would use Twitch Bits
      if (window.Twitch?.ext?.bits) {
        // Get available products
        const products = await window.Twitch.ext.bits.getProducts()
        console.log('Available Bits products:', products)
        
        // For now, simulate the transaction
        // In production, you'd call: window.Twitch.ext.bits.useBits(sku)
        console.log(`Simulating Bits transaction: ${amount} bits for ${option}`)
      }
      
      const newBet: UserBet = {
        predictionId: prediction.id,
        option,
        amount,
        potentialWin: 0 // Will be calculated with proportional system later
      }
      
      // Update bet totals
      setBetTotals(prev => ({
        ...prev,
        [option]: prev[option as keyof typeof prev] + amount
      }))
      
      setUserBet(newBet)
      
      // Here you would send the bet to your backend service
      console.log('Bet placed:', newBet)
      
    } catch (error) {
      console.error('Failed to place bet:', error)
      setError('Failed to place bet. Please try again.')
    }
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading predictions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h4 className="text-lg font-semibold mb-2">Connection Error</h4>
          <p className="mb-4 text-gray-400">Unable to load predictions. Please try again.</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
          <div className="w-10 h-6 sm:w-12 sm:h-7 lg:w-14 lg:h-8 bg-red-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
            <LogoIcon />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">The Final Bet</h1>
        </div>

        {/* Demo Controls for Review */}
        <div className="bg-gradient-to-r from-purple-900/20 to-red-900/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-purple-500/30">
          <h2 className="text-xs sm:text-sm font-semibold text-purple-300 mb-1">
            🎮 {twitchAuth ? 'Demo Controls for Extension Review' : 'Demo Mode - Extension Preview'}
          </h2>
          <p className="text-xs text-gray-400 mb-2 sm:mb-3">
            {twitchAuth 
              ? 'Click buttons below to see different prediction states and functionality:' 
              : 'Running outside Twitch - all features available for testing:'
            }
          </p>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <button
              onClick={() => setCurrentState('none')}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
                currentState === 'none' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔹 No Active Prediction
            </button>
            <button
              onClick={() => setCurrentState('active')}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
                currentState === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🟢 Active Betting
            </button>
            <button
              onClick={() => setCurrentState('locked')}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
                currentState === 'locked' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔒 Game In Progress
            </button>
            <button
              onClick={() => setCurrentState('resolved')}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
                currentState === 'resolved' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ✅ Prediction Resolved
            </button>
            <button
              onClick={() => setUserBet(userBet ? null : { predictionId: 'test-prediction-1', option: 'yes', amount: 100, potentialWin: 180 })}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
                userBet 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {userBet ? '💰 User Has Bet' : '👤 Simulate User Bet'}
            </button>
            {userBet && (
              <button
                onClick={() => {
                  setUserBet(null)
                  setBetTotals({yes: 0, no: 0})
                }}
                className="px-3 py-1 rounded text-sm bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
                🔄 Reset Demo Data
              </button>
            )}
            <button
              onClick={() => {
                // Simulate 100 viewers placing random bets
                let yesTotal = 0
                let noTotal = 0
                
                for (let i = 0; i < 100; i++) {
                  const amount = Math.floor(Math.random() * (10000 - 10 + 1)) + 10 // Random 10-10000
                  const option = Math.random() < 0.5 ? 'yes' : 'no' // Random choice
                  
                  if (option === 'yes') {
                    yesTotal += amount
                  } else {
                    noTotal += amount
                  }
                }
                
                setBetTotals({yes: yesTotal, no: noTotal})
                console.log(`Simulated 100 bets: Yes=${yesTotal} bits, No=${noTotal} bits, Total=${yesTotal + noTotal} bits`)
              }}
              className="px-3 py-1 rounded text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              📊 Populate with Demo Bets
            </button>
          </div>
        </div>

        {/* Main Content */}
        {prediction?.status === 'active' && (
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-800">
            <PredictionCard 
              prediction={prediction} 
              userBet={userBet}
              onPlaceBet={handlePlaceBet}
            />
          </div>
        )}

        {prediction?.status === 'locked' && (
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-800">
            <GameProgress 
              prediction={prediction}
              userBet={userBet}
            />
          </div>
        )}

        {!prediction && (
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-800">
            <div className="text-center py-8 sm:py-12">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h4 className="text-base sm:text-lg font-semibold mb-2">No Active Predictions</h4>
              <p className="text-sm sm:text-base text-gray-400">Waiting for the streamer to start a prediction...</p>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Leaderboard</h2>
          <div className="text-center py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏆</div>
            <h4 className="text-base sm:text-lg font-semibold mb-2">Coming Soon!</h4>
            <p className="text-sm sm:text-base text-gray-400">Leaderboard and stats will be available in a future update.</p>
          </div>
        </div>
      </div>
    </div>
  )
}