use anchor_lang::prelude::*;

declare_id!("GxyaovA42Wp68kSdn7YCkGDXcpXzGVvGUfqb1V99LWER");

#[program]
pub mod uptime {

    use anchor_lang::solana_program::{system_instruction, program::invoke_signed};

    use super::*;

    pub fn create_monitor(ctx: Context<CreateMonitor>, seed: u64, interval: i64, label: String, url: String, created_at: i64) -> Result<()> {
        let monitor = &mut ctx.accounts.monitor;
        monitor.owner = *ctx.accounts.owner.key;
        monitor.seed = seed;
        monitor.bump = ctx.bumps.monitor;
        monitor.interval = interval;
        monitor.last_ping = 0;
        monitor.success_count = 0;
        monitor.failure_count = 0;
        monitor.total_pings = 0;
        monitor.created_at = created_at;
        monitor.label = label;
        monitor.url = url;

        emit!(MonitorCreated {
            owner: monitor.owner,
            label: monitor.label.clone(),
            url: monitor.url.clone(),
            interval,
            created_at
        });

        Ok(())
    }

    pub fn update_monitor(ctx: Context<UpdateMonitor>, new_label: Option<String>, new_url: Option<String>, new_interval: Option<i64>) -> Result<()> {
        let monitor = &mut ctx.accounts.monitor;

        if let Some(l) = new_label {
            require!(l.len() <= 64, UptimeError::LabelTooLong);
            monitor.label = l;
        }

        if let Some(u) = new_url {
            require!(u.len() <= 256, UptimeError::UrlTooLong);
            monitor.url = u;
        }

        if let Some(i) = new_interval {
            monitor.interval = i;
        }

        emit!(MonitorUpdated {
            owner: monitor.owner,
            label: monitor.label.clone(),
            url: monitor.url.clone(),
            interval: monitor.interval,
        });
        Ok(())
    }

    pub fn record_ping(ctx: Context<RecordPing>, success: bool, timestamp: i64) -> Result<()> {
        let monitor = &mut ctx.accounts.monitor;
        monitor.last_ping = timestamp;
        monitor.total_pings = monitor.total_pings.checked_add(1).ok_or(UptimeError::Overflow)?;
        if success {
            monitor.success_count = monitor.success_count.checked_add(1).ok_or(UptimeError::Overflow)?;
        } else {
            monitor.failure_count = monitor.failure_count.checked_add(1).ok_or(UptimeError::Overflow)?;
        }

        emit!(PingRecorded {
            owner: monitor.owner,
            label: monitor.label.clone(),
            url: monitor.url.clone(),
            success,
            timestamp,
            total_pings: monitor.total_pings,
        });
        
        Ok(())
    }

    pub fn delete_monitor(_ctx: Context<DeleteMonitor>) -> Result<()> {
        Ok(())
    }

    pub fn withdraw_fees(ctx: Context<WithdrawFees>) -> Result<()> {
        let monitor = &ctx.accounts.monitor;
        let monitor_acc = ctx.accounts.monitor.to_account_info();
        let owner_acc = ctx.accounts.owner.to_account_info();
        let system_program = ctx.accounts.system_program.to_account_info();
        
        let rent = Rent::get()?;
        let data_len = Monitor::INIT_SPACE;
        let rent_exempt = rent.minimum_balance(data_len);
        let avail = **monitor_acc.lamports.borrow();

        if avail <= rent_exempt {
            return Err(UptimeError::NoAvailableFunds.into());
        }

        let amount = avail - rent_exempt;
        let seed_bytes = monitor.seed.to_le_bytes();
        let seeds = &[b"monitor", monitor.owner.as_ref(), &seed_bytes, &[monitor.bump]];
        let ix = system_instruction::transfer(&*monitor_acc.key, &*owner_acc.key, amount);
        invoke_signed(&ix, &[monitor_acc, owner_acc, system_program], &[&seeds[..]])?;

        emit!(FeesWithdrawn {
            owner: monitor.owner,
            amount,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct CreateMonitor<'info> {
    #[account(
        init, 
        payer = owner, 
        seeds = [b"monitor", owner.key().as_ref(), &seed.to_le_bytes()],
        bump,
        space = Monitor::INIT_SPACE
    )]
    pub monitor: Account<'info, Monitor>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMonitor<'info> {
    #[account(
        mut,
        seeds = [b"monitor", monitor.owner.as_ref(), &monitor.seed.to_le_bytes()],
        bump = monitor.bump,
        has_one = owner
    )]
    pub monitor: Account<'info, Monitor>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteMonitor<'info>{
    #[account(
        mut,
        close = owner,
        seeds = [b"monitor", monitor.owner.as_ref(), &monitor.seed.to_le_bytes()],
        bump = monitor.bump,
        has_one = owner
    )]
    pub monitor : Account<'info, Monitor>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordPing<'info> {
    #[account(
        mut,
        seeds = [b"monitor", monitor.owner.as_ref(), &monitor.seed.to_le_bytes()],
        bump = monitor.bump,
    )]
    pub monitor: Account<'info, Monitor>,
    pub reporter: Signer<'info>,
}


#[derive(Accounts)]
pub struct WithdrawFees <'info> {
    #[account(
        mut,
        seeds = [b"monitor", monitor.owner.as_ref(), &monitor.seed.to_le_bytes()],
        bump = monitor.bump,
        has_one = owner
    )]
    pub monitor: Account<'info, Monitor>,
     #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Monitor {
    pub owner: Pubkey,
    pub seed: u64,
    pub bump: u8,
    pub interval: i64,
    pub last_ping: i64,
    pub success_count: u64,
    pub failure_count: u64,
    pub total_pings: u64,
    pub created_at: i64,
    #[max_len (64)]
    pub label: String,
    #[max_len (256)]
    pub url: String,
}


#[event]
pub struct MonitorCreated {
    pub owner: Pubkey,
    pub label: String,
    pub url: String,
    pub interval: i64,
    pub created_at: i64,
}

#[event]
pub struct MonitorUpdated {
    pub owner: Pubkey,
    pub label: String,
    pub url: String,
    pub interval: i64,
}

#[event]
pub struct PingRecorded {
    pub owner: Pubkey,
    pub label: String,
    pub url: String,
    pub success: bool,
    pub timestamp: i64,
    pub total_pings: u64,
}

#[event]
pub struct FeesWithdrawn {
    pub owner: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum UptimeError {
    #[msg("The provided label exceeds the maximum length of 64 characters.")]
    LabelTooLong,

    #[msg("The provided URL exceeds the maximum length of 256 characters.")]
    UrlTooLong,

    #[msg("An arithmetic overflow occurred.")]
    Overflow,

    #[msg("No available funds to withdraw after reserving rent-exempt balance.")]
    NoAvailableFunds,
}