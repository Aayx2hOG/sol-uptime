'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { WalletMenu } from '@/components/wallet-menu'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 px-6 py-4 bg-[#0a0a0a] border-b border-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link className="font-['var(--font-space-grotesk)'] text-lg font-bold text-white hover:text-gray-300 transition-colors duration-150" href="/">
          <span className="relative">
            Uptime<span className="text-[#0ea5e9]">.</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center">
          <ul className="flex gap-8 flex-nowrap items-center">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={`font-['var(--font-inter)'] px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive(path)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          <div className="hidden md:flex items-center gap-4">
            <WalletMenu />
            <ClusterUiSelect />
            <ThemeSelect />
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`hover:text-neutral-500 dark:hover:text-white block text-lg py-2  ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''} `}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <WalletMenu />
                <ClusterUiSelect />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
