'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { redirect } from 'next/navigation'

export default function AccountListFeature() {
  const { publicKey } = useWallet()

  if (publicKey) {
    return redirect(`/account/${publicKey.toString()}`)
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div>
          <p className="mb-4">Connect your wallet to view your account details</p>
          <p className="text-sm text-muted-foreground">Use the "Select Wallet" button in the header above.</p>
        </div>
      </div>
    </div>
  )
}
