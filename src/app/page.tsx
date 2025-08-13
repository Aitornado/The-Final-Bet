import LogoIcon from '@/components/LogoIcon'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bet-red-500 to-bet-red-600 flex items-center justify-center text-white">
      <div className="text-center p-10 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 max-w-2xl">
        <div className="w-20 h-20 bg-white/15 rounded-2xl mx-auto mb-8 flex items-center justify-center">
          <LogoIcon />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 text-shadow-lg">The Final Bet</h1>
        <div className="text-xl mb-8 opacity-90 font-medium">Twitch Extension</div>
        
        <div className="text-base leading-relaxed mb-10 opacity-80">
          Turn every gaming moment into interactive predictions. Engage your viewers with real-time betting using Twitch Bits.
        </div>
        
        <div className="bg-white/10 p-5 rounded-xl border border-white/20">
          <h3 className="text-lg mb-3 text-white">🚧 Coming Soon</h3>
          <p className="mb-5">Currently in development and under review by Twitch.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg text-sm">📊 Real-time Predictions</div>
            <div className="bg-white/5 p-3 rounded-lg text-sm">💎 Bits Integration</div>
            <div className="bg-white/5 p-3 rounded-lg text-sm">🏆 Leaderboards</div>
            <div className="bg-white/5 p-3 rounded-lg text-sm">⚡ Live Results</div>
          </div>
        </div>
        
        <div className="mt-10 text-xs opacity-60">
          <p>Developed by Aitorzilla | For Twitch Streamers & Viewers</p>
        </div>
      </div>
    </div>
  )
}