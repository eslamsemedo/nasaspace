import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;
  try {
    console.log(token)
    const body = await req.json(); // { email, password, fullName, roles }

    const res = await fetch(`${process.env.BACKEND_URL}/api/Auth/Register`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: String(body.email),
        password: String(body.password),
        fullName: String(body.fullName),
        roles: Number(body.roles), // 0 or 1
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `${errText}` || "Invalid credentials" },
        { status: res.status }
      );
    }


    // Assume backend returns { data: { token }, message }
    const { data, message, succeeded, errors } = await res.json();

    console.log(data, message, succeeded)

    if (succeeded === false) {
      return NextResponse.json(
        { succeeded: false, error: `${errors[0]}` || "Login failed" },
      );
    }
    else {
      console.log("Login succeeded:", message, data);
      const response = NextResponse.json({ succeeded: true, message, data });
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