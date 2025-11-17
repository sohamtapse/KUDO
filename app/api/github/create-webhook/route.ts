import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { repoFullName, accessToken } = await req.json();

    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/hooks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: true,
          events: ["push"],
          config: {
            url: "https://kudo-hvyv.vercel.app/api/github/webhook",
            content_type: "json",
            secret: process.env.GITHUB_WEBHOOK_SECRET,
          },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: await res.text() },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Webhook creation failed" },
      { status: 500 }
    );
  }
}
