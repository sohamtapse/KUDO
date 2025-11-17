import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateReview } from "@/lib/gemini";
import { postCommitReview } from "@/lib/github";
import Review from "@/models/Review";
import "../../../../db/db"; // ensures DB initializes

function verifySignature(req: Request, body: string) {
  const signature = req.headers.get("x-hub-signature-256");
  const hmac = crypto
    .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  return signature === `sha256=${hmac}`;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  if (!verifySignature(req, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  const payload = JSON.parse(rawBody);

  if (event === "push") {
    const repo = payload.repository.full_name;

    for (const commit of payload.commits) {
      // Fetch diff
      const diff = await fetch(commit.url + ".diff").then((r) => r.text());

      // Fetch original code before commit
      const original = await fetch(commit.url)
        .then((r) => r.json())
        .then((json) =>
          json.files.map((f: { filename: any; patch: any }) => ({
            filename: f.filename,
            previous: f.patch,
          }))
        );

      // Generate Gemini review
      const reviewText = await generateReview(diff);

      // Post review back to GitHub
      await postCommitReview(repo, commit.id, reviewText);

      // Save to MongoDB
      await Review.create({
        repo,
        commitSha: commit.id,
        diff,
        originalCode: JSON.stringify(original, null, 2),
        review: reviewText,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
