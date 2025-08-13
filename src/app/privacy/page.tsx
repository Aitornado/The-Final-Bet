export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <p>
              The Final Bet extension collects minimal data necessary for functionality:
              Twitch user ID, betting preferences, and interaction data within the extension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Information</h2>
            <p>
              Data is used solely to provide the betting experience, track leaderboards,
              and ensure fair gameplay. We do not sell or share personal data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
            <p>
              All data is encrypted and stored securely. We follow industry best practices
              for data protection and regularly audit our security measures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              For privacy concerns, contact us at{' '}
              <a href="mailto:aitorzilla@gmail.com" className="text-bet-red-500 hover:underline">
                aitorzilla@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}