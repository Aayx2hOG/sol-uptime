'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useUptimeProgram, useUptimeProgramAccount } from '../uptime/uptime-data-access'
import { AchievementsFeature } from './achievements-feature'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

export function AchievementsPageFeature() {
  const { publicKey } = useWallet()
  const { monitors } = useUptimeProgram()

  const userMonitors = useMemo(() => {
    if (!publicKey || !monitors.data) return []
    return monitors.data.filter((monitor: any) => monitor.account.owner.equals(publicKey))
  }, [publicKey, monitors.data])

  if (!publicKey) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-['var(--font-jetbrains-mono)'] text-sm text-gray-500 uppercase tracking-wider">
            CONNECT WALLET
          </p>
          <p className="font-['var(--font-inter)'] text-sm text-gray-600 mt-2">
            Connect your wallet to view achievements
          </p>
        </div>
      </div>
    )
  }

  if (monitors.isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-['var(--font-jetbrains-mono)'] text-sm text-gray-500 uppercase tracking-wider animate-pulse">
            LOADING...
          </p>
        </div>
      </div>
    )
  }

  if (userMonitors.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-['var(--font-jetbrains-mono)'] text-sm text-gray-500 uppercase tracking-wider mb-2">
            NO MONITORS
          </p>
          <p className="font-['var(--font-inter)'] text-sm text-gray-600">
            Create a monitor to start earning achievements
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {userMonitors.map((monitor: any) => (
        <div key={monitor.publicKey.toString()}>
          <div className="mb-6 pb-4 border-b border-gray-800">
            <h2 className="font-['var(--font-space-grotesk)'] text-2xl font-bold text-white">
              {monitor.account.label}
            </h2>
            <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-500 mt-1">
              {monitor.publicKey.toString()}
            </p>
          </div>
          <AchievementsFeature monitor={monitor.publicKey} />
        </div>
      ))}
    </div>
  )
}
