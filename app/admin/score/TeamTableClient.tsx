/* ---------------- Client: search + filtered rendering ------------------- */
"use client";

import { Team } from "@/types/types";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

function Th({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th
      className={`border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <td className={`border-b border-slate-800 px-4 py-3 align-middle text-slate-100 ${className}`}>
      {children}
    </td>
  );
}


export function TeamTableClient({ initialData }: { initialData: Team[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialData;
    return initialData.filter((t) => {
      const idMatch = String(t.id).includes(q);
      const nameMatch = t.name?.toLowerCase().includes(q);
      return idMatch || nameMatch;
    });
  }, [initialData, query]);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search by name or ID…"
            className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-600"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Showing <span className="text-slate-200">{filtered.length}</span> of{" "}
          <span className="text-slate-200">{initialData.length}</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="space-y-1">
            <div className="text-slate-100 font-medium">No matching teams</div>
            <p className="text-slate-400 text-sm">Try a different keyword.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: Card list */}
          <ul className="grid gap-3 md:hidden">
            {filtered.map((row) => (
              <Link
                href={`/admin/score/${row.id}`}
                key={row.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">ID</span>
                  <span className="text-slate-100">{String(row.id)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-medium text-slate-400">Name</span>
                  <div className="truncate text-slate-100 font-medium">{row.name}</div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Score</span>
                  <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-sm text-slate-100">
                    {row.score}
                  </span>
                </div>
              </Link>
            ))}
          </ul>

          {/* Desktop: Table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-[0.95rem] leading-6">
                <thead className="bg-slate-900">
                  <tr>
                    <Th />
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th className="text-right">Score</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="relative hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {/* Row overlay link */}
                      <Link
                        href={`/admin/score/${row.id}`}
                        className="absolute inset-0"
                        aria-label={`Open scores for ${row.name}`}
                        prefetch={false}
                      />
                      <Td>{String(row.id)}</Td>
                      <Td>
                        <span className="block max-w-[42rem] truncate">{row.name}</span>
                      </Td>
                      <Td className="text-right">
                        <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-slate-100">
                          {row.score}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}