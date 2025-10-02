import { Member } from '@/types/types'
import React from 'react'

const MemberTable = ({ data }: { data: Member[] }) => {
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
              key={'FullName'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Full Name
            </th>
            <th
              key={'Email'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Email
            </th>
            <th
              key={'Phone'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Phone
            </th>
            <th
              key={'Attended'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Attended
            </th>
            <th
              key={'TeamName'}
              className="border-b border-zinc-700 px-4 py-2 text-left font-medium text-zinc-400"
            >
              Team Name
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row,i) => (
            <tr key={i} className="hover:bg-zinc-800/40">
              <td
                key={row.id + 'ID'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {String(row.id)}
              </td>
              <td
                key={row.id + 'FullName'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.fullName}
              </td>
              <td
                key={row.id + 'Email'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.email}
              </td>
              <td
                key={row.id + 'Phone'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.phone || 'N/A'}
              </td>
              <td
                key={row.id + 'Attended'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.attended ? 'Yes' : 'No'}
              </td>
              <td
                key={row.id + 'TeamName'}
                className="border-b border-zinc-800 px-4 py-2"
              >
                {row.teamName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MemberTable