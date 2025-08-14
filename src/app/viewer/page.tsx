'use client'

import { useEffect, useState, useRef } from 'react'
import { Prediction, UserBet } from '@/types/twitch'
import { TwitchAuth } from '@/types/twitch-ext'
import { ActivePrediction } from '@/types/config'
import LogoIcon from '@/components/LogoIcon'
import PredictionCard from '@/components/PredictionCard'
import GameProgress from '@/components/GameProgress'
import { bettingService, generateUserId, BetTotals } from '@/services/bettingService'

export default function ViewerPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [twitchAuth, setTwitchAuth] = useState<TwitchAuth | null>(null)
  const [currentState, setCurrentState] = useState<'none' | 'active' | 'locked' | 'resolved'>('active')
  const [userBet, setUserBet] = useState<UserBet | null>(null)
  const [betTotals, setBetTotals] = useState<{yes: number, no: number}>({yes: 0, no: 0})
  const [realPrediction, setRealPrediction] = useState<ActivePrediction | null>(null)
  const [realBetTotals, setRealBetTotals] = useState<BetTotals | null>(null)
  const userIdRef = useRef<string>(generateUserId())

  // Function to calculate current potential winnings based on latest totals
  const calculateCurrentPotentialWin = (userBet: UserBet, currentTotals: BetTotals): number => {
    if (!currentTotals || currentTotals.totalPot === 0) return userBet.amount

    const winnerPool = currentTotals[userBet.option.toLowerCase() as 'yes' | 'no']
    if (winnerPool === 0) return userBet.amount

    const userShare = userBet.amount / winnerPool
    return Math.floor(userShare * currentTotals.totalPot)
  }

  // Mock prediction data for different states
  const getPrediction = (): Prediction | null => {
    console.log('🔍 DEBUG: getPrediction called', { 
      realPrediction: !!realPrediction, 
      currentState, 
      betTotals,
      realBetTotals: !!realBetTotals 
    })
    
    // Use real prediction data from streamer if available
    if (realPrediction) {
      console.log('✅ DEBUG: Using real prediction from streamer')
      // Use real bet totals if available, otherwise fall back to demo totals
      const totals = realBetTotals || { yes: betTotals.yes, no: betTotals.no, totalPot: betTotals.yes + betTotals.no, totalBets: Math.floor((betTotals.yes + betTotals.no) / 50) }
      
      return {
        ...realPrediction,
        options: realPrediction.options?.map((opt: string, index: number) => ({
          id: index === 0 ? 'yes' : 'no',
          text: opt,
          odds: totals.no > 0 && totals.yes > 0 
            ? (index === 0 ? totals.no / totals.yes : totals.yes / totals.no) 
            : 2.0,
          votes: Math.floor((index === 0 ? totals.yes : totals.no) / 50),
          bits: index === 0 ? totals.yes : totals.no
        })) || [
          { id: 'yes', text: 'Yes', odds: 2.0, votes: 0, bits: totals.yes },
          { id: 'no', text: 'No', odds: 2.0, votes: 0, bits: totals.no }
        ],
        totalPot: totals.totalPot,
        totalBets: totals.totalBets,
        timeRemaining: realPrediction.status === 'betting' ? 45 : 0,
        status: realPrediction.status === 'betting' ? 'active' : realPrediction.status
      }
    }
    
    // Demo mode fallback
    console.log('🎮 DEBUG: Using demo mode, currentState:', currentState)
    if (currentState === 'none') {
      console.log('❌ DEBUG: Demo mode - no prediction (currentState = none)')
      return null
    }
    
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
      // DEMO MODE: Use real winning option if available, otherwise default to 'yes' for testing
      winningOption: currentState === 'resolved' ? 'yes' : undefined
    }

    console.log('✅ DEBUG: Created demo prediction:', basePrediction)
    return basePrediction
  }

  const prediction = getPrediction()


  useEffect(() => {
    let authCleanup: (() => void) | null = null
    let configCleanup: (() => void) | null = null

    // Initialize Twitch Extension
    if (typeof window !== 'undefined' && window.Twitch?.ext) {
      // Set up authentication
      const handleAuth = (auth: unknown) => {
        console.log('Twitch Extension Authorized:', auth)
        setTwitchAuth(auth as unknown as TwitchAuth)
      }
      
      window.Twitch.ext.onAuthorized(handleAuth)

      // Listen for configuration changes from streamer
      const handleConfigChange = () => {
        if (window.Twitch?.ext?.configuration?.broadcaster?.content) {
          try {
            const config = JSON.parse(window.Twitch.ext.configuration.broadcaster.content)
            console.log('Received config from streamer:', config)
            setRealPrediction(config.currentPrediction || null)
          } catch (error) {
            console.error('Failed to parse broadcaster config:', error)
          }
        }
      }

      window.Twitch.ext.configuration.onChanged(handleConfigChange)

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
      // })

      // Store cleanup functions (Note: Twitch Extension API doesn't have explicit remove methods,
      // but we can set cleanup callbacks to null to prevent future calls)
      authCleanup = () => {
        // Twitch Extension API doesn't provide direct removal methods,
        // but we can clear our state to prevent memory issues
        setTwitchAuth(null)
      }

      configCleanup = () => {
        setRealPrediction(null)
      }
    } else {
      // Development mode - no Twitch available
      console.log('Development mode: Twitch Extension not available')
    }

    // Cleanup function
    return () => {
      if (authCleanup) authCleanup()
      if (configCleanup) configCleanup()
    }
  }, [])

  // Listen for bet updates when a real prediction is active
  useEffect(() => {
    let cleanup: (() => void) | null = null

    if (realPrediction) {
      // Subscribe to bet updates for this prediction
      cleanup = bettingService.onBetUpdate(realPrediction.id, (totals) => {
        console.log('Received bet update:', totals)
        setRealBetTotals(totals)
      })

      // Load initial bet totals
      const initialTotals = bettingService.getBetTotals(realPrediction.id)
      setRealBetTotals(initialTotals)
    } else {
      // Clear real bet totals when no prediction
      setRealBetTotals(null)
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [realPrediction?.id, realPrediction])

  // Update potential winnings when bet totals change
  useEffect(() => {
    if (userBet && realBetTotals && realPrediction?.status === 'betting') {
      const updatedPotentialWin = calculateCurrentPotentialWin(userBet, realBetTotals)
      
      if (updatedPotentialWin !== userBet.potentialWin) {
        console.log(`Updating potential win from ${userBet.potentialWin} to ${updatedPotentialWin}`)
        setUserBet(prev => prev ? { ...prev, potentialWin: updatedPotentialWin } : null)
      }
    }
  }, [realBetTotals, userBet?.amount, userBet?.option, realPrediction?.status, userBet])

  // Helper function to proceed with bet placement after successful Bits transaction
  const proceedWithBet = async (option: string, amount: number, transaction?: unknown) => {
    try {
      console.log(`Processing bet: ${amount} bits on ${option}`, transaction ? 'with Bits transaction' : 'demo mode')
      
      // Use real betting service if we have a real prediction, otherwise demo mode
      if (realPrediction) {
        // Place bet through betting service
        const betData = {
          predictionId: realPrediction.id,
          userId: userIdRef.current,
          option,
          amount,
          timestamp: Date.now(),
          bitsTransaction: transaction // Include Bits transaction info if available
        }
        
        const updatedTotals = await bettingService.placeBet(betData)
        
        // Calculate potential payout based on updated totals (includes this bet)
        const potentialWin = calculateCurrentPotentialWin({
          predictionId: realPrediction.id,
          option,
          amount,
          potentialWin: 0 // placeholder
        }, updatedTotals)
        
        const newBet: UserBet = {
          predictionId: realPrediction.id,
          option,
          amount,
          potentialWin
        }
        
        setUserBet(newBet)
        console.log('Real bet placed successfully:', newBet, 'Updated totals:', updatedTotals)
        
      } else {
        // Demo mode fallback
        console.log(`Demo: Placing ${amount} bits bet on ${option}`)
        
        // Calculate proportional payout (winner takes all system)
        const totalPot = betTotals.yes + betTotals.no + amount
        const userSideBets = betTotals[option as keyof typeof betTotals] + amount
        const potentialWin = totalPot > 0 ? (amount / userSideBets) * totalPot : amount
        
        const newBet: UserBet = {
          predictionId: prediction?.id || 'demo',
          option,
          amount,
          potentialWin: Math.round(potentialWin)
        }
        
        // Update demo bet totals
        setBetTotals(prev => ({
          ...prev,
          [option]: prev[option as keyof typeof prev] + amount
        }))
        
        setUserBet(newBet)
        console.log('Demo bet placed successfully:', newBet)
      }
      
    } catch (error) {
      console.error('Failed to process bet:', error)
      setError('Failed to place bet. Please try again.')
    }
  }

  const handlePlaceBet = async (option: string, amount: number) => {
    console.log('🎯 DEBUG: handlePlaceBet called', { option, amount, prediction: !!prediction, realPrediction: !!realPrediction })
    
    // Production auth check - require authentication for real Twitch usage
    if (!prediction) {
      console.log('❌ DEBUG: No prediction available')
      setError('No prediction available. Please wait for the streamer to start a prediction.')
      return
    }
    
    // Only require Twitch auth when we have a real Twitch environment with proper auth context
    // In development, the Twitch script loads but we don't have real auth - allow demo mode
    const isRealTwitchEnvironment = window.Twitch?.ext?.bits && twitchAuth && twitchAuth.channelId
    if (window.Twitch?.ext?.bits && !twitchAuth && window.parent !== window) {
      // We're in an iframe (likely Twitch) but missing auth - this is an error
      console.log('❌ DEBUG: Twitch Bits available but no auth in iframe environment')
      setError('Authentication required for Bits transactions')
      return
    }
    
    try {
      // Twitch Bits integration - only use when we have real Twitch environment
      if (isRealTwitchEnvironment) {
        try {
          // Get available products
          const products = await window.Twitch.ext.bits.getProducts()
          console.log('Available Bits products:', products)
          
          // Find the appropriate Bits product for this amount
          // Try multiple approaches to match products with different API structures
          let bitsProduct = products.find((product: unknown) => {
            const prod = product as Record<string, unknown>
            const cost = prod.cost as Record<string, unknown> | undefined
            return cost?.amount === amount || 
                   prod.amount === amount ||
                   prod.bits === amount
          })
          
          // If no exact match, try to find custom product or closest match
          if (!bitsProduct) {
            bitsProduct = products.find((product: unknown) => {
              const prod = product as Record<string, unknown>
              return prod.sku === 'bet_custom' || 
                     (typeof prod.sku === 'string' && prod.sku.includes('custom'))
            })
          }
          
          // If still no match, get the first available product as fallback
          if (!bitsProduct && products.length > 0) {
            console.warn(`No exact product match for ${amount} bits, using fallback`)
            bitsProduct = products[0]
          }
          
          if (bitsProduct) {
            console.log(`Initiating Bits transaction for ${amount} bits with product:`, bitsProduct)
            
            // Set up transaction handlers before initiating
            const handleTransactionComplete = (transaction: unknown) => {
              console.log('Bits transaction completed successfully:', transaction)
              // Continue with bet placement after successful transaction
              proceedWithBet(option, amount, transaction)
            }
            
            const handleTransactionCancelled = (transaction: unknown) => {
              console.log('Bits transaction cancelled by user:', transaction)
              setError('Bits transaction was cancelled')
            }
            
            // Set up event handlers (these may need to be set only once)
            window.Twitch.ext.bits.onTransactionComplete(handleTransactionComplete)
            window.Twitch.ext.bits.onTransactionCancelled(handleTransactionCancelled)
            
            // Initiate the Bits transaction (does not return Promise)
            try {
              const product = bitsProduct as unknown as Record<string, unknown>
              window.Twitch.ext.bits.useBits(product.sku as string)
              console.log(`Bits transaction initiated with SKU: ${product.sku}`)
            } catch (useBitsError) {
              console.error('Failed to initiate useBits:', useBitsError)
              setError('Failed to start Bits transaction')
              return
            }
            
            // Exit early - actual bet placement happens in transaction complete handler
            return
            
          } else {
            console.error(`No Bits product found for ${amount} bits. Available products:`, products)
            setError(`No Bits product available for ${amount} bits. Please try a different amount.`)
            return
          }
        } catch (bitsError) {
          console.error('Bits transaction failed:', bitsError)
          setError('Failed to initiate Bits transaction. Please try again.')
          return
        }
      } else {
        // Development mode or Bits not available
        console.log(`Demo mode: Simulating ${amount} bits transaction for ${option}`)
      }
      
      // If we reach here, it means we're in demo mode (no Bits)
      console.log('No Bits available, proceeding with demo bet placement')
      await proceedWithBet(option, amount)
      
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
    <div className="min-h-screen text-white">
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
              ✅ Prediction Result
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

        {prediction?.status === 'resolved' && (
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-800">
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">{prediction.question}</h4>
              <div className="text-sm bg-green-600 text-white px-2 py-1 rounded inline-block">
                ✅ Prediction Result
              </div>
            </div>

            <div className="bg-green-800/20 border border-green-600 rounded-lg p-4 mb-4">
              <p className="text-green-300 font-medium">
                🎉 Winning Option: <span className="text-white">{prediction.options.find(o => o.id === prediction.winningOption)?.text}</span>
              </p>
            </div>

            {userBet && (
              <div className={`border rounded-lg p-3 ${
                userBet.option === prediction.winningOption 
                  ? 'bg-green-800/20 border-green-600' 
                  : 'bg-red-800/20 border-red-600'
              }`}>
                <p className="text-sm">
                  Your bet: <span className="font-medium">{userBet.amount} Bits on {prediction.options.find(o => o.id === userBet.option)?.text}</span>
                </p>
                {userBet.option === prediction.winningOption ? (
                  (() => {
                    // Calculate final accurate payout based on actual final totals
                    let finalPayout = userBet.potentialWin
                    
                    if (realBetTotals && realPrediction) {
                      // Use betting service to get accurate final payout
                      finalPayout = bettingService.calculatePayout(realPrediction.id, {
                        predictionId: realPrediction.id,
                        userId: userIdRef.current,
                        option: userBet.option,
                        amount: userBet.amount,
                        timestamp: Date.now()
                      }, prediction.winningOption)
                    }
                    
                    return (
                      <p className="text-green-300 font-medium mt-1">
                        🏆 You won {finalPayout} Bits! (Profit: {finalPayout - userBet.amount} Bits)
                      </p>
                    )
                  })()
                ) : (
                  <p className="text-red-300 mt-1">
                    😔 Better luck next time!
                  </p>
                )}
              </div>
            )}
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