import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

const COOKIE_NAME = "admin_token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { username, password }
    // console.log('BACKEND_URL:', process.env.BACKEND_URL); // Debug line

    const res = await fetch(`${process.env.BACKEND_URL}/api/Auth/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: String(body.username),
        password: String(body.password),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: errText || "Invalid credentials" },
        { status: res.status }
      );
    }


    // Assume backend returns { data: { token }, message }
    const { data, message, succeeded } = await res.json();

    if (succeeded === false) {
      return NextResponse.json(
        { succeeded: false, error: message || "Login failed" },

      );
    }
    else {
      console.log("Login succeeded:", message);
      const response = NextResponse.json({ succeeded: true, message });

      response.cookies.set({
        name: COOKIE_NAME,
        value: data.token,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 12, // 12h
      });
      return response;
    }



  } catch (err: any) {
    console.error("Login route error:", err);

    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function PUT() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;
  console.log(token)
  try {
  //   const res = await fetch(`${process.env.BACKEND_URL}/admin/logout`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //       "accept": "application/json"
  //     },
  //     redirect: "follow"
  //   });

  //   if (!res.ok) {
  //     const errText = await res.text().catch(() => "");
  //     return NextResponse.json({ error: errText || "Invalid credentials" }, { status: res.status });
  //     // return NextResponse.json({ error: String(body.username) || "Invalid credentials" }, { status: res.status });
  //   }
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (err) {
    console.error("Login route error:", err);

    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}