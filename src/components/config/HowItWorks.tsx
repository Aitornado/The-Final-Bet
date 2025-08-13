export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Start Betting Window',
      description: 'Viewers can place bets using Twitch Bits on the prediction outcome',
      icon: '🎯'
    },
    {
      number: 2,
      title: 'Close Betting',
      description: 'Lock in all bets when ready to start the game or challenge',
      icon: '🔒'
    },
    {
      number: 3,
      title: 'Play Game',
      description: 'Game happens (variable length), extension stays open showing live stats',
      icon: '🎮'
    },
    {
      number: 4,
      title: 'Resolve Manually',
      description: 'Mark the outcome as SUCCESS or FAILED when the game ends',
      icon: '✅'
    },
    {
      number: 5,
      title: 'Payouts Distributed',
      description: 'Winners automatically receive their Bits plus winnings',
      icon: '💰'
    }
  ]

  return (
    <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-bet-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {step.number}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{step.icon}</span>
                <h3 className="font-semibold text-white">{step.title}</h3>
              </div>
              <p className="text-gray-300 text-sm">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-4 mt-8 w-0.5 h-6 bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
        <h4 className="font-semibold text-blue-300 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Keep prediction questions simple and clear</li>
          <li>• Close betting right before the outcome is determined</li>
          <li>• Resolve predictions quickly to maintain viewer engagement</li>
          <li>• Use templates for common scenarios to save time</li>
        </ul>
      </div>
    </div>
  )
}