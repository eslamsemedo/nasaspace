// "use client";
// app/admin/home/TeamTable.tsx (or wherever this file lives)
import { getTeams } from "@/lib/api";
import type { Team } from "@/types/types";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { TeamTableClient } from "./TeamTableClient";

// --- Server component: fetch data, then render client table with search ---
export default async function TeamTable() {
  const data = (await getTeams()) as Team[];

  return (
    <main className="bg-slate-950 min-h-screen">

      <div className="border border-slate-800 bg-slate-950 p-4 md:p-6 shadow-lg shadow-black/30 rounded-xl">
        <Header total={data.length} />
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <TeamTableClient initialData={data} />
        )}
      </div>
    </main>
  );
}

function Header({ total }: { total: number }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <Link href="/admin/home" className="inline-flex items-center gap-2 text-white">
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>
      <h3 className="text-lg font-semibold text-slate-100 tracking-tight">Teams</h3>
      <span className="text-xs text-slate-400">{total} total</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
      <div className="space-y-2">
        <div className="text-slate-100 font-medium">No teams yet</div>
        <p className="text-slate-400 text-sm">When teams are created, they’ll show up here.</p>
      </div>
    </div>
  );
}

/* presentational helpers */

