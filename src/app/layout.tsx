import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Final Bet - Twitch Extension',
  description: 'Turn every gaming moment into interactive predictions. Engage your viewers with real-time betting using Twitch Bits.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js" async></script>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}