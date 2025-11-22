'use client'

import { getUptimeProgram, getUptimeProgramId } from '@project/anchor'
import { Program, BN } from '@coral-xyz/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'

export function useUptimeProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getUptimeProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getUptimeProgram(provider, programId), [provider, programId])

  const monitors = useQuery({
    queryKey: ['uptime', 'all', { cluster }],
    queryFn: () => program.account.monitor.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  return {
    program,
    programId,
    monitors,
    getProgramAccount,
  }
}

export function useUptimeProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, monitors } = useUptimeProgram()
  const queryClient = useQueryClient()

  const monitor = useQuery({
    queryKey: ['uptime', 'fetch', { cluster, account }],
    queryFn: () => program.account.monitor.fetch(account),
  })

  const updateMonitor = useMutation({
    mutationKey: ['uptime', 'update', { cluster, account }],
    mutationFn: async ({
      label,
      url,
      interval,
    }: {
      label?: string
      url?: string
      interval?: number
    }) => {
      return program.methods
        .updateMonitor(label ?? null, url ?? null, interval ? new BN(interval) : null)
        .accounts({ monitor: account })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['uptime', 'fetch', { cluster, account }],
        }),
        queryClient.invalidateQueries({
          queryKey: ['uptime', 'all', { cluster }],
        }),
      ])
    },
    onError: (error) => {
      console.error('Failed to update monitor:', error)
    },
  })

  const recordPing = useMutation({
    mutationKey: ['uptime', 'recordPing', { cluster, account }],
    mutationFn: async ({ success, timestamp }: { success: boolean; timestamp: number }) => {
      return program.methods
        .recordPing(success, new BN(timestamp))
        .accounts({ monitor: account })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['uptime', 'fetch', { cluster, account }],
        }),
        queryClient.invalidateQueries({
          queryKey: ['uptime', 'all', { cluster }],
        }),
      ])
    },
    onError: (error) => {
      console.error('Failed to record ping:', error)
    },
  })

  const deleteMonitor = useMutation({
    mutationKey: ['uptime', 'delete', { cluster, account }],
    mutationFn: async () => {
      return program.methods.deleteMonitor().accounts({ monitor: account }).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return queryClient.invalidateQueries({
        queryKey: ['uptime', 'all', { cluster }],
      })
    },
    onError: (error) => {
      console.error('Failed to delete monitor:', error)
    },
  })

  const withdrawFees = useMutation({
    mutationKey: ['uptime', 'withdrawFees', { cluster, account }],
    mutationFn: async () => {
      return program.methods.withdrawFees().accounts({ monitor: account }).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return queryClient.invalidateQueries({
        queryKey: ['uptime', 'fetch', { cluster, account }],
      })
    },
    onError: (error) => {
      console.error('Failed to withdraw fees:', error)
    },
  })

  return {
    monitor,
    updateMonitor,
    recordPing,
    deleteMonitor,
    withdrawFees,
  }
}

export function useCreateMonitor() {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program } = useUptimeProgram()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['uptime', 'create', { cluster }],
    mutationFn: async ({
      seed,
      interval,
      label,
      url,
      owner,
    }: {
      seed: number
      interval: number
      label: string
      url: string
      owner: PublicKey
    }) => {
      const [monitorPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('monitor'), owner.toBuffer(), Buffer.from(new Uint8Array(new BigUint64Array([BigInt(seed)]).buffer))],
        program.programId
      )

      const createdAt = new BN(Math.floor(Date.now() / 1000))
      
      return program.methods
        .createMonitor(new BN(seed), new BN(interval), label, url, createdAt)
        .accounts({
          monitor: monitorPda,
          owner,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return queryClient.invalidateQueries({
        queryKey: ['uptime', 'all', { cluster }],
      })
    },
    onError: (error) => {
      console.error('Failed to create monitor:', error)
    },
  })
}
