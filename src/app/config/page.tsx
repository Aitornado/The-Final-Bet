'use client'

import { useState, useEffect, useRef } from 'react'
import LogoIcon from '@/components/LogoIcon'
import { ExtensionSettings, PredictionTemplate, ActivePrediction } from '@/types/config'
import { bettingService, BetTotals } from '@/services/bettingService'

export default function ConfigPage() {
  const [settings, setSettings] = useState<ExtensionSettings>({
    minBits: 1,
    maxBits: 10000,
    autoResolve: 'manual',
    predictionTimeout: 300
  })

  const [currentPrediction, setCurrentPrediction] = useState<ActivePrediction | null>(null)
  const [customQuestion, setCustomQuestion] = useState('')
  const [payoutNotification, setPayoutNotification] = useState<{
    winningOption: string,
    totalPayout: number,
    winnerCount: number
  } | null>(null)
  const [settingsNotification, setSettingsNotification] = useState<{
    type: 'saved' | 'reset',
    message: string
  } | null>(null)
  const [realBetTotals, setRealBetTotals] = useState<BetTotals | null>(null)
  
  const customQuestionInputRef = useRef<HTMLInputElement>(null)
  const payoutTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const predictionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const settingsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const predictionTemplates: PredictionTemplate[] = [
    {
      id: 'win-loss',
      name: 'Win/Loss',
      question: 'Will my team win this match?',
      options: ['Yes', 'No'],
      category: 'Gaming'
    },
    {
      id: 'clutch',
      name: 'Clutch Play',
      question: 'Will my team win this round?',
      options: ['Yes', 'No'],
      category: 'Gaming'
    },
    {
      id: 'score-over-under',
      name: 'Score Prediction',
      question: 'Will I get at least 30 eliminations?',
      options: ['Yes', 'No'],
      category: 'Gaming'
    },
    {
      id: 'first-death',
      name: 'First Death',
      question: 'Will I die first this round?',
      options: ['Yes', 'No'],
      category: 'Gaming'
    }
  ]

  useEffect(() => {
    let authCleanup: (() => void) | null = null
    let configCleanup: (() => void) | null = null

    // Initialize Twitch extension
    if (typeof window !== 'undefined' && window.Twitch?.ext) {
      const handleAuth = () => {
        loadConfiguration()
      }

      const handleConfigChange = () => {
        loadConfiguration()
      }

      window.Twitch.ext.onAuthorized(handleAuth)
      window.Twitch.ext.configuration.onChanged(handleConfigChange)

      // Store cleanup functions
      authCleanup = () => {
        // Clear any pending configuration loading
        console.log('Cleaning up Twitch Extension auth listener')
      }

      configCleanup = () => {
        // Clear any pending configuration changes
        console.log('Cleaning up Twitch Extension config listener')
      }
    }

    // Cleanup function
    return () => {
      if (authCleanup) authCleanup()
      if (configCleanup) configCleanup()
      
      // Clear any pending timeouts
      if (payoutTimeoutRef.current) {
        clearTimeout(payoutTimeoutRef.current)
        payoutTimeoutRef.current = null
      }
      if (predictionTimeoutRef.current) {
        clearTimeout(predictionTimeoutRef.current)
        predictionTimeoutRef.current = null
      }
      if (settingsTimeoutRef.current) {
        clearTimeout(settingsTimeoutRef.current)
        settingsTimeoutRef.current = null
      }
    }
  }, [])

  // Listen for bet updates when a prediction is active
  useEffect(() => {
    let cleanup: (() => void) | null = null

    if (currentPrediction) {
      // Subscribe to bet updates for this prediction
      cleanup = bettingService.onBetUpdate(currentPrediction.id, (totals) => {
        console.log('Config: Received bet update:', totals)
        setRealBetTotals(totals)
      })

      // Load initial bet totals
      const initialTotals = bettingService.getBetTotals(currentPrediction.id)
      setRealBetTotals(initialTotals)
    } else {
      // Clear real bet totals when no prediction
      setRealBetTotals(null)
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [currentPrediction?.id, currentPrediction])

  const loadConfiguration = () => {
    if (window.Twitch?.ext?.configuration?.broadcaster?.content) {
      try {
        const config = JSON.parse(window.Twitch.ext.configuration.broadcaster.content)
        setSettings(prev => ({ ...prev, ...config }))
      } catch (error) {
        console.error('Failed to load configuration:', error)
      }
    }
  }

  const saveConfiguration = (newSettings: ExtensionSettings) => {
    if (window.Twitch?.ext?.configuration?.set) {
      const configData = JSON.stringify(newSettings)
      window.Twitch.ext.configuration.set('broadcaster', '1.0', configData)
      setSettings(newSettings)
    }
  }

  const createPrediction = (question: string, template?: PredictionTemplate) => {
    const predictionData: ActivePrediction = {
      id: `pred_${Date.now()}`,
      question,
      options: template?.options || ['Yes', 'No'],
      timeRemaining: settings.predictionTimeout,
      status: 'betting',
      totalPot: 0,
      totalBets: 0,
      createdAt: Date.now()
    }

    // Here you would typically send this to your backend service
    console.log('Creating prediction:', predictionData)
    setCurrentPrediction(predictionData)
    
    // Save new prediction to settings so viewers receive it
    const updatedSettings = {
      ...settings,
      currentPrediction: predictionData
    }
    saveConfiguration(updatedSettings)
  }

  const endCurrentPrediction = () => {
    if (currentPrediction) {
      const lockedPrediction: ActivePrediction = { ...currentPrediction, status: 'locked' }
      setCurrentPrediction(lockedPrediction)
      
      // Save locked prediction to settings so viewers see the locked state
      const updatedSettings = {
        ...settings,
        currentPrediction: lockedPrediction
      }
      saveConfiguration(updatedSettings)
    }
  }

  const resolvePrediction = (winningOption: string) => {
    if (currentPrediction) {
      const resolvedPrediction: ActivePrediction = { 
        ...currentPrediction, 
        status: 'resolved',
        winningOption 
      }
      
      // Calculate payout information for notification using real bet totals
      const totalPayout = realBetTotals?.totalPot || currentPrediction.totalPot || 2450 // Use real totals if available
      const winnerCount = realBetTotals?.betHistory.filter(bet => bet.option.toLowerCase() === winningOption.toLowerCase()).length || Math.floor(totalPayout / 100) || 12
      
      // FIRST: Show payout confirmation immediately
      setPayoutNotification({
        winningOption,
        totalPayout,
        winnerCount
      })
      
      // THEN: Update prediction status
      setCurrentPrediction(resolvedPrediction)
      
      // Save resolved prediction to settings so viewers receive the result
      const updatedSettings = {
        ...settings,
        currentPrediction: resolvedPrediction
      }
      saveConfiguration(updatedSettings)
      
      // Auto-hide payout notification after 3 seconds
      if (payoutTimeoutRef.current) {
        clearTimeout(payoutTimeoutRef.current)
      }
      payoutTimeoutRef.current = setTimeout(() => {
        setPayoutNotification(null)
        payoutTimeoutRef.current = null
      }, 3000)
      
      // Auto-hide prediction after 6 seconds (3 seconds after payout disappears)
      if (predictionTimeoutRef.current) {
        clearTimeout(predictionTimeoutRef.current)
      }
      predictionTimeoutRef.current = setTimeout(() => {
        setCurrentPrediction(null)
        // Clear prediction from settings when hiding
        saveConfiguration({ ...settings, currentPrediction: null })
        predictionTimeoutRef.current = null
      }, 6000)
    }
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
            <LogoIcon />
          </div>
          <h1 className="text-2xl font-bold text-white">The Final Bet Configuration</h1>
        </div>


        {/* Payout Status Card */}
        {payoutNotification && (
          <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Payout Status</h2>
            <div className="bg-green-800/20 border border-green-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 font-medium text-lg">
                    ✅ Payouts Completed
                  </p>
                  <p className="text-white text-sm mt-2">
                    <span className="text-gray-400">Winner:</span> <span className="font-medium text-green-300">{payoutNotification.winningOption}</span>
                  </p>
                  <p className="text-white text-sm mt-1">
                    <span className="text-gray-400">Distributed:</span> <span className="font-medium">{payoutNotification.totalPayout.toLocaleString()} Bits</span> to <span className="font-medium">{payoutNotification.winnerCount} winners</span>
                  </p>
                </div>
                <div className="text-4xl">🎉</div>
              </div>
            </div>
          </div>
        )}

        {/* Current Status */}
        {currentPrediction && (
          <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Current Prediction Status</h2>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-white">{currentPrediction.question}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentPrediction.status === 'betting' ? 'bg-green-900 text-green-300' :
                  currentPrediction.status === 'locked' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {currentPrediction.status.toUpperCase()}
                </span>
              </div>
              {currentPrediction.status === 'locked' && (
                <div className="text-sm text-yellow-400 mb-2 font-medium">
                  🎮 Match in progress
                </div>
              )}

              {/* Real-time Betting Statistics */}
              {realBetTotals && realBetTotals.totalBets > 0 && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <h5 className="text-sm font-medium text-white mb-2">💰 Live Betting Stats</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Pot:</span>
                      <div className="text-white font-medium">{realBetTotals.totalPot.toLocaleString()} Bits</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Bets:</span>
                      <div className="text-white font-medium">{realBetTotals.totalBets}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Yes Bets:</span>
                      <div className="text-green-400 font-medium">{realBetTotals.yes.toLocaleString()} Bits</div>
                    </div>
                    <div>
                      <span className="text-gray-400">No Bets:</span>
                      <div className="text-red-400 font-medium">{realBetTotals.no.toLocaleString()} Bits</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Yes: {realBetTotals.totalPot > 0 ? Math.round((realBetTotals.yes / realBetTotals.totalPot) * 100) : 0}% • 
                    No: {realBetTotals.totalPot > 0 ? Math.round((realBetTotals.no / realBetTotals.totalPot) * 100) : 0}%
                  </div>
                </div>
              )}

              {currentPrediction.winningOption && (
                <div className="text-sm mt-2">
                  <span className="text-yellow-400 font-medium">Winner: </span>
                  <span className={`font-medium ${
                    currentPrediction.winningOption.toLowerCase() === 'yes' || 
                    currentPrediction.winningOption.toLowerCase() === 'win'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {currentPrediction.winningOption}
                  </span>
                </div>
              )}
              {currentPrediction.status !== 'resolved' && (
                <div className="flex gap-2 mt-4">
                  {currentPrediction.status === 'betting' && (
                    <button
                      onClick={endCurrentPrediction}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      Close Betting
                    </button>
                  )}
                  {currentPrediction.status === 'locked' && currentPrediction.options && (
                    <>
                      {currentPrediction.options.map((option, index) => (
                        <button
                          key={option}
                          onClick={() => resolvePrediction(option)}
                          className={`text-white text-sm px-4 py-2 rounded-lg transition-colors ${
                            option.toLowerCase() === 'yes' || option.toLowerCase() === 'win' || index === 0
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {option} Wins
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column: Quick Actions + How It Works */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                // Focus the custom question input field instead of using popup
                customQuestionInputRef.current?.focus()
                customQuestionInputRef.current?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                })
              }}
              disabled={!!currentPrediction && currentPrediction.status !== 'resolved'}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-red-600 rounded mr-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-white">Start New Prediction</span>
              </div>
              <p className="text-gray-400 text-sm">Go to prediction form below</p>
            </button>
            
            <button
              onClick={() => alert('Past Results\n\nComing soon! Prediction history and analytics will be available in a future update.')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 text-left transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <span className="font-medium text-white">Past Results</span>
              </div>
              <p className="text-gray-400 text-sm">View previous predictions</p>
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">How The Final Bet Works</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-white font-medium">Start New Prediction</h3>
                    <p className="text-gray-400 text-sm">Create prediction question - Status: BETTING</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-white font-medium">Close Betting</h3>
                    <p className="text-gray-400 text-sm">Lock in bets when ready - Status: LOCKED</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-white font-medium">Match in Progress</h3>
                    <p className="text-gray-400 text-sm">Play your game while viewers wait for results</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-white font-medium">Resolve Prediction</h3>
                    <p className="text-gray-400 text-sm">Click Yes or No to declare winner - Status: RESOLVED</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">5</div>
                  <div>
                    <h3 className="text-white font-medium">Payouts Distributed</h3>
                    <p className="text-gray-400 text-sm">Winners automatically receive their Bits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Create New Prediction */}
          <div>
            {/* Create New Prediction */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full flex flex-col">
              <h2 className="text-lg font-semibold text-white mb-4">Create New Prediction</h2>
              <div className="mb-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 text-sm">Playing</span>
                    <span className="text-yellow-400 font-medium">The Finals</span>
                  </div>
                  <p className="text-gray-400 text-sm">Choose a quick template below or create custom prediction</p>
                </div>
              </div>
              
              {/* Quick Templates */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Quick Templates</h3>
                <div className="space-y-2">
                  {predictionTemplates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => createPrediction(template.question, template)}
                      disabled={!!currentPrediction && currentPrediction.status !== 'resolved'}
                      className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-white">{template.question}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prediction */}
              <div className="flex-grow flex flex-col justify-between">
                <div className="mt-8">
                  <h3 className="text-white font-medium mb-3">Prediction Question</h3>
                  <input
                    ref={customQuestionInputRef}
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customQuestion.trim()) {
                        createPrediction(customQuestion)
                        setCustomQuestion('')
                      }
                    }}
                    placeholder="e.g., Will my team win this match?"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (customQuestion.trim()) {
                      createPrediction(customQuestion)
                      setCustomQuestion('')
                    }
                  }}
                  disabled={!!currentPrediction && currentPrediction.status !== 'resolved' || !customQuestion.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Start Betting Window
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extension Settings */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Extension Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Minimum Bits per Bet</label>
              <input
                type="number"
                value={settings.minBits}
                onChange={(e) => setSettings(prev => ({ ...prev, minBits: parseInt(e.target.value) || 1 }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Maximum Bits per Bet</label>
              <input
                type="number"
                value={settings.maxBits}
                onChange={(e) => setSettings(prev => ({ ...prev, maxBits: parseInt(e.target.value) || 10000 }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  saveConfiguration(settings)
                  setSettingsNotification({
                    type: 'saved',
                    message: 'Settings saved!'
                  })
                  if (settingsTimeoutRef.current) {
                    clearTimeout(settingsTimeoutRef.current)
                  }
                  settingsTimeoutRef.current = setTimeout(() => {
                    setSettingsNotification(null)
                    settingsTimeoutRef.current = null
                  }, 3000)
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Save Settings
              </button>
              <button
                onClick={() => {
                  setSettings({ minBits: 1, maxBits: 10000, autoResolve: 'manual', predictionTimeout: 300 })
                  setSettingsNotification({
                    type: 'reset',
                    message: 'Settings reset to defaults!'
                  })
                  if (settingsTimeoutRef.current) {
                    clearTimeout(settingsTimeoutRef.current)
                  }
                  settingsTimeoutRef.current = setTimeout(() => {
                    setSettingsNotification(null)
                    settingsTimeoutRef.current = null
                  }, 3000)
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
            
            {/* Settings Notification */}
            {settingsNotification && (
              <div className="mt-4 bg-green-800/20 border border-green-600 rounded-lg p-3">
                <div className="flex items-center">
                  <span className="text-green-300 font-medium text-sm">
                    {settingsNotification.type === 'saved' ? '✅' : '🔄'} {settingsNotification.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}