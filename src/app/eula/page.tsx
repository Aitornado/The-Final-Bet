export default function EulaPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">End User License Agreement</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Terms of Use</h2>
            <p>
              By using The Final Bet extension, you agree to these terms. The extension
              is provided as-is for entertainment purposes on the Twitch platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Responsible Gaming</h2>
            <p>
              This extension uses Twitch Bits for predictions. Users must be 18+ and
              should bet responsibly. We are not responsible for financial losses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Prohibited Conduct</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Attempting to exploit or hack the extension</li>
              <li>Using the extension for illegal activities</li>
              <li>Harassing other users or streamers</li>
              <li>Creating multiple accounts to circumvent limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
            <p>
              The Final Bet and its developers are not liable for any damages resulting
              from use of this extension. Use at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              For questions about these terms, contact{' '}
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