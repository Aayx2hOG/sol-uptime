'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { getUptimeProgram, getUptimeProgramId } from '@project/anchor'
import { useCluster } from '../cluster/cluster-data-access'
import { Cluster } from '@solana/web3.js'

export enum AchievementType {
  Uptime99For30Days = 0,
  Uptime999For30Days = 1,
  Uptime9999For90Days = 2,
  Uptime100For7Days = 3,
  FirstMonitor = 4,
  HundredChecks = 5,
  ThousandChecks = 6,
}

export type AchievementMetadata = {
  title: string
  description: string
  icon: string
  color: string
}

export const ACHIEVEMENT_METADATA: Record<AchievementType, AchievementMetadata> = {
  [AchievementType.Uptime99For30Days]: {
    title: 'Reliable',
    description: '99% uptime for 30 days',
    icon: '🥉',
    color: 'from-orange-500 to-amber-500',
  },
  [AchievementType.Uptime999For30Days]: {
    title: 'Dependable',
    description: '99.9% uptime for 30 days',
    icon: '🥈',
    color: 'from-gray-400 to-gray-500',
  },
  [AchievementType.Uptime9999For90Days]: {
    title: 'Enterprise Grade',
    description: '99.99% uptime for 90 days',
    icon: '🥇',
    color: 'from-yellow-400 to-yellow-600',
  },
  [AchievementType.Uptime100For7Days]: {
    title: 'Perfect Week',
    description: '100% uptime for 7 days',
    icon: '💎',
    color: 'from-cyan-400 to-blue-500',
  },
  [AchievementType.FirstMonitor]: {
    title: 'Getting Started',
    description: 'Created first monitor',
    icon: '🚀',
    color: 'from-green-400 to-emerald-500',
  },
  [AchievementType.HundredChecks]: {
    title: 'Centurion',
    description: '100 total checks',
    icon: '💯',
    color: 'from-purple-400 to-purple-600',
  },
  [AchievementType.ThousandChecks]: {
    title: 'Veteran',
    description: '1,000 total checks',
    icon: '⭐',
    color: 'from-pink-400 to-rose-600',
  },
}

export function useAchievements(monitor: PublicKey) {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  const transactionToast = useTransactionToast()
  const queryClient = useQueryClient()

  const programId = useMemo(() => getUptimeProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getUptimeProgram(provider, programId), [provider, programId])

  // Fetch all achievements for a monitor
  const achievements = useQuery({
    queryKey: ['achievements', { cluster, monitor: monitor.toString() }],
    queryFn: async () => {
      const achievementAccounts = await Promise.all(
        Object.keys(ACHIEVEMENT_METADATA).map(async (typeKey) => {
          const achievementType = parseInt(typeKey) as AchievementType
          try {
            const [achievementPda] = PublicKey.findProgramAddressSync(
              [
                Buffer.from('achievement'),
                monitor.toBuffer(),
                Buffer.from([achievementType]),
              ],
              programId
            )

            const account = await (program.account as any).achievement.fetch(achievementPda)
            return {
              publicKey: achievementPda,
              account,
            }
          } catch (e) {
            return null
          }
        })
      )

      return achievementAccounts.filter((a) => a !== null)
    },
  })

  // Mint achievement NFT
  const mintAchievement = useMutation({
    mutationKey: ['mint-achievement', { cluster, monitor: monitor.toString() }],
    mutationFn: async ({
      achievementType,
      metadataUri,
    }: {
      achievementType: AchievementType
      metadataUri: string
    }) => {
      const [achievementPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('achievement'),
          monitor.toBuffer(),
          Buffer.from([achievementType]),
        ],
        programId
      )

      const tx = await (program.methods as any)
        .mintAchievementNft(
          { [Object.keys(AchievementType)[achievementType]]: {} } as any,
          metadataUri
        )
        .accounts({
          monitor,
          achievement: achievementPda,
        } as any)
        .rpc()

      return tx
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
    },
    onError: (error) => {
      console.error('Failed to mint achievement:', error)
    },
  })

  // Check eligibility for achievements
  const checkEligibility = useQuery({
    queryKey: ['achievement-eligibility', { cluster, monitor: monitor.toString() }],
    queryFn: async () => {
      const monitorAccount = await program.account.monitor.fetch(monitor)
      const currentTime = Math.floor(Date.now() / 1000)
      const daysActive = (currentTime - Number(monitorAccount.createdAt)) / 86400
      const uptimePercentage =
        Number(monitorAccount.totalPings) > 0
          ? (Number(monitorAccount.successCount) / Number(monitorAccount.totalPings)) * 100
          : 0

      const eligibility = Object.keys(ACHIEVEMENT_METADATA).map((typeKey) => {
        const achievementType = parseInt(typeKey) as AchievementType
        let isEligible = false

        switch (achievementType) {
          case AchievementType.Uptime99For30Days:
            isEligible = uptimePercentage >= 99.0 && daysActive >= 30
            break
          case AchievementType.Uptime999For30Days:
            isEligible = uptimePercentage >= 99.9 && daysActive >= 30
            break
          case AchievementType.Uptime9999For90Days:
            isEligible = uptimePercentage >= 99.99 && daysActive >= 90
            break
          case AchievementType.Uptime100For7Days:
            isEligible = uptimePercentage === 100.0 && daysActive >= 7
            break
          case AchievementType.FirstMonitor:
            isEligible = Number(monitorAccount.totalPings) >= 1
            break
          case AchievementType.HundredChecks:
            isEligible = Number(monitorAccount.totalPings) >= 100
            break
          case AchievementType.ThousandChecks:
            isEligible = Number(monitorAccount.totalPings) >= 1000
            break
        }

        return {
          type: achievementType,
          isEligible,
          metadata: ACHIEVEMENT_METADATA[achievementType],
        }
      })

      return eligibility
    },
  })

  return {
    achievements,
    mintAchievement,
    checkEligibility,
  }
}
