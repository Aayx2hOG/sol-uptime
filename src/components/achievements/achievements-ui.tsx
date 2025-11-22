'use client'

import { AchievementMetadata } from './achievements-data-access'

export function AchievementCard({
  metadata,
  isEarned,
  isEligible,
  onMint,
  isPending,
}: {
  metadata: AchievementMetadata
  isEarned: boolean
  isEligible: boolean
  onMint?: () => void
  isPending: boolean
}) {
  const borderColor = isEarned
    ? metadata.color
    : isEligible
    ? '#0ea5e9'
    : '#27272a'

  const bgOpacity = isEarned ? 'bg-opacity-10' : 'bg-opacity-5'

  return (
    <div
      className={`relative border bg-zinc-900 ${bgOpacity} p-6 transition-all duration-200`}
      style={{ borderColor }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {isEarned ? (
          <div className="px-2 py-1 bg-green-500/10 border border-green-500 text-green-500 text-xs font-mono uppercase tracking-wide">
            EARNED
          </div>
        ) : isEligible ? (
          <div className="px-2 py-1 bg-blue-500/10 border border-blue-500 text-blue-500 text-xs font-mono uppercase tracking-wide">
            READY
          </div>
        ) : (
          <div className="px-2 py-1 bg-zinc-800/50 border border-zinc-700 text-zinc-600 text-xs font-mono uppercase tracking-wide">
            LOCKED
          </div>
        )}
      </div>

      {/* Icon */}
      <div
        className={`text-5xl mb-4 ${
          !isEarned && !isEligible ? 'opacity-30 grayscale' : ''
        }`}
      >
        {metadata.icon}
      </div>

      {/* Title */}
      <h3
        className={`text-lg font-bold uppercase tracking-wider mb-2 font-heading ${
          !isEarned && !isEligible ? 'text-zinc-600' : ''
        }`}
      >
        {metadata.title}
      </h3>

      {/* Description */}
      <p
        className={`text-sm font-mono mb-4 ${
          !isEarned && !isEligible ? 'text-zinc-700' : 'text-zinc-400'
        }`}
      >
        {metadata.description}
      </p>

      {/* Mint Button */}
      {isEligible && !isEarned && onMint && (
        <button
          onClick={onMint}
          disabled={isPending}
          className="w-full px-4 py-2 bg-[#0ea5e9] text-white font-mono text-sm uppercase tracking-wide hover:bg-[#0ea5e9]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'MINTING...' : 'MINT NFT'}
        </button>
      )}

      {isEarned && (
        <div className="w-full px-4 py-2 border text-center text-sm font-mono uppercase tracking-wide"
          style={{ borderColor: metadata.color, color: metadata.color }}
        >
          MINTED ✓
        </div>
      )}
    </div>
  )
}

export function AchievementBadge({
  icon,
  title,
  color,
}: {
  icon: string
  title: string
  color: string
}) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 border bg-zinc-900/50"
      style={{ borderColor: color }}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-mono uppercase tracking-wide" style={{ color }}>
        {title}
      </span>
    </div>
  )
}
