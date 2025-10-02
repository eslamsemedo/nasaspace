import { Judge } from '@/types/types'
import React from 'react'

const JudgeTable = ({ data }: { data: Judge[] }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-800/70">
            <th
              key={'Name'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Name
            </th>
            <th
              key={'email'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-zinc-800/40">
              <td
                key={i + 'Name'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.name}
              </td>
              <td
                key={i + 'Email'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JudgeTable


