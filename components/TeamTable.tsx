"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { CreateTeamPayload, Team } from "@/types/types";
import { create } from "domain";
import { createTeam, deleteTeamById } from "@/lib/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Props extend your existing table with optional refresh callback and endpoint override
export default function TeamTable({
  data,
  onCreated,
  endpoint = "/api/team",
}: {
  data: Team[];
  onCreated?: () => void; // call to refresh the list after create
  endpoint?: string; // POST target
}) {
  const router = useRouter();
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-medium text-zinc-200">Teams</h3>
        <CreateTeamDialog endpoint={endpoint} onCreated={onCreated} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-zinc-800/70">
              <th className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400">ID</th>
              <th className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400">Name</th>
              <th className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr onClick={() => router.push(`/admin/home/team/${row.id}`)} key={i} className="hover:bg-zinc-800/40 cursor-pointer">
                  <td className="border-b border-zinc-800 px-4 py-2">{String(row.id)}</td>
                  <td className="border-b border-zinc-800 px-4 py-2">{row.name}</td>
                  <td className="border-b border-zinc-800 px-4 py-2">{row.score}</td>
                  <td className="border-b border-zinc-800 px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <DeleteTeamButton
                        id={row.id}
                        name={row.name}
                        endpoint={endpoint}      // same API base; DELETE hits `${endpoint}?id=...`
                        onDeleted={onCreated}    // reuse your refresh callback
                      />
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Create Team Dialog ---

type Contestant = {
  email: string;
  fullName: string;
  phone: string;
  attended: boolean;
};



function CreateTeamDialog({ endpoint, onCreated }: { endpoint: string; onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateTeamPayload>({
    name: "",
    challengeName: "",
    judged: false,
    code: "",
    contestant: [],
  });

  function update<K extends keyof CreateTeamPayload>(key: K, value: CreateTeamPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateContestant(i: number, patch: Partial<Contestant>) {
    setForm((f) => ({
      ...f,
      contestant: f.contestant.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }));
  }

  function addContestant() {
    setForm((f) => ({
      ...f,
      contestant: [...f.contestant, { email: "", fullName: "", phone: "", attended: false }],
    }));
  }

  function removeContestant(i: number) {
    setForm((f) => ({
      ...f,
      contestant: f.contestant.filter((_, idx) => idx !== i), // ← can become []
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client validation
    if (!form.name.trim() || !form.challengeName.trim()) {
      setError("Name and challenge name are required.");
      setLoading(false);
      return;
    }

    try {
      // const res = await fetch(endpoint, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });

      // if (!res.ok) {
      //   const data = await res.json().catch(() => ({ error: "Create failed" }));
      //   let message = (data?.error as string) || (data?.message as string) || "Create failed";
      //   try {
      //     const parsed = JSON.parse(message);
      //     if (parsed?.message) message = parsed.message;
      //   } catch {}
      //   setError(message);
      //   return;
      // }

      // // Optional: read body for {succeeded}
      // const body = (await res.json().catch(() => ({}))) as { succeeded?: boolean; message?: string; error?: string };
      // if (body?.succeeded === false) {
      //   setError(body?.error || body?.message || "Create failed");
      //   return;
      // }
      const data = await createTeam(form);

      if (data?.succeeded === false) {
        setError(Array.isArray(data?.error) ? data.error[0] : "Create failed");
        console.log("Failed to create team", data);
        return
      } else {
        setOpen(false);
      }
      onCreated?.();
      // reset form after success
      setForm({ name: "", challengeName: "", judged: false, code: "", contestant: [{ email: "", fullName: "", phone: "", attended: false }] });
    } catch (err: any) {
      setError(err?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#5d89e1]">
          <Plus className="mr-1 h-4 w-4" /> New Team
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
        </DialogHeader>

        {error && (
          <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="challengeName">Challenge name</Label>
            <Input id="challengeName" value={form.challengeName} onChange={(e) => update("challengeName", e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Textarea id="code" value={form.code} onChange={(e) => update("code", e.target.value)} placeholder="Optional team code or notes" />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="judged" checked={form.judged} onCheckedChange={(v) => update("judged", Boolean(v))} />
            <Label htmlFor="judged">Judged</Label>
          </div>

          <div className="mt-2 space-y-3">
            <div className="text-sm font-medium text-zinc-900">Contestants <span className="ml-1 font-normal text-zinc-500">(optional)</span></div>

            {form.contestant.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
                No contestants yet.
              </div>
            ) : (
              form.contestant.map((c, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-12 items-end gap-2 rounded-lg border border-zinc-200 p-3">
                  <div className="col-span-12 sm:col-span-4 grid gap-1">
                    <Label htmlFor={`email-${i}`}>Email</Label>
                    <Input id={`email-${i}`} type="email" value={c.email}
                      onChange={(e) => updateContestant(i, { email: e.target.value })}
                      placeholder="user@example.com" />
                  </div>

                  <div className="col-span-12 sm:col-span-4 grid gap-1">
                    <Label htmlFor={`fullName-${i}`}>Full name</Label>
                    <Input id={`fullName-${i}`} value={c.fullName}
                      onChange={(e) => updateContestant(i, { fullName: e.target.value })}
                      placeholder="Jane Doe" />
                  </div>

                  <div className="col-span-12 sm:col-span-3 grid gap-1">
                    <Label htmlFor={`phone-${i}`}>Phone (optional)</Label>
                    <Input id={`phone-${i}`} value={c.phone ?? ""}
                      onChange={(e) => updateContestant(i, { phone: e.target.value })}
                      placeholder="+20..." />
                  </div>

                  <div className="col-span-12 sm:col-span-10 flex items-center gap-2">
                    <Checkbox id={`attended-${i}`} checked={c.attended}
                      onCheckedChange={(v) => updateContestant(i, { attended: Boolean(v) })} />
                    <Label htmlFor={`attended-${i}`}>Attended</Label>
                  </div>

                  <div className="col-span-12 flex justify-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeContestant(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}

            <Button type="button" variant="secondary" onClick={addContestant} className="mt-1">
              <Plus className="mr-1 h-4 w-4" /> Add contestant
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className={`bg-[#5d89e1] ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTeamButton({
  id,
  name,
  endpoint,
  onDeleted,
}: {
  id: number | string;
  name: string;
  endpoint: string;
  onDeleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      setBusy(true);
      setError(null);
      await deleteTeamById(String(id));
      setOpen(false);
      onDeleted?.();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete {name}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete team “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The team and its data may be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
