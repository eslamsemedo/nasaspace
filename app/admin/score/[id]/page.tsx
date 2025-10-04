// app/scores/[id]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { addscoreToTeam } from "@/lib/api";

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

  const [payload, setPayload] = useState<ScorePayload>({
    impact: 0,
    creativity: 0,
    presentation: 0,
    relevance: 0,
    validity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      // const res = await fetch(`https://nasaspaceappshurghada.runasp.net/api/Team/UpdateScore/${teamId}`, {
      //   method: "POST",
      //   headers: {
      //      "Content-Type": "application/json",
      //      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) {
      //   const t = await res.text();
      //   throw new Error(t || `HTTP ${res.status}`);
      // }
      console.log("Submitting score:", payload);
      const res = await addscoreToTeam(teamId, payload);
      setMsg(res);
      // optional: go back to list or stay
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
          // valueAsNumber avoids string parsing; becomes NaN while field is empty
          const v = e.currentTarget.valueAsNumber;
          setPayload((p) => ({ ...p, [name]: Number.isNaN(v) ? 0 : v }));
        }}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-slate-600"
      />
    </div>
  );
}

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-100">Add Score</h1>
        <span className="text-sm text-slate-400">Team ID: {teamId}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="impact" label="Impact" />
        <Field name="creativity" label="Creativity" />
        <Field name="presentation" label="Presentation" />
        <Field name="relevance" label="Relevance" />
        <Field name="validity" label="Validity" />
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

      <div className="flex gap-3">
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
  );
}