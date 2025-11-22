'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { AppHero } from '../app-hero'
import { useUptimeProgram, useCreateMonitor } from './uptime-data-access'
import { UptimeList } from './uptime-ui'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function UptimeFeature() {
  const { publicKey } = useWallet()
  const { programId, monitors } = useUptimeProgram()
  const createMonitor = useCreateMonitor()
  const [showCreate, setShowCreate] = useState(false)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [interval, setInterval] = useState('300')

  const isFormValid = label.length > 0 && url.length > 0 && parseInt(interval) > 0

  const handleCreate = () => {
    if (!publicKey || !isFormValid) return

    const seed = Date.now()
    createMonitor.mutateAsync({
      seed,
      interval: parseInt(interval),
      label,
      url,
      owner: publicKey,
    }).then(() => {
      setLabel('')
      setUrl('')
      setInterval('300')
      setShowCreate(false)
    })
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <AppHero
        title="Uptime Monitor"
        subtitle={
          <>
            Create and manage uptime monitors for your services on Solana.
            <br />
            <span className="text-xs">Program ID: {programId.toString()}</span>
          </>
        }
      />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {publicKey ? (
          <div className="space-y-8">
            {/* Create Monitor Section */}
            <div className="border border-gray-800 p-8 bg-[#111111]">
              {!showCreate ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-['var(--font-space-grotesk)'] text-2xl font-bold text-white">Your Monitors</h2>
                    <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600 mt-2">
                      {monitors.data?.length || 0} ACTIVE
                    </p>
                  </div>
                  <Button onClick={() => setShowCreate(true)} className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white px-5 py-2 text-sm font-['var(--font-inter)'] font-semibold transition-all duration-150">
                    New Monitor
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="font-['var(--font-space-grotesk)'] text-2xl font-bold text-white">Create New Monitor</h2>
                    <Button onClick={() => setShowCreate(false)} variant="ghost" className="text-gray-400 hover:text-white text-sm">
                      Cancel
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="label" className="font-['var(--font-inter)'] text-xs font-semibold text-gray-400 uppercase tracking-wide">Label</Label>
                      <Input
                        id="label"
                        placeholder="api.production"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        maxLength={64}
                        className="bg-[#0a0a0a] border border-gray-800 focus:border-[#0ea5e9] text-white px-4 py-2.5 text-sm font-['var(--font-inter)'] transition-colors duration-150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url" className="font-['var(--font-inter)'] text-xs font-semibold text-gray-400 uppercase tracking-wide">URL</Label>
                      <Input
                        id="url"
                        placeholder="https://api.example.com/health"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        maxLength={256}
                        className="bg-[#0a0a0a] border border-gray-800 focus:border-[#0ea5e9] text-white px-4 py-2.5 text-sm font-['var(--font-jetbrains-mono)'] transition-colors duration-150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interval" className="font-['var(--font-inter)'] text-xs font-semibold text-gray-400 uppercase tracking-wide">Check Interval (seconds)</Label>
                      <Input
                        id="interval"
                        type="number"
                        placeholder="300"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        min="60"
                        className="bg-[#0a0a0a] border border-gray-800 focus:border-[#0ea5e9] text-white px-4 py-2.5 text-sm font-['var(--font-jetbrains-mono)'] transition-colors duration-150"
                      />
                    </div>
                    <Button
                      onClick={handleCreate}
                      disabled={!isFormValid || createMonitor.isPending}
                      className="w-full mt-2 px-6 py-2.5 bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white text-sm font-['var(--font-inter)'] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                    >
                      {createMonitor.isPending ? 'Creating...' : 'Create Monitor'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Monitors List */}
            {monitors.isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-800 p-6 bg-[#111111] animate-pulse">
                    <div className="flex justify-between items-start gap-4 mb-5">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-800 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                      </div>
                      <div className="h-10 w-24 bg-gray-800 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-20 bg-gray-800/50 rounded"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : monitors.isError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading monitors. Please try again.</p>
              </div>
            ) : (
              <UptimeList monitors={monitors.data || []} />
            )}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600 mb-3">WALLET NOT CONNECTED</p>
            <p className="font-['var(--font-inter)'] text-sm text-gray-500 max-w-md mx-auto">Connect your wallet to create and manage monitors</p>
          </div>
        )}
      </div>
    </div>
  )
}
