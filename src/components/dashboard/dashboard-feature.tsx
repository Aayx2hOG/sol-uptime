import { AppHero } from '@/components/app-hero'
import Link from 'next/link'

const links: { label: string; href: string; external?: boolean }[] = [
  { label: 'Uptime Monitor', href: '/uptime' },
  { label: 'Account Explorer', href: '/account' },
  { label: 'Solana Docs', href: 'https://docs.solana.com/', external: true },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/', external: true },
  { label: 'Solana Cookbook', href: 'https://solana.com/developers/cookbook/', external: true },
]

const features = [
  {
    icon: '01',
    title: 'Monitor Services',
    description: 'Track uptime and failures in real time',
  },
  {
    icon: '02',
    title: 'On-chain Logs',
    description: 'Immutable blockchain data, always verifiable',
  },
  {
    icon: '03',
    title: 'Real-time Stats',
    description: 'Instant insights, zero noise',
  },
  {
    icon: '04',
    title: 'Decentralized',
    description: 'You own your monitoring forever',
  },
]

export function DashboardFeature() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AppHero 
        title="Uptime Tracker" 
        subtitle="On-chain monitoring for Solana infrastructure"
      >
        <Link 
          href="/uptime" 
          className="group relative inline-flex items-center justify-center px-8 py-3 bg-[#0ea5e9] text-white font-['var(--font-inter)'] text-sm font-semibold transition-all duration-150 hover:bg-[#0ea5e9]/90 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] cursor-pointer"
        >
          Start Monitoring
          <svg className="ml-2 w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </AppHero>
      
      {/* Horizontal Feature Panels */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-px">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group flex items-start gap-6 py-6 px-6 bg-[#111111] border-y border-gray-800/50 hover:bg-[#151515] transition-colors duration-150"
            >
              <span className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600 mt-1 font-bold">{feature.icon}</span>
              <div className="flex-1">
                <h3 className="font-['var(--font-space-grotesk)'] text-lg font-bold text-white mb-1">{feature.title}</h3>
                <p className="font-['var(--font-inter)'] text-sm text-gray-400 font-light">{feature.description}</p>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors duration-150 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="max-w-xl mx-auto text-center mt-16">
          <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600 mb-4 uppercase tracking-wider">Resources</p>
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={index}>
                {link.external ? (
                  <a
                    href={link.href}
                    className="font-['var(--font-inter)'] text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="font-['var(--font-inter)'] text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
