// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import UptimeIDL from '../target/idl/uptime.json'
import type { Uptime } from '../target/types/uptime'

// Re-export the generated IDL and type
export { Uptime, UptimeIDL }

// The programId is imported from the program IDL.
export const UPTIME_PROGRAM_ID = new PublicKey(UptimeIDL.address)

// This is a helper function to get the Uptime Anchor program.
export function getUptimeProgram(provider: AnchorProvider, address?: PublicKey): Program<Uptime> {
  return new Program({ ...UptimeIDL, address: address ? address.toBase58() : UptimeIDL.address } as Uptime, provider)
}

// This is a helper function to get the program ID for the Uptime program depending on the cluster.
export function getUptimeProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Uptime program on devnet and testnet.
      return new PublicKey('GxyaovA42Wp68kSdn7YCkGDXcpXzGVvGUfqb1V99LWER')
    case 'mainnet-beta':
    default:
      return UPTIME_PROGRAM_ID
  }
}
