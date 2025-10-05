// app/scores/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addscoreToTeam, getTeamById, updateScore } from "@/lib/api";
import type { TeamDetailResponse } from "@/types/types";

type ScorePayload = {
  impact: number;
  creativity: number;
  presentation: number;
  relevance: number;
  validity: number;
};
type ScoreKey = keyof ScorePayload;

const FIELDS: { key: ScoreKey; label: string }[] = [
  { key: "impact", label: "Impact" },
  { key: "creativity", label: "Creativity" },
  { key: "presentation", label: "Presentation" },
  { key: "relevance", label: "Relevance" },
  { key: "validity", label: "Validity" },
];

export default function ScorePage() {
  // ---- Routing / ids ----
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const teamId = useMemo(() => Number(params.id), [params.id]);

  // ---- Team fetch state ----
  const [teamData, setTeamData] = useState<TeamDetailResponse | null>(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (!params?.id) return; // guard until router has the param
    (async () => {
      try {
        setTeamLoading(true);
        setTeamError(null);
        const data = await getTeamById(String(teamId));
        setIsUpdate(!!(data.data?.scores && data.data.scores.length > 0));
        setTeamData(data);
      } catch (e: any) {
        // surface the real error if available
        setTeamError(e?.message ?? "Failed to fetch team data");
      } finally {
        setTeamLoading(false);
      }
    })();
  }, [params?.id, teamId]);

  // ---- Inputs (raw strings so user can type/clear freely) ----
  const [values, setValues] = useState<Record<ScoreKey, string>>({
    impact: "",
    creativity: "",
    presentation: "",
    relevance: "",
    validity: "",
  });
  const [errors, setErrors] = useState<Record<ScoreKey, string | null>>({
    impact: null,
    creativity: null,
    presentation: null,
    relevance: null,
    validity: null,
  });

  // ---- Submit state ----
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // ---- Validation helpers ----
  function parseNumber(s: string) {
    if (s.trim() === "") return { ok: false, value: NaN, reason: "Required" };
    const n = Number(s);
    if (!Number.isFinite(n)) return { ok: false, value: NaN, reason: "Invalid number" };
    if (n < 0 || n > 10) return { ok: false, value: n, reason: "Must be 0–10" };
    return { ok: true, value: n as number, reason: null as null };
  }

  async function submitBase(submitFn: () => Promise<any>) {
    setMsg(null);

    // Validate all fields at once
    const nextErrors: Record<ScoreKey, string | null> = {
      impact: null,
      creativity: null,
      presentation: null,
      relevance: null,
      validity: null,
    };
    const parsed: Partial<ScorePayload> = {};

    for (const { key } of FIELDS) {
      const r = parseNumber(values[key]);
      if (!r.ok) nextErrors[key] = r.reason!;
      else parsed[key] = r.value;
    }

    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;

    try {
      setSubmitting(true);
      const res = await submitFn();
      setMsg(typeof res === "string" ? res : "Saved");
    } catch (e: any) {
      setMsg(`Error: ${e?.message ?? "Failed to save"}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit() {
    await submitBase(() => addscoreToTeam(teamId, values as unknown as ScorePayload));
  }

  async function handleUpdate() {
    const scoreId = teamData?.data?.scores?.[0]?.id ?? 0;
    await submitBase(() => updateScore(scoreId, values as unknown as ScorePayload));
  }

  // ---- Derived from teamData ----
  const team = teamData?.data ?? null;
  const teamName = team?.name ?? `Team #${teamId || "—"}`;
  const challengeName = team?.challengeName ?? "—";

  return (
    <main
      className="
        grid min-h-[100svh] place-items-center px-4 sm:px-6 md:px-8
        bg-slate-950
        bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.12),transparent_60%)]
      "
    >
      <div className="w-full max-w-3xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-6 shadow-xl shadow-black/40 backdrop-blur">
        {/* Header: team name / id / challenge */}
        <div className="flex flex-col gap-3 sm:gap-2 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-100 truncate">
              Add score for <span className="text-white">{teamName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Challenge: <span className="text-slate-300">{challengeName}</span>
            </p>
          </div>
          <span className="text-xs sm:text-sm text-slate-400 md:shrink-0">Team ID: {teamId || "—"}</span>
        </div>

        {/* Team fetch states */}
        {teamLoading && (
          <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
            Loading team info…
          </div>
        )}
        {teamError && (
          <div className="rounded-lg border border-red-600 bg-red-900/30 px-3 py-2 text-sm text-red-200">
            {teamError}
          </div>
        )}

        {/* Members list */}
        {team && team.members?.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 sm:p-4">
            <div className="mb-2 text-sm font-medium text-slate-200">Team members</div>
            <div className="flex flex-wrap gap-2">
              {team.members.map((m) => (
                <span
                  key={m.id}
                  className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[11px] sm:text-xs ${
                    m.attended
                      ? "border-emerald-700 bg-emerald-900/20 text-emerald-200"
                      : "border-slate-700 bg-slate-800 text-slate-300"
                  }`}
                  title={`${m.fullName} • ${m.email} • ${m.phone}`}
                >
                  {m.fullName}
                  {m.attended ? (
                    <span className="rounded-full bg-emerald-700 px-1 text-[9px] sm:text-[10px]">✓</span>
                  ) : (
                    <span className="rounded-full bg-slate-600 px-1 text-[9px] sm:text-[10px]">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Responsive inputs */}
        <div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {FIELDS.map(({ key, label }) => (
              <div key={key} className="w-full">
                <label
                  htmlFor={`score-${key}`}
                  className="mb-1 block text-[11px] sm:text-xs font-medium text-slate-300"
                >
                  {label}
                </label>
                <input
                  id={`score-${key}`}
                  type="number"
                  min={0}
                  max={10}
                  step={1}
                  inputMode="numeric"
                  value={values[key]}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setValues((prev) => ({ ...prev, [key]: next }));
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm sm:text-base text-slate-100 outline-none
                    ${
                      errors[key]
                        ? "border-red-600 bg-red-900/20 focus:ring-2 focus:ring-red-600"
                        : "border-slate-700 bg-slate-900 focus:ring-2 focus:ring-slate-600"
                    }`}
                  placeholder="0–10"
                />
                {errors[key] && (
                  <div className="mt-1 text-[10px] sm:text-[11px] text-red-300">{errors[key]}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {msg && (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              msg.startsWith("Error")
                ? "border-red-600 bg-red-900/30 text-red-200"
                : "border-emerald-600 bg-emerald-900/30 text-emerald-200"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={isUpdate ? handleUpdate : handleSubmit}
            disabled={submitting || !teamId}
            className="inline-flex items-center rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-900 hover:bg-white disabled:opacity-60"
          >
            {submitting ? "Saving…" : isUpdate ? "Update score" : "Save score"}
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-900"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}