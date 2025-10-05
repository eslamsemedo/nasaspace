// "use client";

// import React, { use, useEffect, useState } from "react";
// import { motion } from "framer-motion";
import { getTeams } from "@/lib/api";
import type { Team } from "@/types/types";
import RefreshControls from "./refresh-controls";
import RefreshToggle from "./refreshToggle";
// import { s } from "framer-motion/client";

// If you prefer this as a Server Component, remove "use client",
// delete framer-motion animations, and keep the same JSX/logic.
// This client version gives us nice entry animations.
export const revalidate = 0;
export const dynamic = "force-dynamic";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}
const STAR_COUNT = 90;
const STAR_SEED = 42;
const rand = rng(STAR_SEED);
const stars = Array.from({ length: STAR_COUNT }, () => ({
  top: rand() * 100,
  left: rand() * 100,
  opacity: rand() * 0.8 + 0.2,
}));

function placeSuffix(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

export default async function Page() {

  let sorted: { id: number; name: string; score: number; rank: number }[] = [];
  const teams = (await getTeams()) as Team[];
  sorted = [...teams]
    .sort((a, b) => b.score - a.score)
    .map((t, i) => ({ ...t, rank: i + 1 }));


  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* add the controls somewhere visible */}
      {/* Space gradient + stars background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-black to-[#0b0f1a]" />
        {/* subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,60,120,0.25)_0%,rgba(0,0,0,0.35)_40%,rgba(0,0,0,0.9)_100%)]" />
        {/* stars */}
        {stars.map((st, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/70"
            style={{
              top: `${st.top}%`,
              left: `${st.left}%`,
              opacity: st.opacity,
              filter: "drop-shadow(0 0 4px rgba(255,255,255,0.6))",
            }}
          />
        ))}
        {/* orbit ring */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 [box-shadow:0_0_80px_20px_rgba(80,120,255,0.08)_inset]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-6">


        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wider text-white/80 backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Mission Control • Live Leaderboard
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            NASA Space Apps Leaderboard
          </h1>
          <p className="mt-3 text-white/70">
            Real‑time rankings of teams pioneering the next frontier.
          </p>
        </div>

        {/* Table wrapper */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-12 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-wider text-white/60">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">Team</div>
            <div className="col-span-4 text-right">Score</div>
          </div>

          <ul role="list" className="divide-y divide-white/10">
            {sorted.map((t, idx) => (
              <li
                key={t.id}
                // initial={{ opacity: 0, y: 8 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ delay: idx * 0.035 }}
                className="grid grid-cols-12 items-center px-3 py-2 hover:bg-white/5 text-sm"
              >
                {/* Rank */}
                <div className="col-span-2 flex items-center gap-1.5 text-base font-semibold leading-tight">
                  <span className="tabular-nums text-white/90">
                    {placeSuffix(t.rank)}
                  </span>
                  <span className="text-lg">{medal(t.rank)}</span>
                </div>

                {/* Team name */}
                <div className="col-span-6">
                  <div className="flex items-center gap-2 leading-tight">
                    {/* <div
                      className="h-8 w-8 shrink-0 rounded-full border border-white/15 bg-gradient-to-br from-white/10 to-white/0 [box-shadow:0_0_20px_rgba(120,180,255,0.25)_inset]"
                      aria-hidden
                    /> */}
                    <div className="font-medium tracking-tight">{t.name}</div>
                  </div>
                </div>

                {/* Score + progress bar */}
                <div className="col-span-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="hidden w-40 sm:block">
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-white/80 shadow-[0_0_16px_rgba(255,255,255,0.6)]"
                          style={{
                            // width: `${(t.score / (sorted[0]?.score || 1)) * 100}%`,
                            width: `${(t.score / (50)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="min-w-[72px] rounded-full border border-white/10 bg-white/10 px-3 py-1 text-right font-semibold tabular-nums">
                      {t.score}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center justify-between text-xs text-white/50">

          <div>Updated just now • Scores auto‑refresh on page load</div>
          <div className="hidden sm:block">Powered by open space data</div>
        </div>
          <RefreshToggle className="mt-2"  />
      </div>
    </div>
  );
}
