"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AddRepo() {
  const { data: session } = useSession();
  const [repoInput, setRepoInput] = useState("");
  const [msg, setMsg] = useState("");

  function normalizeRepo(input: string) {
    input = input.trim();

    // Case 1: User pasted full GitHub URL
    if (input.startsWith("http")) {
      try {
        const url = new URL(input);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
      } catch {}
    }

    // Case 2: user/repo directly
    if (input.includes("/")) return input;

    return ""; // invalid
  }

  async function createWebhook() {
    if (!(session as any)?.accessToken) return alert("Login required");

    const repoFullName = normalizeRepo(repoInput);

    if (!repoFullName) {
      setMsg("❌ Invalid repo. Use owner/repo or GitHub URL.");
      return;
    }

    const res = await fetch("/api/github/create-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoFullName,
        accessToken: (session as any).accessToken,
      }),
    });

    const data = await res.json();
    setMsg(res.ok ? "Webhook added ✔️" : "Error: " + data.error);
  }

  return (
    <div className="p-4">
      <input
        className="border p-2 w-full rounded"
        placeholder="owner/repo or GitHub URL"
        value={repoInput}
        onChange={(e) => setRepoInput(e.target.value)}
      />
      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={createWebhook}
      >
        Add Repository
      </button>

      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
}
