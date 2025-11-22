import fs from 'fs';
import path from 'path';
import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey, Connection } from '@solana/web3.js';

const RPC = process.env.ANCHOR_PROVIDER_URL || 'https://api.devnet.solana.com';
const WALLET_PATH = process.env.WALLET_KEYPAIR || path.resolve(__dirname, '../target/deploy/uptime-keypair.json');
const IDL_PATH = process.env.IDL_PATH || path.resolve(__dirname, '../target/idl/uptime.json');
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || '180000', 10); // 3 minutes
const REQUEST_TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS || '10000', 10); // 10s

function loadKeypair(filePath: string): Keypair {
    const raw = fs.readFileSync(filePath, 'utf8');
    const arr = JSON.parse(raw) as number[];
    return Keypair.fromSecretKey(Uint8Array.from(arr));
}

async function pingUrl(url: string, timeoutMs = REQUEST_TIMEOUT_MS): Promise<boolean> {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, { method: 'GET', signal: controller.signal });
        clearTimeout(id);
        return res.ok;
    } catch (err) {
        return false;
    }
}

async function main() {
    console.log('Keeper starting');
    console.log('RPC:', RPC);
    console.log('Wallet:', WALLET_PATH);
    console.log('IDL:', IDL_PATH);
    console.log(`Interval: ${INTERVAL_MS}ms`);

    const walletKeypair = loadKeypair(WALLET_PATH);
    const connection = new Connection(RPC, 'confirmed');
    const wallet = new anchor.Wallet(walletKeypair);
    const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

    const idlRaw = fs.readFileSync(IDL_PATH, 'utf8');
    const idl = JSON.parse(idlRaw);
    const programId = new PublicKey(process.env.PROGRAM_ID || idl.metadata?.address || idl?.name && idl?.metadata?.address || idl?.program?.address || idl?.address || idl?.programId || idl?.id);
    // Some IDLs include the address in different spots. If parsing fails, set PROGRAM_ID explicitly.
    const program = new anchor.Program(idl, programId, provider) as unknown as anchor.Program;

    async function runOnce() {
        console.log(new Date().toISOString(), '- scanning monitors...');
        let monitors: Array<{ publicKey: PublicKey; account: any }> = [];
        try {
            monitors = await (program.account as any).monitor.all();
        } catch (err) {
            console.error('Failed to fetch monitors via Anchor:', err);
        }

        console.log(`Found ${monitors.length} monitors`);

        for (const m of monitors) {
            const url: string = m.account.url;
            const monitorPubkey: PublicKey = m.publicKey;
            const owner: PublicKey = m.account.owner;
            const label = m.account.label || '';

            const ts = Math.floor(Date.now() / 1000);
            const success = await pingUrl(url);
            console.log(new Date().toISOString(), 'ping', label || monitorPubkey.toBase58(), url, '->', success ? 'UP' : 'DOWN');

            try {
                if ((program.methods as any) && (program.methods as any).record_ping) {
                    await (program.methods as any).record_ping(success, ts)
                        .accounts({ monitor: monitorPubkey, reporter: wallet.publicKey })
                        .rpc();
                } else if ((program.rpc as any) && (program.rpc as any).record_ping) {
                    // Older Anchor style: program.rpc.record_ping(...)
                    await (program.rpc as any).record_ping(success, ts, {
                        accounts: { monitor: monitorPubkey, reporter: wallet.publicKey },
                    });
                } else {
                    console.warn('Unable to call record_ping: unsupported Program object shape. Update keeper to match your Anchor version.');
                }
            } catch (err: any) {
                console.error('Failed to send record_ping tx for', monitorPubkey.toBase58(), err?.message || err);
            }
        }
    }

    await runOnce();
    setInterval(runOnce, INTERVAL_MS);
}

main().catch((err) => {
    console.error('Keeper fatal error', err);
    process.exit(1);
});
