import React from 'react'

export function AppHero({
  children,
  subtitle,
  title,
}: {
  children?: React.ReactNode
  subtitle?: React.ReactNode
  title?: React.ReactNode
}) {
  return (
    <div className="relative py-20 md:py-32 bg-[#0a0a0a] overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            {typeof title === 'string' ? (
              <h1 className="font-['var(--font-space-grotesk)'] text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                {title.split(' ').map((word, i) => (
                  <span key={i}>
                    {word === 'Uptime' ? <span className="relative inline-block">{word}<span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#0ea5e9]"></span></span> : word}{' '}
                  </span>
                ))}
              </h1>
            ) : (
              title
            )}
            
            {typeof subtitle === 'string' ? (
              <div className="space-y-4">
                <p className="font-['var(--font-inter)'] text-xl md:text-2xl text-gray-400 font-light leading-relaxed">{subtitle}</p>
                <p className="font-['var(--font-inter)'] text-base text-gray-500 leading-relaxed border-l-2 border-[#0ea5e9] pl-4">
                  Built for teams that take reliability seriously.
                </p>
              </div>
            ) : (
              subtitle
            )}
            
            {children && <div className="pt-4">{children}</div>}
          </div>
          
          {/* Right side - Dashboard Mockup */}
          <div className="relative">
            <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 shadow-2xl">
              {/* Mockup header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600">LIVE</span>
              </div>
              
              {/* Service status rows */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-['var(--font-inter)'] text-sm text-gray-300">https://lms.bennett.edu.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-['var(--font-jetbrains-mono)'] text-lg font-bold text-white">99.97%</span>
                    <span className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600">2m ago</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-['var(--font-inter)'] text-sm text-gray-300">https://faucet.solana.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-['var(--font-jetbrains-mono)'] text-lg font-bold text-white">100.0%</span>
                    <span className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600">1m ago</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="font-['var(--font-inter)'] text-sm text-gray-300">https://facebook.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-['var(--font-jetbrains-mono)'] text-lg font-bold text-white">98.12%</span>
                    <span className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600">5m ago</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-['var(--font-inter)'] text-sm text-gray-300">https://youtube.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-['var(--font-jetbrains-mono)'] text-lg font-bold text-red-400">92.45%</span>
                    <span className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600">30s ago</span>
                  </div>
                </div>
              </div>
              
              {/* Footer stats */}
              <div className="grid grid-cols-2 gap-120 mt-6 pt-6 border-t border-gray-800">
                <div>
                  <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600 mb-1">CHECKS</p>
                  <p className="font-['var(--font-jetbrains-mono)'] text-xl font-bold text-white">1,247</p>
                </div>
                <div>
                  <p className="font-['var(--font-jetbrains-mono)'] text-xs text-gray-600 mb-1">UPTIME</p>
                  <p className="font-['var(--font-jetbrains-mono)'] text-xl font-bold text-white">98.7%</p>
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-[#0ea5e9] opacity-10 blur-3xl rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
