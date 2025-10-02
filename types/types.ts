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