import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body ?? {};
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid `url` in request body' });
    }

    const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 15000);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const headers: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        };

        const resp = await fetch(url, { method: 'GET', signal: controller.signal, headers });
        clearTimeout(id);

        const { debug } = req.body ?? {};
        if (debug) {
            let snippet = null as string | null;
            try {
                const text = await resp.text();
                snippet = text.slice(0, 2000);
            } catch (e) {
                snippet = `failed to read body: ${String(e)}`;
            }

            return res.status(200).json({ ok: resp.ok, status: resp.status, statusText: resp.statusText, redirected: resp.redirected, url: resp.url, snippet });
        }

        return res.status(200).json({ ok: resp.ok, status: resp.status, statusText: resp.statusText });
    } catch (err: any) {
        clearTimeout(id);
        if (err.name === 'AbortError') {
            return res.status(504).json({ ok: false, error: 'Request timed out' });
        }
        return res.status(500).json({ ok: false, error: String(err) });
    }
}
