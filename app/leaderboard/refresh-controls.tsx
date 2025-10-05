// app/leaderboard/refresh-controls.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshControls({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [auto, setAuto] = useState(false);
  const [intervalMs, setIntervalMs] = useState(5000);

  useEffect(() => {
    if (!auto) return;

    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [auto, intervalMs, router]);

  return (
    <div className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 ${className}`}>
      <button
        onClick={() => router.refresh()}
        className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/15"
      >
        Refresh now
      </button>

      <label className="flex items-center gap-2 text-xs text-white/70">
        <input
          type="checkbox"
          className="h-4 w-4 accent-white"
          checked={auto}
          onChange={(e) => setAuto(e.target.checked)}
        />
        Auto every
        <select
          className="rounded-md border border-white/10 bg-transparent px-1.5 py-1 text-white/80"
          value={intervalMs}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          disabled={!auto}
        >
          <option value={5000}>5s</option>
          <option value={15000}>15s</option>
          <option value={30000}>30s</option>
          <option value={60000}>1m</option>
          <option value={120000}>2m</option>
        </select>
      </label>
    </div>
  );
}