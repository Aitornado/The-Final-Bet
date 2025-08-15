import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | The Final Bet',
  description: 'Privacy Policy for The Final Bet Twitch Extension - Learn how we protect your data and handle Bits transactions.',
}

const PrivacyHighlight = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-800 border-l-4 border-bet-red-500 p-6 rounded-r-lg my-6">
    {children}
  </div>
)

const DataProtectionBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-950 border border-gray-700 p-6 rounded-lg my-6">
    {children}
  </div>
)

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-bet-red-500 border-b-2 border-bet-red-500 pb-4 mb-8">
          The Final Bet - Privacy Policy
        </h1>
        
        <p className="text-sm text-gray-400 italic mb-8">
          <strong>Last Updated: August 15, 2025</strong>
        </p>

        <p className="text-gray-300 mb-8">
          Aitorzilla (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates The Final Bet Twitch Extension (&quot;Extension&quot;). 
          This Privacy Policy explains how we collect, use, and protect your information when you use our Extension.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">Automatically Collected Information:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Twitch User ID</strong>: Your unique Twitch identifier (provided by Twitch)</li>
              <li><strong className="text-white">Prediction Data</strong>: Your prediction choices, amounts wagered, and outcomes</li>
              <li><strong className="text-white">Bits Transaction Data</strong>: Transaction IDs, amounts, timestamps, and outcomes of Bits-based predictions</li>
              <li><strong className="text-white">Usage Data</strong>: How you interact with the Extension (clicks, time spent, features used)</li>
              <li><strong className="text-white">Technical Data</strong>: Browser type, device information, IP address, timestamps</li>
              <li><strong className="text-white">Session Data</strong>: Login times, session duration, Extension preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">Information You Provide:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Extension Preferences</strong>: Settings and configurations you choose</li>
              <li><strong className="text-white">Support Communications</strong>: Messages you send to our customer support</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">Information We Do NOT Collect:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li>Personal contact information (email, phone, address) - except when voluntarily provided for support</li>
              <li>Financial information beyond Bits transactions through Twitch</li>
              <li>Credit card or payment information (handled exclusively by Twitch)</li>
              <li>Browsing activity outside the Extension</li>
              <li>Personal messages or chat content from Twitch</li>
              <li>Voice or video data from streams</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">2. How We Use Your Information</h2>

            <PrivacyHighlight>
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                🔒 Bits Transaction Data Usage
              </h3>
              <p className="text-gray-300">
                Your Bits transaction data is used exclusively for Extension functionality, fraud prevention, 
                and compliance with Twitch policies. We never share this data with third parties for marketing purposes.
              </p>
            </PrivacyHighlight>

            <p className="text-gray-300 mb-4">We use collected information to:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Operate the Extension</strong>: Process predictions, calculate payouts, maintain leaderboards</li>
              <li><strong className="text-white">Transaction Processing</strong>: Validate Bits transactions, prevent fraud, and resolve disputes</li>
              <li><strong className="text-white">Automated Decision Making</strong>: Use algorithms to determine prediction outcomes and calculate payouts</li>
              <li><strong className="text-white">Improve User Experience</strong>: Personalize features and optimize performance</li>
              <li><strong className="text-white">Provide Support</strong>: Respond to your questions and resolve issues</li>
              <li><strong className="text-white">Analytics</strong>: Understand usage patterns to improve the Extension (aggregated data only)</li>
              <li><strong className="text-white">Compliance</strong>: Meet legal obligations, enforce our terms, and comply with Twitch policies</li>
              <li><strong className="text-white">Security</strong>: Detect and prevent fraudulent activity, abuse, and policy violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">3. Information Sharing</h2>

            <p className="text-gray-300 mb-4">We do NOT sell, rent, or share your personal information with third parties, except:</p>

            <h3 className="text-xl font-medium text-white mb-3">With Twitch:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li>As required by Twitch&apos;s Developer Agreement</li>
              <li>For Bits transactions and user authentication</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">Service Providers:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li>Trusted third parties who help operate the Extension (hosting, analytics)</li>
              <li>These providers are bound by confidentiality agreements</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">Legal Requirements:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li>When required by law, court order, or government request</li>
              <li>To protect our rights or prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">4. Data Storage and Security</h2>

            <DataProtectionBox>
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                🔐 Enhanced Security for Financial Data
              </h3>
              <p className="text-gray-300">
                Bits transaction data is stored with additional security measures including encryption at rest, 
                access logging, and regular security audits.
              </p>
            </DataProtectionBox>

            <ul className="list-disc ml-6 space-y-3 text-gray-300">
              <li><strong className="text-white">Storage Location</strong>: Data is stored on secure servers in the United States with industry-standard encryption</li>
              <li><strong className="text-white">Encryption</strong>: All sensitive data is encrypted both in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong className="text-white">Access Controls</strong>: Strict access controls limit data access to authorized personnel only</li>
              <li><strong className="text-white">Retention Periods</strong>:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Prediction data: Retained while your account is active, plus up to 3 years for compliance</li>
                  <li>Bits transaction data: Retained for 7 years as required by financial regulations</li>
                  <li>Usage analytics: Aggregated data retained indefinitely, personal identifiers removed after 12 months</li>
                  <li>Support communications: Retained for 2 years</li>
                </ul>
              </li>
              <li><strong className="text-white">Security Measures</strong>: Regular security audits, penetration testing, and compliance monitoring</li>
              <li><strong className="text-white">Breach Notification</strong>: We will notify users within 72 hours of discovering any data breach affecting personal information</li>
              <li><strong className="text-white">Data Backup</strong>: Regular encrypted backups with geographic redundancy for disaster recovery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">5. Your Rights and Choices</h2>

            <p className="text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Access</strong>: Request information about data we have collected about you</li>
              <li><strong className="text-white">Deletion</strong>: Request deletion of your personal data (subject to legal requirements)</li>
              <li><strong className="text-white">Correction</strong>: Request correction of inaccurate information</li>
              <li><strong className="text-white">Opt-out</strong>: Disable the Extension to stop data collection</li>
              <li><strong className="text-white">Portability</strong>: Request your data in a portable format (where applicable)</li>
            </ul>

            <p className="text-gray-300 mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:aitorzilla@gmail.com" className="text-bet-red-500 hover:text-bet-red-600 hover:underline">
                aitorzilla@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">6. Legal Basis for Processing (EU/UK Users)</h2>

            <p className="text-gray-300 mb-4">If you are in the European Union or United Kingdom, our legal basis for processing your personal data includes:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Legitimate Interest</strong>: Operating and improving the Extension, fraud prevention, security</li>
              <li><strong className="text-white">Contract Performance</strong>: Providing the services you&apos;ve requested under our EULA</li>
              <li><strong className="text-white">Consent</strong>: Where you have provided explicit consent for specific processing activities</li>
              <li><strong className="text-white">Legal Obligation</strong>: Complying with applicable laws, financial regulations, and Twitch policies</li>
              <li><strong className="text-white">Vital Interests</strong>: Protecting users from fraud or abuse</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">Cross-Border Data Transfers</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Adequacy Decisions</strong>: We transfer data to countries with adequate protection under EU/UK law</li>
              <li><strong className="text-white">Standard Contractual Clauses</strong>: For other transfers, we use EU-approved Standard Contractual Clauses</li>
              <li><strong className="text-white">Safeguards</strong>: Additional technical and organizational measures protect data during transfer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">7. California Privacy Rights (CCPA)</h2>

            <p className="text-gray-300 mb-4">If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Right to Know</strong>: Request information about personal data we collect, use, or disclose</li>
              <li><strong className="text-white">Right to Delete</strong>: Request deletion of your personal data (subject to legal exceptions)</li>
              <li><strong className="text-white">Right to Non-Discrimination</strong>: We will not discriminate against you for exercising your rights</li>
              <li><strong className="text-white">Do Not Sell</strong>: We do not sell personal information as defined by CCPA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bet-red-500 mb-4">8. Contact Information</h2>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">For questions about this Privacy Policy or our data practices, contact us at:</p>
              <p className="text-white">
                <strong>Aitorzilla</strong><br/>
                Email:{' '}
                <a href="mailto:aitorzilla@gmail.com" className="text-bet-red-500 hover:text-bet-red-600 hover:underline">
                  aitorzilla@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>

        <hr className="border-gray-700 my-12" />
        
        <div className="space-y-4 text-gray-400 text-sm">
          <p>
            <strong>Twitch Integration Notice:</strong> This Extension integrates with Twitch&apos;s platform. 
            Your use of Twitch is governed by Twitch&apos;s own Terms of Service and Privacy Policy, which you can find at{' '}
            <a href="https://www.twitch.tv/p/legal/terms-of-service/" className="text-bet-red-500 hover:underline">
              twitch.tv
            </a>. Bits transactions are processed by Twitch according to their Bits Terms of Service.
          </p>
          
          <p>
            <strong>Extension Version:</strong> 2.0 | <strong>Privacy Policy Version:</strong> 2.0
          </p>
        </div>
      </div>
    </div>
  )
}