import { getTeamById } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flag, UsersRound, Trophy } from "lucide-react";
import { TeamDetailResponse } from "@/types/types";

// type TeamDetailResponse = {
//   succeeded: boolean;
//   message?: string;
//   data?: {
//     id: number;
//     name: string;
//     score: number;
//     challengeName: string;
//     scores: {
//       id: number;
//       impact: number;
//       creativity: number;
//       presentation: number;
//       relevance: number;
//       validity: number;
//       judgeId: number;
//       judgeName: string;
//     }[];
//     members: {
//       id: number;
//       fullName: string;
//       email: string;
//       phone: string;
//       attended: boolean;
//       teamName: string;
//     }[];
//   } | null;
//   errors?: unknown;
// };

export default async function Page(
  props: PageProps<"/admin/home/team/[id]">
) {
  const { id } = await props.params;
  const teamRes = (await getTeamById(id)) as TeamDetailResponse;
  if (!teamRes?.succeeded || !teamRes?.data) notFound();
  const team = teamRes.data;

  const judgesCount = team.scores?.length ?? 0;
  const scoreSum =
    team.scores?.reduce(
      (acc, s) =>
        acc +
        s.impact +
        s.creativity +
        s.presentation +
        s.relevance +
        s.validity,
      0
    ) ?? 0;
  const scorePerJudge = judgesCount
    ? Math.round((scoreSum / judgesCount) * 100) / 100
    : 0;

  return (
    <div className="min-h-svh bg-black text-zinc-100 px-4 md:px-6 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/admin/home"
          className="inline-flex items-center text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">Teams</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-100">{team.name}</span>
      </div>

      {/* Top summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            icon: <Flag className="h-4 w-4" />,
            label: "Challenge",
            value: team.challengeName,
          },
          {
            icon: <UsersRound className="h-4 w-4" />,
            label: "Members",
            value: team.members?.length ?? 0,
          },
          {
            icon: <Trophy className="h-4 w-4" />,
            label: "Score",
            value: team.score,
            hint:
              judgesCount > 0
                ? `Avg / judge (sum of criteria): ${scorePerJudge}`
                : undefined,
          },
        ].map((card, i) => (
          <Card
            key={i}
            className="border border-zinc-800 bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/50 shadow-[0_0_0_1px_rgba(59,130,246,0.05)]"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <span className="text-sky-400">{card.icon}</span>
                <span className="text-zinc-200">{card.label}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-zinc-50">
                {card.value as any}
              </div>
              {card.hint && (
                <div className="mt-1 text-xs text-zinc-400">{card.hint}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members */}
      <Card className="border border-zinc-800 bg-zinc-900/60 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-zinc-200">
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {team.members && team.members.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-zinc-800/80">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-900/70">
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      #
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Full name
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Email
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Phone
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((m, idx) => (
                    <tr
                      key={m.id}
                      className="odd:bg-zinc-900/40 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="border-b border-zinc-800/80 px-4 py-2">
                        {idx + 1}
                      </td>
                      <td className="border-b border-zinc-800/80 px-4 py-2">
                        {m.fullName}
                      </td>
                      <td className="border-b border-zinc-800/80 px-4 py-2">
                        <a
                          href={`mailto:${m.email}`}
                          className="text-sky-400 hover:underline"
                        >
                          {m.email}
                        </a>
                      </td>
                      <td className="border-b border-zinc-800/80 px-4 py-2">
                        {m.phone || "-"}
                      </td>
                      <td className="border-b border-zinc-800/80 px-4 py-2">
                        {m.attended ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Attended
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Absent
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-sm text-zinc-400">
              No members.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Judges' Scores */}
      <Card className="border border-zinc-800 bg-zinc-900/60 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-zinc-200">
            Judges&apos; Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {team.scores && team.scores.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-zinc-800/80">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-900/70">
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Judge
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Impact
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Creativity
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Presentation
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Relevance
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Validity
                    </th>
                    <th className="border-b border-zinc-800 px-4 py-2 text-left font-medium text-zinc-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.scores.map((s) => {
                    const total =
                      s.impact +
                      s.creativity +
                      s.presentation +
                      s.relevance +
                      s.validity;
                    return (
                      <tr
                        key={s.id}
                        className="odd:bg-zinc-900/40 hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="border-b border-zinc-800/80 px-4 py-2">
                          {s.judgeName}
                        </td>
                        <td className="border-b border-zinc-800/80 px-4 py-2">
                          {s.impact}
                        </td>
                        <td className="border-b border-zinc-800/80 px-4 py-2">
                          {s.creativity}
                        </td>
                        <td className="border-b border-zinc-800/80 px-4 py-2">
                          {s.presentation}
                        </td>
                        <td className="border-b border-zinc-800/80 px-4 py-2">
                          {s.relevance}
                        </td>
                        <td className="border-b border-zinc-800/80 px-4 py-2">
                          {s.validity}
                        </td>
                        <td className="border-b border-zinc-800/80 px-4 py-2 font-medium text-sky-300">
                          {total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-sm text-zinc-400">
              No scores yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer CTAs */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* <Link href={`/admin/home/team/${team.id}/edit`}>
          <Button
            variant="secondary"
            className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700"
          >
            Edit team
          </Button>
        </Link> */}
        <Link href={`/admin/home`}>
          <Button className="bg-sky-600 hover:bg-sky-700 text-white">
            Back to teams
          </Button>
        </Link>
      </div>
    </div>
  );
}