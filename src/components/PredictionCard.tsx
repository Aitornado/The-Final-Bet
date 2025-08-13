'use client'

import { useState } from 'react'
import { Prediction, UserBet } from '@/types/twitch'

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6">
      <div className="mb-4">
        <h4 className="text-lg font-semibold">{prediction.question}</h4>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        {prediction.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`p-4 sm:p-3 min-h-[44px] rounded-lg border-2 transition-all touch-manipulation ${
              selectedOption === option.id
                ? option.text.toLowerCase() === 'yes' || index === 0
                  ? 'border-yellow-400 bg-green-600 text-white shadow-lg shadow-yellow-400/50'
                  : 'border-yellow-400 bg-red-600 text-white shadow-lg shadow-yellow-400/50'
                : option.text.toLowerCase() === 'yes' || index === 0
                  ? 'border-green-500 bg-green-700 hover:bg-green-600 text-white'
                  : 'border-red-500 bg-red-700 hover:bg-red-600 text-white'
            }`}
          >
            <div className="text-sm sm:text-base font-medium">{option.text}</div>
          </button>
        ))}
      </div>

      {!userBet && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L12 4L8 8L4 4L8 0Z" fill="url(#bitsGradient)"/>
              <path d="M8 8L12 12L8 16L4 12L8 8Z" fill="url(#bitsGradient2)"/>
              <defs>
                <linearGradient id="bitsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9146FF"/>
                  <stop offset="50%" stopColor="#00D4FF"/>
                  <stop offset="100%" stopColor="#9146FF"/>
                </linearGradient>
                <linearGradient id="bitsGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF"/>
                  <stop offset="50%" stopColor="#9146FF"/>
                  <stop offset="100%" stopColor="#00D4FF"/>
                </linearGradient>
              </defs>
            </svg>
            <input
              type="number"
              min="1"
              max="10000"
              value={bitsAmount}
              onChange={(e) => setBitsAmount(Number(e.target.value))}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 min-h-[44px] text-white text-base"
              placeholder="Bits"
            />
            <button
              onClick={handlePlaceBet}
              disabled={!selectedOption || bitsAmount <= 0}
              className="px-4 py-3 min-h-[44px] bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors touch-manipulation"
            >
              Place Bet
            </button>
          </div>
        </div>
      )}

      {userBet && (
        <div className="bg-green-800/20 border border-green-600 rounded-lg p-3">
          <p className="text-sm">
            Your bet: <span className="font-medium">{userBet.amount} Bits on {prediction.options.find(o => o.id === userBet.option)?.text}</span>
          </p>
          <p className="text-xs text-green-400">Potential win: {userBet.potentialWin} Bits</p>
        </div>
      )}
    </div>
  )
}