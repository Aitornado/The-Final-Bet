'use client'

import { Prediction, UserBet, PredictionOption } from '@/types/twitch'

interface GameProgressProps {
  prediction: Prediction
  userBet: UserBet | null
}

export default function GameProgress({ prediction, userBet }: GameProgressProps) {
  const getPercentage = (option: PredictionOption) => {
    const totalBits = prediction.options.reduce((sum, opt) => sum + opt.bits, 0)
    return totalBits > 0 ? Math.round((option.bits / totalBits) * 100) : 0
  }

  const totalBets = prediction.options.reduce((sum, opt) => sum + opt.bits, 0)

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6">
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">{prediction.question}</h4>
        <div className="text-sm bg-yellow-600 text-white px-2 py-1 rounded inline-block">
          🎮 Match in progress
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-400">Total Pot</div>
          <div className="text-base sm:text-lg font-semibold">{prediction.totalPot || 0} Bits</div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-400">Total Bets</div>
          <div className="text-base sm:text-lg font-semibold">{totalBets}</div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <h5 className="text-sm sm:text-base font-medium">Bet Breakdown</h5>
        
        {prediction.options.map((option, index) => {
          const percentage = getPercentage(option)
          const isYes = index === 0
          
          return (
            <div key={option.id} className="space-y-1 sm:space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-medium">{option.text}</span>
                <span className="text-xs sm:text-sm">{percentage}%</span>
              </div>
              <div className="text-xs text-gray-400">
                {option.bits} Bits
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                <div
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    isYes ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {userBet && (
        <div className="bg-blue-800/20 border border-blue-600 rounded-lg p-3">
          <p className="text-sm">
            Your bet: <span className="font-medium">{userBet.amount} Bits on {prediction.options.find(o => o.id === userBet.option)?.text}</span>
          </p>
        </div>
      )}
    </div>
  )
}