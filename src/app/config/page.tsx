'use client'

import { useState, useEffect } from 'react'
import LogoIcon from '@/components/LogoIcon'
import ConfigSection from '@/components/config/ConfigSection'
import QuickActions from '@/components/config/QuickActions'
import PredictionForm from '@/components/config/PredictionForm'
import SettingsForm from '@/components/config/SettingsForm'
import HowItWorks from '@/components/config/HowItWorks'
import { ExtensionSettings, PredictionTemplate, ActivePrediction } from '@/types/config'

export default function ConfigPage() {
  const [settings, setSettings] = useState<ExtensionSettings>({
    minBits: 1,
    maxBits: 10000,
    autoResolve: 'manual',
    predictionTimeout: 300
  })

  const [isConnected, setIsConnected] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState<ActivePrediction | null>(null)
  const [customQuestion, setCustomQuestion] = useState('')

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
    // Initialize Twitch extension
    if (typeof window !== 'undefined' && window.Twitch?.ext) {
      window.Twitch.ext.onAuthorized((_auth: Record<string, unknown>) => {
        setIsConnected(true)
        loadConfiguration()
      })

      window.Twitch.ext.configuration.onChanged(() => {
        loadConfiguration()
      })
    }
  }, [])

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
  }

  const endCurrentPrediction = () => {
    if (currentPrediction) {
      setCurrentPrediction({ ...currentPrediction, status: 'locked' })
    }
  }

  const resolvePrediction = (winningOption: string) => {
    if (currentPrediction) {
      setCurrentPrediction({ 
        ...currentPrediction, 
        status: 'resolved',
        winningOption 
      })
      
      // Auto-hide prediction after 3 seconds
      setTimeout(() => {
        setCurrentPrediction(null)
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
            <LogoIcon />
          </div>
          <h1 className="text-2xl font-bold text-white">The Final Bet Configuration</h1>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* How It Works - Left Side */}
          <div className="lg:col-span-1">
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

          {/* Right Side Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                const question = prompt('Enter prediction question:')
                if (question) createPrediction(question)
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
              <p className="text-gray-400 text-sm">Begin betting window</p>
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

            {/* Create New Prediction */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Create New Prediction</h2>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gray-400 text-sm">Playing</span>
                  <span className="text-yellow-400 font-medium">The Finals</span>
                  <span className="text-gray-400 text-sm">- Choose a quick template below or create custom prediction</span>
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
              <div>
                <h3 className="text-white font-medium mb-3">Prediction Question</h3>
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="e.g., Will my team win this match?"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none mb-4"
                />
                <button
                  onClick={() => {
                    if (customQuestion.trim()) {
                      createPrediction(customQuestion)
                      setCustomQuestion('')
                    }
                  }}
                  disabled={!!currentPrediction && currentPrediction.status !== 'resolved' || !customQuestion.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClick={() => saveConfiguration(settings)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Save Settings
              </button>
              <button
                onClick={() => setSettings({ minBits: 1, maxBits: 10000, autoResolve: 'manual', predictionTimeout: 300 })}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}