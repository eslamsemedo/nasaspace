import { getJudges, getMembers, getTeams } from '@/lib/api';
import { Judge, Member, Team } from '@/types/types';
import { get } from 'http';
import { useEffect, useState } from 'react';
import TeamTable from './TeamTable';
import MemberTable from './MemberTable';
import JudgeTable from './JudgeTable';
import { Loader2 } from 'lucide-react';

interface TableProps {
  type: 'team' | 'member' | 'judge';
}

const Table = ({ type }: TableProps) => {
  const [data, setData] = useState<Team[] | Member[] | Judge[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Fetch data based on type
    // For demo, we use static data
    (async () => {
      setLoading(true);
      if (type === 'team') {
        setData(await getTeams());
      } else if (type === 'member') {
        setData(await getMembers());
      } else if (type === 'judge') {
        setData(await getJudges());
      }
      setLoading(false);
    })();
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>)
  }
  return (
    <div>

      {type === 'team' && (
        <TeamTable data={data as Team[]} onCreated={async () => setData(await getTeams())} />
      )}
      {type === 'member' && (
        <MemberTable data={data as Member[]} />
      )}
      {type === 'judge' && (
        <JudgeTable data={data as Judge[]} />
      )}
    </div>
  );
};

export default Table;