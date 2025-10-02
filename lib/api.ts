"use server";
import { Judge, Member, Team } from "@/types/types";
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