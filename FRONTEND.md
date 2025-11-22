# Uptime Tracker - Frontend Documentation

## Overview
This is a decentralized uptime monitoring application built on Solana. It allows users to create, manage, and track uptime monitors for their services on-chain.

## Features

### 1. **Create Monitors**
- Add a label (max 64 characters)
- Specify URL to monitor (max 256 characters)
- Set check interval in seconds (minimum 60 seconds)
- All monitor data stored on-chain

### 2. **Monitor Dashboard**
- View all your monitors in a grid layout
- Real-time uptime percentage calculation
- Color-coded status indicators:
  - 🟢 Green: ≥99% uptime
  - 🟡 Yellow: 95-99% uptime
  - 🔴 Red: <95% uptime

### 3. **Track Statistics**
Each monitor displays:
- Total pings recorded
- Successful pings count
- Failed pings count
- Last ping timestamp
- Check interval
- Uptime percentage

### 4. **Monitor Actions**
- **Record Success**: Log a successful ping
- **Record Failure**: Log a failed ping
- **Edit**: Update label, URL, or interval
- **Withdraw Fees**: Claim excess rent from monitor account
- **Delete**: Close monitor and reclaim rent

### 5. **Wallet Integration**
- Connect Solana wallet to interact with monitors
- Only monitor owners can edit or delete their monitors
- Anyone can record pings (useful for decentralized monitoring)

## Pages

### Home Page (`/`)
- Welcome page with navigation links
- Quick access to uptime monitor and other features

### Uptime Page (`/uptime`)
- Main dashboard for creating and managing monitors
- Shows all monitors associated with connected wallet
- Create new monitors with a simple form

### Account Page (`/account`)
- Explore Solana accounts
- View account details and balances

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Blockchain**: Solana, Anchor Framework
- **Wallet**: Solana Wallet Adapter
- **State Management**: TanStack Query (React Query)
- **UI Components**: Shadcn/ui

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Anchor Program**
   ```bash
   cd anchor
   anchor build
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Connect Wallet**
   - Click "Select Wallet" in the header
   - Choose your Solana wallet (Phantom, Solflare, etc.)
   - Approve the connection

5. **Create Your First Monitor**
   - Navigate to `/uptime`
   - Click "Create Monitor"
   - Fill in the form and submit

## Program Details

- **Program ID**: `GxyaovA42Wp68kSdn7YCkGDXcpXzGVvGUfqb1V99LWER`
- **Network**: Devnet/Testnet
- **Language**: Rust (Anchor Framework)

## Monitor Data Structure

Each monitor account stores:
```rust
pub struct Monitor {
    pub owner: Pubkey,           // Monitor owner
    pub seed: u64,               // Unique seed
    pub bump: u8,                // PDA bump
    pub interval: i64,           // Check interval in seconds
    pub last_ping: i64,          // Last ping timestamp
    pub success_count: u64,      // Total successful pings
    pub failure_count: u64,      // Total failed pings
    pub total_pings: u64,        // Total pings recorded
    pub created_at: i64,         // Creation timestamp
    pub label: String,           // Monitor label (max 64 chars)
    pub url: String,             // URL to monitor (max 256 chars)
}
```

## Events

The program emits events for:
- `MonitorCreated`: When a new monitor is created
- `MonitorUpdated`: When a monitor is updated
- `PingRecorded`: When a ping is recorded
- `FeesWithdrawn`: When excess fees are withdrawn

## Use Cases

1. **API Monitoring**: Track uptime of your APIs and web services
2. **Node Monitoring**: Monitor blockchain nodes and validators
3. **Website Monitoring**: Track website availability
4. **Service Health**: Monitor any service with an HTTP endpoint
5. **Decentralized Monitoring**: Allow anyone to contribute ping data

## Future Enhancements

Potential improvements:
- Automated ping scheduling (off-chain keeper)
- Alert notifications
- Historical data visualization
- Response time tracking
- Multi-region monitoring
- Status page generation

## License

MIT
