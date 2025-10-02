import { Team } from '@/types/types'
import React from 'react'

const TeamTable = ({ data }: { data: Team[] }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-800/70">
            <th
              key={'ID'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              ID
            </th>
            <th
              key={'Name'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Name
            </th>
            <th
              key={'score'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-zinc-800/40">
              <td
                key={row.id + 'ID'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {String(row.id)}
              </td>
              <td
                key={row.id + 'Name'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.name}
              </td>
              <td
                key={row.id + 'score'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TeamTable