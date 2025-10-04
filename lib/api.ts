"use server";
import { CreateTeamPayload, Judge, Member, Team, TeamDetailResponse } from "@/types/types";
import { cookies } from "next/headers";

type responseData = {
  success: boolean;
  data: Team[] | Member[] | Judge[];
  message: string;
  errors: any;
};

export const getTeams = async () => {
  // Simulate an API call
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;


  // const BACKEND_URL = process.env.BACKEND_URL; // or NEXT_PUBLIC_BACKEND_URL if used in the browser
  // if (!BACKEND_URL) {
  //   throw new Error("Missing BACKEND_URL in environment");
  // }
  try {
    const response = await fetch(
      "https://nasaspaceappshurghada.runasp.net/api/Team/GetAllTeams",
      {
        method: "GET",
        headers: {
          Accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: responseData = await response.json();
    console.log("Contestants:", data);
    return data.data;
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
};
export const getMembers = async () => {
  // Simulate an API call
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;


  // const BACKEND_URL = process.env.BACKEND_URL; // or NEXT_PUBLIC_BACKEND_URL if used in the browser
  // if (!BACKEND_URL) {
  //   throw new Error("Missing BACKEND_URL in environment");
  // }
  try {
    const response = await fetch(
      "https://nasaspaceappshurghada.runasp.net/api/Contestant/GetAll",
      {
        method: "GET",
        headers: {
          Accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: responseData = await response.json();
    console.log("Contestants:", data);
    return data.data;
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
};
export const getJudges = async () => {
  // Simulate an API call
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;


  // const BACKEND_URL = process.env.BACKEND_URL; // or NEXT_PUBLIC_BACKEND_URL if used in the browser
  // if (!BACKEND_URL) {
  //   throw new Error("Missing BACKEND_URL in environment");
  // }
  try {
    const response = await fetch(
      "https://nasaspaceappshurghada.runasp.net/api/Judge/GetAll",
      {
        method: "GET",
        headers: {
          Accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: responseData = await response.json();
    console.log("Contestants:", data);
    return data.data;
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
};

// lib/actions/team.ts



type ApiEnvelope = {
  succeeded?: boolean;
  message?: string;
  error?: string[];
  data: any;
};

// Server-side helper (use from route handlers / server actions)
export const createTeam = async (
  team: CreateTeamPayload
) => {
  const token = (await cookies()).get("admin_token")?.value;

  try {
    const res = await fetch(
      "https://nasaspaceappshurghada.runasp.net/api/Team/CreateTeam",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(team),
        // important for server fetches hitting external APIs
        cache: "no-store",
      }
    );

    // Try to read JSON either way so we can surface API messages
    // const json = (await res.json().catch(() => null)) as
    //   | ApiEnvelope<T>
    //   | { message?: string; error?: string }
    //   | null;

    const json = await res.json() as ApiEnvelope | null;

    if (!res.ok || (json && "succeeded" in json && json.succeeded === false)) {
      // prefer API-provided message
      let msg =
        (json as any)?.error[0] ||
        (json as any)?.message ||
        `HTTP error ${res.status}`;
      // handle stringified JSON error: { error: "{\"message\":\"...\"}" }
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.message) msg = parsed.message;
      } catch { }
      throw new Error(msg);
    }

    const payload = json as ApiEnvelope | null;
    return (payload) ?? (json);
  } catch (e: any) {
    throw new Error(e?.message || "Failed to create team");
  }
};

export const deleteTeamById = async (id: string) => {
  const token = (await cookies()).get("admin_token")?.value;

  try {
    const res = await fetch(
      `https://nasaspaceappshurghada.runasp.net/api/Team/DeleteTeam?teamId=${id}`,
      {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // important for server fetches hitting external APIs
        cache: "no-store",
      }
    );

    // Try to read JSON either way so we can surface API messages
    // const json = (await res.json().catch(() => null)) as
    //   | ApiEnvelope<T>
    //   | { message?: string; error?: string }
    //   | null;

    const json = await res.json() as ApiEnvelope | null;

    if (!res.ok || (json && "succeeded" in json && json.succeeded === false)) {
      // prefer API-provided message
      let msg =
        (json as any)?.error[0] ||
        (json as any)?.message ||
        `HTTP error ${res.status}`;
      // handle stringified JSON error: { error: "{\"message\":\"...\"}" }
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.message) msg = parsed.message;
      } catch { }
      throw new Error(msg);
    }

    const payload = json as ApiEnvelope | null;
    return (payload) ?? (json);
  } catch (e: any) {
    throw new Error(e?.message || "Failed to delete team");
  }
};

export const getTeamById = async (id: string) => {
  // Simulate an API call
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  try {
    const res = await fetch(
      `https://nasaspaceappshurghada.runasp.net/api/Team/GetTeamById/${id}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data: TeamDetailResponse = await res.json();
    console.log("Team:", data);
    return data;
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
};

type ScorePayload = {
  impact: number;
  creativity: number;
  presentation: number;
  relevance: number;
  validity: number;
};
export const addscoreToTeam = async (id: number, score: ScorePayload) => {
  const token = (await cookies()).get("admin_token")?.value;

  try {
    const res = await fetch(
      `https://nasaspaceappshurghada.runasp.net/api/Team/AddScore/${id}`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(score),
        // important for server fetches hitting external APIs
        cache: "no-store",
      }
    );

    // Try to read JSON either way so we can surface API messages
    // const json = (await res.json().catch(() => null)) as
    //   | ApiEnvelope<T>
    //   | { message?: string; error?: string }
    //   | null;

    const json = await res.json()

    if (!res.ok || (json && "succeeded" in json && json.succeeded === false)) {
      // prefer API-provided message
      let msg =
        (json as any)?.error[0] ||
        (json as any)?.message ||
        `HTTP error ${res.status}`;
      // handle stringified JSON error: { error: "{\"message\":\"...\"}" }
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.message) msg = parsed.message;
      } catch { }
      throw new Error(msg);
    }

    return json.message;
  } catch (e: any) {
    throw new Error(e?.message || "Failed to add score to team");
  }
};