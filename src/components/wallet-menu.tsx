'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from './solana/solana-provider'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export function WalletMenu() {
  const { publicKey, disconnect } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!publicKey) {
    return <WalletButton />
  }

  const address = publicKey.toString()
  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="wallet-adapter-button wallet-adapter-button-trigger"
      >
        <i className="wallet-adapter-button-start-icon"></i>
        {shortAddress}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Wallet Address</p>
            <p className="text-sm font-mono break-all">{address}</p>
          </div>
          <div className="p-2">
            <Link
              href={`/account/${address}`}
              className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              View Account Details
            </Link>
            <button
              onClick={() => {
                disconnect()
                setIsOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
