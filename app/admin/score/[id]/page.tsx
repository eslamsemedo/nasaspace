// app/scores/[id]/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { addscoreToTeam, getTeamById } from "@/lib/api";
import { TeamDetailResponse } from "@/types/types";

type ScorePayload = {
  impact: number;
  creativity: number;
  presentation: number;
  relevance: number;
  validity: number;
};

export default function ScorePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const teamId = useMemo(() => Number(params.id), [params.id]);

  const [teamData, setTeamData] = useState<TeamDetailResponse | null>(null);
  const [payload, setPayload] = useState<ScorePayload>({
    impact: 0,
    creativity: 0,
    presentation: 0,
    relevance: 0,
    validity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [teamLoading, setTeamLoading] = useState(true); // NEW
  const [teamError, setTeamError] = useState<string | null>(null); // NEW

  useEffect(() => {
    (async () => {
      try {
        setTeamLoading(true);
        setTeamError(null);
        const data = await getTeamById(String(teamId));
        setTeamData(data);
        console.log("Fetching data for team ID:", teamId);
      } catch (e: any) {
        console.error("Failed to fetch team data:", e);
        setTeamError(e?.message ?? "Failed to fetch team data");
      } finally {
        setTeamLoading(false);
      }
    })();
  }, [teamId]);

  // ----- Derived UI bits from teamData -----
  const team = teamData?.data ?? null;
  const teamName = team?.name ?? `Team #${teamId}`;
  const challengeName = team?.challengeName ?? "—";

  const existingScores = team?.scores ?? [];
  const existingAvg =
    existingScores.length > 0
      ? Math.round(
        (existingScores.reduce((sum, s) => {
          const total =
            s.impact +
            s.creativity +
            s.presentation +
            s.relevance +
            s.validity;
          return sum + total;
        }, 0) /
          existingScores.length) *
        100
      ) / 100
      : null;

  const currentTotal =
    payload.impact +
    payload.creativity +
    payload.presentation +
    payload.relevance +
    payload.validity;

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      console.log("Submitting score:", payload);
      const res = await addscoreToTeam(teamId, payload);
      setMsg(res);
      // router.push("/admin/score");
    } catch (e: any) {
      setMsg(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function Field({
    name,
    label,
  }: {
    name: keyof ScorePayload;
    label: string;
  }) {
    return (
      <div className="space-y-2">
        <label className="text-sm text-slate-300">{label}</label>
        <input
          type="number"
          min={0}
          max={10}
          step={1}
          value={payload[name]}
          onChange={(e) => {
            const v = e.currentTarget.valueAsNumber;
            setPayload((p) => ({ ...p, [name]: Number.isNaN(v) ? 0 : v }));
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-slate-600"
        />
      </div>
    );
  }

  return (
    // Full-viewport background + centering
    <main
      className="
      grid min-h-[100svh] place-items-center px-4
      bg-slate-950
      bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.12),transparent_60%)]
    "
    >
      {/* Centered card */}
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-black/40 backdrop-blur">
        {/* Header now shows team identity */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              Add score for <span className="text-white">{teamName}</span>
            </h1>
            <p className="text-sm text-slate-400">
              Challenge: <span className="text-slate-300">{challengeName}</span>
            </p>
          </div>
          <span className="text-sm text-slate-400">Team ID: {teamId}</span>
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
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 text-sm font-medium text-slate-200">Team members</div>
            <div className="flex flex-wrap gap-2">
              {team.members.map((m) => (
                <span
                  key={m.id}
                  className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs ${m.attended
                      ? "border-emerald-700 bg-emerald-900/20 text-emerald-200"
                      : "border-slate-700 bg-slate-800 text-slate-300"
                    }`}
                  title={`${m.fullName} • ${m.email} • ${m.phone}`}
                >
                  {m.fullName}
                  {m.attended ? (
                    <span className="rounded-full bg-emerald-700 px-1 text-[10px]">✓</span>
                  ) : (
                    <span className="rounded-full bg-slate-600 px-1 text-[10px]">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* The scoring form */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="impact" label="Impact" />
          <Field name="creativity" label="Creativity" />
          <Field name="presentation" label="Presentation" />
          <Field name="relevance" label="Relevance" />
          <Field name="validity" label="Validity" />
        </div>

        {msg && (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${msg.startsWith("Error")
                ? "border-red-600 bg-red-900/30 text-red-200"
                : "border-emerald-600 bg-emerald-900/30 text-emerald-200"
              }`}
          >
            {msg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-900 hover:bg-white disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save score"}
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