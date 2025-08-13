import { ActivePrediction } from '@/types/config'

interface QuickActionsProps {
  currentPrediction: ActivePrediction | null
  onCreatePrediction: () => void
  onEndPrediction: () => void
  onResolvePrediction: (option: string) => void
}

export default function QuickActions({ 
  currentPrediction, 
  onCreatePrediction, 
  onEndPrediction, 
  onResolvePrediction 
}: QuickActionsProps) {
  const canCreateNew = !currentPrediction || currentPrediction.status === 'resolved'
  const canEnd = currentPrediction && currentPrediction.status === 'betting'
  const canResolve = currentPrediction && currentPrediction.status === 'locked'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={onCreatePrediction}
        disabled={!canCreateNew}
        className="bg-gray-700 hover:bg-bet-red-600 disabled:bg-gray-800 disabled:cursor-not-allowed border-2 border-gray-600 hover:border-bet-red-500 disabled:border-gray-700 rounded-lg p-4 text-center transition-all"
      >
        <div className="text-lg mb-2">🎯</div>
        <div className="font-semibold mb-1">New Prediction</div>
        <div className="text-xs text-gray-400">Start a new prediction for your viewers</div>
      </button>

      <button
        onClick={onEndPrediction}
        disabled={!canEnd}
        className="bg-gray-700 hover:bg-yellow-600 disabled:bg-gray-800 disabled:cursor-not-allowed border-2 border-gray-600 hover:border-yellow-500 disabled:border-gray-700 rounded-lg p-4 text-center transition-all"
      >
        <div className="text-lg mb-2">⏹️</div>
        <div className="font-semibold mb-1">End Betting</div>
        <div className="text-xs text-gray-400">Close betting window and lock bets</div>
      </button>

      <div className="relative">
        <button
          onClick={() => {
            if (canResolve && currentPrediction?.options) {
              const option = prompt(`Select winning option:\n${currentPrediction.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`)
              if (option && currentPrediction.options.includes(option)) {
                onResolvePrediction(option)
              }
            }
          }}
          disabled={!canResolve}
          className="w-full bg-gray-700 hover:bg-green-600 disabled:bg-gray-800 disabled:cursor-not-allowed border-2 border-gray-600 hover:border-green-500 disabled:border-gray-700 rounded-lg p-4 text-center transition-all"
        >
          <div className="text-lg mb-2">✅</div>
          <div className="font-semibold mb-1">Resolve</div>
          <div className="text-xs text-gray-400">Declare winner and distribute payouts</div>
        </button>
      </div>
    </div>
  )
}