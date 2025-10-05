import { getTeams } from "@/lib/api";
import type { Team } from "@/types/types";
import Link from "next/link";
// import router from "next/router";

export default async function TeamTable() {
  const data = (await getTeams()) as Team[];

  return (
    <div className="  border border-slate-800 bg-slate-950 p-4 md:p-6 shadow-lg shadow-black/30">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-100 tracking-tight">Teams</h3>
        <span className="text-xs text-slate-400">{data.length} total</span>
      </div>

      {data.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="space-y-2">
            <div className="text-slate-100 font-medium">No teams yet</div>
            <p className="text-slate-400 text-sm">When teams are created, they’ll show up here.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: Card list */}
          <ul className="grid gap-3 md:hidden">
            {data.map((row) => (
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
                    <Th></Th>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th className="text-right">Score</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr
                      key={row.id}
                      className="relative hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {/* Invisible overlay that covers the entire row */}
                      <Link
                        href={`score/${row.id}`}
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
    </div>
  );
}

/* presentational helpers */
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