'use client'

import { PublicKey } from '@solana/web3.js'
import { AchievementCard } from './achievements-ui'
import { useAchievements } from './achievements-data-access'

export function AchievementsFeature({ monitor }: { monitor: PublicKey }) {
  const { achievements, checkEligibility, mintAchievement } = useAchievements(monitor)

  const earnedAchievements = achievements.data || []
  const eligibility = checkEligibility.data || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider mb-4 font-heading">
          ACHIEVEMENTS
        </h2>
        <p className="text-sm text-zinc-400 font-mono">
          Mint NFTs for reaching uptime milestones. Each achievement is stored on-chain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligibility.map((item) => {
          const earned = earnedAchievements.find(
            (a) => a.account.achievementType === item.type
          )

          return (
            <AchievementCard
              key={item.type}
              metadata={item.metadata}
              isEarned={!!earned}
              isEligible={item.isEligible}
              onMint={
                item.isEligible && !earned
                  ? () => {
                      mintAchievement.mutate({
                        achievementType: item.type,
                        metadataUri: `https://uptime-achievements.io/${item.type}`,
                      })
                    }
                  : undefined
              }
              isPending={mintAchievement.isPending}
            />
          )
        })}
      </div>
    </div>
  )
}
