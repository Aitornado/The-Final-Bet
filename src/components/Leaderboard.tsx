'use client'

import { LeaderboardEntry } from '@/types/twitch'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  // Show placeholder data if no entries
  const displayEntries = entries.length > 0 ? entries : [
    { rank: 1, username: 'Loading...', points: 0, wins: 0 }
  ]

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h5 className="font-medium mb-3">Top Predictors</h5>
      <div className="space-y-2">
        {displayEntries.map((entry) => (
          <div key={entry.rank} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-yellow-400">#{entry.rank}</span>
              <span className="text-sm">{entry.username}</span>
            </div>
            <div className="text-sm text-gray-300">{entry.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  )
}