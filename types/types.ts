export type Team = {
  id: number;
  name: string;
  score: number;
};
export type Judge = {
  name: string;
  email: string;
};
export type Member = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  attended: boolean;
  teamName: string;
};

type Contestant = {
  email: string;
  fullName: string;
  phone?: string;
  attended: boolean;
};
export type CreateTeamPayload = {
  name: string;
  challengeName: string;
  judged: boolean;
  code?: string;
  contestant: Contestant[];
};


export type TeamDetailResponse = {
  succeeded: boolean;
  message?: string;
  data?: {
    id: number;
    name: string;
    score: number;
    challengeName: string;
    scores: {
      id: number;
      impact: number;
      creativity: number;
      presentation: number;
      relevance: number;
      validity: number;
      judgeId: number;
      judgeName: string;
    }[];
    members: {
      id: number;
      fullName: string;
      email: string;
      phone: string;
      attended: boolean;
      teamName: string;
    }[];
  } | null;
  errors?: unknown;
};