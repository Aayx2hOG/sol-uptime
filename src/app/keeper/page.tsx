"use client";
import React, { useEffect, useState } from "react";

type Monitor = {
    id: string;
    label: string;
    url: string;
    lastChecked?: number; // unix seconds
    history: boolean[]; // most recent at end
};

const STORAGE_KEY = "keeper_monitors_v1";
const DEFAULT_INTERVAL_MS = 180000; // 3 minutes

function makeId() {
    return Math.random().toString(36).slice(2, 9);
}

async function pingUrl(url: string): Promise<boolean> {
    try {
        const res = await fetch("/api/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        return Boolean(data.ok);
    } catch (err) {
        return false;
    }
}

function uptimePercent(history: boolean[]) {
    if (history.length === 0) return 0;
    const sum = history.reduce((s, v) => s + (v ? 1 : 0), 0);
    return Math.round((sum / history.length) * 100);
}

export default function KeeperPage() {
    const [monitors, setMonitors] = useState<Monitor[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw) as Monitor[];
        } catch (e) { }
        // default demo monitors
        return [
            { id: makeId(), label: "https://youtube.com", url: "https://youtube.com", history: [true, true, true, true, true, true, true, true], lastChecked: undefined },
            { id: makeId(), label: "http://abcd", url: "http://abcd", history: [false, false, false, false, false, false, false, false], lastChecked: undefined },
        ];
    });

    const [showAdd, setShowAdd] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [intervalMs] = useState(() => Number(process.env.NEXT_PUBLIC_KEEPER_INTERVAL_MS || DEFAULT_INTERVAL_MS));

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(monitors));
    }, [monitors]);

    useEffect(() => {
        checkAll();
        const id = setInterval(checkAll, intervalMs);
        return () => clearInterval(id);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function checkAll() {
        const next = await Promise.all(
            monitors.map(async (m) => {
                const ok = await pingUrl(m.url);
                const h = [...m.history.slice(-29), ok];
                return { ...m, history: h, lastChecked: Math.floor(Date.now() / 1000) };
            })
        );
        setMonitors(next);
    }

    async function handleAdd(e?: React.FormEvent) {
        e?.preventDefault();
        if (!newUrl) return;
        const m: Monitor = { id: makeId(), label: newUrl, url: newUrl, history: [], lastChecked: undefined };
        setMonitors((s) => [m, ...s]);
        setNewUrl("");
        setShowAdd(false);
        // run immediate check for new monitor
        const ok = await pingUrl(m.url);
        setMonitors((s) => s.map((mm) => (mm.id === m.id ? { ...mm, history: [ok], lastChecked: Math.floor(Date.now() / 1000) } : mm)));
    }

    function renderTimeline(history: boolean[]) {
        const len = 10;
        const last = history.slice(-len);
        const padded = Array.from({ length: len - last.length }).map(() => undefined).concat(last as any);
        return (
            <div style={{ display: "flex", gap: 8 }}>
                {padded.map((s, i) => {
                    const key = i + (history.length || 0);
                    const style: React.CSSProperties = {
                        width: 36,
                        height: 10,
                        borderRadius: 4,
                        background: s === undefined ? "#2f3740" : s ? "#10b981" : "#ef4444",
                        opacity: s === undefined ? 0.4 : 1,
                    };
                    return <div key={key} style={style} />;
                })}
            </div>
        );
    }

    return (
        <main style={{ padding: 20, fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ margin: 0 }}>Uptime Monitor</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button onClick={() => setShowAdd(true)} style={{ background: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: 8, border: 'none' }}>
                        + Add Website
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
                {monitors.map((m) => {
                    const up = m.history.length ? m.history[m.history.length - 1] : undefined;
                    const statusDot: React.CSSProperties = {
                        width: 12,
                        height: 12,
                        borderRadius: 12,
                        background: up === undefined ? '#9ca3af' : up ? '#10b981' : '#ef4444',
                        boxShadow: '0 0 0 4px rgba(0,0,0,0.02) inset',
                        marginRight: 12,
                    };

                    return (
                        <div key={m.id} style={{ background: '#0f1724', color: '#e6eef8', padding: 18, borderRadius: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={statusDot} />
                                    <div>
                                        <div style={{ fontSize: 16 }}>{m.label}</div>
                                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{m.url}</div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 600 }}>{uptimePercent(m.history)}% uptime</div>
                                    <div style={{ fontSize: 12, color: '#9ca3af' }}>Last checked: {m.lastChecked ? new Date(m.lastChecked * 1000).toLocaleTimeString() : '—'}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 12, background: '#071026', padding: 12, borderRadius: 8 }}>
                                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Last 30 minutes status:</div>
                                {renderTimeline(m.history)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showAdd && (
                <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
                    <form onSubmit={handleAdd} style={{ background: '#071026', padding: 20, borderRadius: 12, width: 480 }}>
                        <h3 style={{ marginTop: 0 }}>Add Website</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com" style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: '#0b1220', color: 'white' }} />
                            <button type="submit" style={{ background: '#10b981', color: '#042617', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Add</button>
                        </div>
                        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'transparent', color: '#9ca3af', border: 'none' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}
