'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useBasicProgram } from './basic-data-access'
import { BasicCreate, BasicProgram } from './basic-ui'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'

export default function BasicFeature() {
  const { publicKey } = useWallet()
  const { programId } = useBasicProgram()

  return publicKey ? (
    <div>
      <AppHero title="Basic" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <BasicCreate />
      </AppHero>
      <BasicProgram />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <div>
            <p className="mb-4">Connect your wallet to use the basic program</p>
            <p className="text-sm text-muted-foreground">Use the "Select Wallet" button in the header above.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
