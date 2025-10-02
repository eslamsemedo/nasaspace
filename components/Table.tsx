import { getJudges, getMembers, getTeams } from '@/lib/api';
import { Judge, Member, Team } from '@/types/types';
import { get } from 'http';
import { useEffect, useState } from 'react';
import TeamTable from './TeamTable';
import MemberTable from './MemberTable';
import JudgeTable from './JudgeTable';

interface TableProps {
  type: 'team' | 'member' | 'judge';
}

const Table = ({ type }: TableProps) => {
  const [data, setData] = useState<Team[] | Member[] | Judge[]>([]);
  useEffect(() => {
    // Fetch data based on type
    // For demo, we use static data
    (async () => {
      if (type === 'team') {
        setData(await getTeams());
      } else if (type === 'member') {
        setData(await getMembers());
      } else if (type === 'judge') {
        setData(await getJudges());
      }
    })();
  }, [type]);

  return (
    <div>
      {type === 'team' && (
        <TeamTable data={data as Team[]} />
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