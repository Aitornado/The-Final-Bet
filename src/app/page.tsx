import Link from 'next/link'
import LogoIcon from '@/components/LogoIcon'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="w-24 h-14 bg-red-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
              <LogoIcon />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              The Final Bet
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-gray-300 font-medium">
              Interactive Prediction Extension for Twitch
            </p>
            
            <p className="text-lg mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Turn every gaming moment into interactive predictions. Engage your viewers with real-time betting using Twitch Bits and create an immersive experience that keeps everyone on the edge of their seats.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/viewer"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg inline-flex items-center justify-center"
              >
                <span className="mr-2">🎮</span>
                Try Viewer Demo
              </Link>
              <Link 
                href="/config"
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg inline-flex items-center justify-center border border-gray-700"
              >
                <span className="mr-2">⚙️</span>
                Streamer Config
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simple, engaging, and profitable for everyone involved
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Predictions</h3>
            <p className="text-gray-400">
              Create custom predictions about your gameplay moments and outcomes
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Bits Integration</h3>
            <p className="text-gray-400">
              Viewers bet with Twitch Bits, creating real stakes and excitement
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Live Results</h3>
            <p className="text-gray-400">
              Instant payouts and results keep the energy high throughout your stream
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Setup</h3>
            <p className="text-gray-400">
              One-click prediction creation with smart templates for popular games
            </p>
          </div>
        </div>

        {/* Live Demo Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Experience It Live</h3>
              <p className="text-gray-300 mb-6">
                Try the full viewer experience with interactive demo controls. See how predictions work from start to finish, complete with betting mechanics and real-time updates.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-green-400">
                  <span className="mr-3">✓</span>
                  <span>Test all prediction states (Active, Locked, Resolved)</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-3">✓</span>
                  <span>Simulate betting with virtual Bits</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span className="mr-3">✓</span>
                  <span>See payout calculations and winner notifications</span>
                </div>
              </div>
              <Link 
                href="/viewer"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center"
              >
                <span className="mr-2">🎮</span>
                Launch Demo
              </Link>
            </div>
            <div className="bg-gray-950 rounded-lg p-6 border border-gray-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">Interactive Demo Available</p>
                <div className="bg-gray-800 rounded p-3 mb-4">
                  <p className="text-sm font-medium">Will my team win this match?</p>
                  <div className="flex gap-2 mt-2">
                    <div className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs">Yes - 1.8x</div>
                    <div className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-xs">No - 2.1x</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">🎮 Try all prediction states and betting flows</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="text-center mt-16 p-8 bg-blue-900/20 rounded-xl border border-blue-600/30">
          <h3 className="text-xl font-semibold mb-3 text-blue-300">🔍 Extension Status</h3>
          <p className="text-blue-200 mb-4">Currently under review by Twitch</p>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            The extension is fully functional and ready for testing. All features are available in the demo environment while we await Twitch approval for the official launch.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Developed by Aitorzilla | For Twitch Streamers & Viewers |{' '}
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            {' • '}
            <Link href="/eula" className="hover:text-white transition-colors">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}