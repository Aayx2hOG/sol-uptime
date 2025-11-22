'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'
import { useUptimeProgramAccount } from './uptime-data-access'
import { useAchievements } from '../achievements/achievements-data-access'
import { AchievementBadge } from '../achievements/achievements-ui'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function UptimeCard({ account }: { account: PublicKey }) {
  const { monitor, updateMonitor, recordPing, deleteMonitor, withdrawFees } = useUptimeProgramAccount({
    account,
  })
  const { achievements, checkEligibility, mintAchievement } = useAchievements(account)
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [editInterval, setEditInterval] = useState('')

  const uptime = useMemo(() => {
    if (!monitor.data) return '100.00'
    const total = Number(monitor.data.totalPings)
    if (total === 0) return '100.00'
    const success = Number(monitor.data.successCount)
    return ((success / total) * 100).toFixed(2)
  }, [monitor.data])

  const lastPingTime = useMemo(() => {
    if (!monitor.data || Number(monitor.data.lastPing) === 0) return 'Never'
    const timestamp = Number(monitor.data.lastPing) * 1000
    return new Date(timestamp).toLocaleString()
  }, [monitor.data])

  const handleEdit = () => {
    if (monitor.data) {
      setEditLabel(monitor.data.label)
      setEditUrl(monitor.data.url)
      setEditInterval(monitor.data.interval.toString())
      setIsEditing(true)
    }
  }

  const handleUpdate = () => {
    updateMonitor.mutateAsync({
      label: editLabel !== monitor.data?.label ? editLabel : undefined,
      url: editUrl !== monitor.data?.url ? editUrl : undefined,
      interval: parseInt(editInterval) !== Number(monitor.data?.interval) ? parseInt(editInterval) : undefined,
    }).then(() => setIsEditing(false))
  }

  const handlePingSuccess = () => {
    recordPing.mutateAsync({
      success: true,
      timestamp: Math.floor(Date.now() / 1000),
    })
  }

  const handlePingFailure = () => {
    recordPing.mutateAsync({
      success: false,
      timestamp: Math.floor(Date.now() / 1000),
    })
  }

  if (monitor.isLoading) {
    return <div className="p-4 border rounded-lg">Loading...</div>
  }

  if (!monitor.data) {
    return <div className="p-4 border rounded-lg text-red-500">Monitor not found</div>
  }

  return (
    <div className="p-6 border border-gray-800 space-y-5 bg-[#111111] hover:border-gray-700 transition-colors duration-150">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor={`edit-label-${account.toString()}`} className="font-semibold">Label</Label>
            <Input
              id={`edit-label-${account.toString()}`}
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              maxLength={64}
              className="mt-1.5 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor={`edit-url-${account.toString()}`} className="font-semibold">URL</Label>
            <Input
              id={`edit-url-${account.toString()}`}
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              maxLength={256}
              className="mt-1.5 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor={`edit-interval-${account.toString()}`} className="font-semibold">Interval (seconds)</Label>
            <Input
              id={`edit-interval-${account.toString()}`}
              type="number"
              value={editInterval}
              onChange={(e) => setEditInterval(e.target.value)}
              min="60"
              className="mt-1.5 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleUpdate} disabled={updateMonitor.isPending} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg rounded-xl">
              {updateMonitor.isPending ? 'Updating...' : '💾 Save'}
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 border-2 rounded-xl">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-['var(--font-space-grotesk)'] text-lg font-bold text-white">{monitor.data.label}</h3>
                <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-500 break-all mt-1.5 line-clamp-2">{monitor.data.url}</p>
              </div>
              <div className={`px-3 py-1 text-xs font-['var(--font-jetbrains-mono)'] font-bold whitespace-nowrap ${
                parseFloat(uptime) >= 99 ? 'text-green-400' :
                parseFloat(uptime) >= 95 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {uptime}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#0a0a0a] border border-gray-800 p-4">
              <p className="font-['var(--font-jetbrains-mono)'] text-[10px] font-bold text-gray-600 uppercase tracking-wider">Interval</p>
              <p className="font-['var(--font-jetbrains-mono)'] text-xl font-bold text-white mt-1">{Number(monitor.data.interval)}s</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-4">
              <p className="font-['var(--font-jetbrains-mono)'] text-[10px] font-bold text-gray-600 uppercase tracking-wider">Checks</p>
              <p className="font-['var(--font-jetbrains-mono)'] text-xl font-bold text-white mt-1">{Number(monitor.data.totalPings)}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-4">
              <p className="font-['var(--font-jetbrains-mono)'] text-[10px] font-bold text-gray-600 uppercase tracking-wider">Success</p>
              <p className="font-['var(--font-jetbrains-mono)'] text-xl font-bold text-green-400 mt-1">
                {Number(monitor.data.successCount)}
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-4">
              <p className="font-['var(--font-jetbrains-mono)'] text-[10px] font-bold text-gray-600 uppercase tracking-wider">Failures</p>
              <p className="font-['var(--font-jetbrains-mono)'] text-xl font-bold text-red-400 mt-1">
                {Number(monitor.data.failureCount)}
              </p>
            </div>
          </div>

          <div className="text-sm pt-2 border-t border-gray-800">
            <p className="font-['var(--font-jetbrains-mono)'] text-[10px] font-bold text-gray-600 uppercase tracking-wider">Last Ping</p>
            <p className="font-['var(--font-inter)'] text-sm text-gray-400 mt-1">{lastPingTime}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-['var(--font-jetbrains-mono)'] text-gray-600">
            <div className="px-2 py-1 bg-[#0a0a0a] border border-gray-800">
              {account.toString().slice(0, 8)}...{account.toString().slice(-8)}
            </div>
            <div className="px-2 py-1 bg-[#0a0a0a] border border-gray-800">
              {monitor.data.owner.toString().slice(0, 8)}...{monitor.data.owner.toString().slice(-8)}
            </div>
          </div>

          {/* Achievements Section */}
          {achievements.data && achievements.data.length > 0 && (
            <div className="pt-2 border-t border-gray-800">
              <p className="font-['var(--font-jetbrains-mono)'] text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-3">
                Achievements
              </p>
              <div className="flex flex-wrap gap-2">
                {achievements.data.map((achievement) => {
                  const metadata = checkEligibility.data?.find(
                    (e) => e.type === achievement.account.achievementType
                  )?.metadata
                  if (!metadata) return null
                  return (
                    <AchievementBadge
                      key={achievement.publicKey.toString()}
                      icon={metadata.icon}
                      title={metadata.title}
                      color={metadata.color}
                    />
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePingSuccess} disabled={recordPing.isPending} className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg rounded-xl transition-all duration-200">
              ✓ Success
            </Button>
            <Button onClick={handlePingFailure} disabled={recordPing.isPending} variant="destructive" className="shadow-md hover:shadow-lg rounded-xl transition-all duration-200">
              ✗ Failure
            </Button>
            <Button onClick={handleEdit} variant="outline" className="border-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
              ✏️ Edit
            </Button>
            <Button
              onClick={() => withdrawFees.mutateAsync()}
              disabled={withdrawFees.isPending}
              variant="outline"
              className="border-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {withdrawFees.isPending ? 'Withdrawing...' : '💰 Withdraw'}
            </Button>
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to delete this monitor?')) {
                  deleteMonitor.mutateAsync()
                }
              }}
              disabled={deleteMonitor.isPending}
              variant="destructive"
              className="shadow-md hover:shadow-lg rounded-xl transition-all duration-200"
            >
              {deleteMonitor.isPending ? 'Deleting...' : '🗑️ Delete'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export function UptimeList({ monitors }: { monitors: { publicKey: PublicKey; account: any }[] }) {
  if (monitors.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600 mb-2">NO MONITORS</p>
        <p className="font-['var(--font-inter)'] text-sm text-gray-500">Create your first monitor to start tracking</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
      {monitors.map((monitor) => (
        <UptimeCard key={monitor.publicKey.toString()} account={monitor.publicKey} />
      ))}
    </div>
  )
}
