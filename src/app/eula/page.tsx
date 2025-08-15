import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'End User License Agreement | The Final Bet',
  description: 'End User License Agreement for The Final Bet Twitch Extension - Terms of service for Bits-based predictions.',
}

const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-red-950 border-2 border-bet-red-500 p-6 rounded-lg my-6">
    {children}
  </div>
)

const DisclaimerBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-yellow-900 border border-yellow-500 p-6 rounded-lg my-6">
    {children}
  </div>
)

export default function EulaPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-bet-red-500 border-b-2 border-bet-red-500 pb-4 mb-8">
          The Final Bet - End User License Agreement (EULA)
        </h1>
        
        <p className="text-sm text-gray-400 italic mb-8">
          <strong>Last Updated: August 15, 2025</strong>
        </p>

        <p className="text-gray-300 mb-8">
          This End User License Agreement (&quot;Agreement&quot;) is between you (&quot;User&quot;) and Aitorzilla (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) 
          regarding your use of The Final Bet Twitch Extension (&quot;Extension&quot;).
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By installing, accessing, or using The Final Bet Extension, you agree to be bound by this Agreement. 
              If you do not agree to these terms, do not use the Extension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">2. Description of Service</h2>
            <p className="text-gray-300">
              The Final Bet is a Twitch Extension that allows viewers to place predictions on gaming outcomes using Twitch Bits. 
              Users can predict match results, kill counts, and other gaming events during live streams.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">3. License Grant</h2>
            <p className="text-gray-300">
              We grant you a limited, non-exclusive, non-transferable, revocable license to use the Extension for personal, 
              non-commercial purposes in accordance with this Agreement and Twitch&apos;s Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">4. User Conduct</h2>
            <p className="text-gray-300 mb-4">You agree to:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li>Use the Extension only for lawful purposes</li>
              <li>Not attempt to manipulate, exploit, or interfere with the Extension&apos;s functionality</li>
              <li>Not use automated systems or bots to place predictions</li>
              <li>Comply with all applicable Twitch Terms of Service and Community Guidelines</li>
              <li>Not share your Twitch account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">5. Virtual Currency and Bits Transactions</h2>

            <WarningBox>
              <h3 className="text-lg font-medium text-red-300 mb-2 flex items-center">
                ⚠️ Important Bits and Virtual Currency Terms
              </h3>
              <p className="text-red-100">
                <strong>This section is critical for your understanding of Bits usage in predictions.</strong>
              </p>
            </WarningBox>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">5.1 Bits as Virtual Currency</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">No Real Money Value</strong>: Bits used in predictions have no real-world monetary value and cannot be exchanged for cash</li>
              <li><strong className="text-white">Entertainment Only</strong>: All predictions are for entertainment purposes only and do not constitute gambling</li>
              <li><strong className="text-white">Virtual Rewards</strong>: Any &quot;winnings&quot; or &quot;payouts&quot; are virtual credits within the Extension with no monetary value</li>
              <li><strong className="text-white">Twitch Bits Integration</strong>: Bits transactions are processed through Twitch&apos;s payment system and subject to Twitch&apos;s Terms of Service</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">5.2 Prediction Rules</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Final Transactions</strong>: All predictions are final once submitted - no refunds or cancellations</li>
              <li><strong className="text-white">Minimum Age</strong>: You must be 18 years of age or older to participate in Bits-based predictions</li>
              <li><strong className="text-white">Geographic Restrictions</strong>: Service may be restricted in certain jurisdictions where virtual currency predictions are prohibited</li>
              <li><strong className="text-white">Account Limits</strong>: We may impose daily, weekly, or monthly limits on prediction amounts</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">5.3 Payout and Resolution</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Algorithmic Determination</strong>: Payouts are calculated using predetermined algorithms and streamer configurations</li>
              <li><strong className="text-white">Streamer Authority</strong>: Final prediction outcomes are determined by the streamer or Extension moderators</li>
              <li><strong className="text-white">Technical Issues</strong>: We reserve the right to void predictions in cases of technical errors, suspected fraud, or force majeure events</li>
              <li><strong className="text-white">Dispute Resolution</strong>: Prediction disputes will be resolved at our sole discretion within 30 days</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">5.4 Responsible Gaming</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Entertainment Focus</strong>: Participate responsibly and within your means</li>
              <li><strong className="text-white">No Addiction Support</strong>: While this is not gambling, if you feel you have issues with virtual currency spending, please seek professional help</li>
              <li><strong className="text-white">Self-Exclusion</strong>: You may request to be excluded from Bits-based features by contacting support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-300">
              The Extension, including all content, features, and functionality, is owned by us and protected by copyright, 
              trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works of the Extension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">7. Disclaimers</h2>

            <DisclaimerBox>
              <ul className="list-disc ml-6 space-y-2 text-yellow-100">
                <li>The Extension is provided &quot;as is&quot; without warranties of any kind</li>
                <li>We do not guarantee uninterrupted or error-free operation</li>
                <li>Prediction results are for entertainment purposes only</li>
                <li>We are not responsible for any losses resulting from prediction outcomes</li>
              </ul>
            </DisclaimerBox>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">8. Limitation of Liability</h2>

            <p className="text-white font-semibold mb-4">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul className="list-disc ml-6 space-y-3 text-gray-300">
              <li><strong className="text-white">No Liability for Virtual Losses</strong>: We shall not be liable for any loss of Bits, virtual rewards, prediction outcomes, or any virtual currency within the Extension</li>
              <li><strong className="text-white">Technical Issues</strong>: We are not responsible for losses due to server downtime, connectivity issues, Twitch platform problems, or Extension malfunctions</li>
              <li><strong className="text-white">Third-Party Services</strong>: We are not liable for issues arising from Twitch&apos;s platform, payment processing, or other third-party services</li>
              <li><strong className="text-white">Consequential Damages</strong>: We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Extension</li>
              <li><strong className="text-white">Maximum Liability</strong>: Our total liability to you for all claims shall not exceed $100 USD or the equivalent amount in your local currency</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">8.1 Force Majeure</h3>
            <p className="text-gray-300">
              We shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable control, 
              including but not limited to natural disasters, government actions, network failures, or Twitch platform issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">9. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of the Extension 
              or violation of this Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">10. Termination</h2>
            <p className="text-gray-300">
              We may terminate your access to the Extension at any time for any reason. Upon termination, your license to use the Extension 
              ends immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">11. Changes to Agreement</h2>
            <p className="text-gray-300">
              We reserve the right to modify this Agreement at any time. Changes will be effective when posted. 
              Your continued use of the Extension constitutes acceptance of the modified Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">12. Dispute Resolution and Governing Law</h2>

            <h3 className="text-xl font-medium text-white mb-3">12.1 Governing Law</h3>
            <p className="text-gray-300">
              This Agreement is governed by the laws of California, United States, without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-medium text-white mb-3 mt-4">12.2 Arbitration</h3>
            <p className="text-gray-300">
              Any disputes arising from this Agreement shall be resolved through binding arbitration in accordance with the rules of the 
              American Arbitration Association. You waive your right to participate in class action lawsuits.
            </p>

            <h3 className="text-xl font-medium text-white mb-3 mt-4">12.3 Jurisdiction</h3>
            <p className="text-gray-300">
              For matters not subject to arbitration, you agree to submit to the exclusive jurisdiction of the courts in San Francisco County, California.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">13. Contact Information</h2>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">For questions about this Agreement, contact us at:</p>
              <p className="text-white">
                Email:{' '}
                <a href="mailto:aitorzilla@gmail.com" className="text-bet-red-500 hover:text-bet-red-600 hover:underline">
                  aitorzilla@gmail.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">14. Severability</h2>
            <p className="text-gray-300">
              If any provision of this Agreement is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">15. Twitch Integration and Compliance</h2>

            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Twitch Developer Agreement</strong>: This Extension complies with Twitch&apos;s Developer Agreement and Extension policies</li>
              <li><strong className="text-white">Bits Terms</strong>: Your use of Twitch Bits is governed by Twitch&apos;s Terms of Service and Bits Terms of Service</li>
              <li><strong className="text-white">Platform Dependency</strong>: This Extension requires Twitch&apos;s platform to function and may be affected by Twitch&apos;s service changes</li>
              <li><strong className="text-white">Data Sharing</strong>: Certain data is shared with Twitch as required for Extension functionality and compliance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">16. Age Verification and Compliance</h2>

            <WarningBox>
              <h3 className="text-lg font-medium text-red-300 mb-2 flex items-center">
                🔞 Age Restriction Notice
              </h3>
              <p className="text-red-100">
                You must be 18 years or older to use Bits-based prediction features. By using these features, you confirm you meet this age requirement.
              </p>
            </WarningBox>

            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Minimum Age</strong>: Users under 18 cannot participate in Bits-based predictions</li>
              <li><strong className="text-white">Age Verification</strong>: We may request age verification at any time</li>
              <li><strong className="text-white">Parental Responsibility</strong>: Parents are responsible for monitoring their children&apos;s use of Twitch and this Extension</li>
              <li><strong className="text-white">Legal Compliance</strong>: You must comply with all local laws regarding virtual currency transactions</li>
            </ul>
          </section>
        </div>

        <hr className="border-gray-700 my-12" />
        
        <div className="space-y-4 text-gray-400 text-sm">
          <p>
            <strong>Important Notice:</strong> This Extension is not sponsored, endorsed, or administered by Twitch Interactive, Inc. 
            Twitch, the Twitch logo, and Bits are trademarks or registered trademarks of Twitch Interactive, Inc. 
            For issues related to the Extension, contact us directly using the information above.
          </p>
          
          <p>
            <strong>Last Updated:</strong> August 15, 2025 | <strong>Version:</strong> 2.0
          </p>
        </div>
      </div>
    </div>
  )
}