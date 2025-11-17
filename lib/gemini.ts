import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function generateReview(diff: string) {
  const prompt = `
You are a senior software engineer.
Review this GitHub commit diff and provide a clear, direct, helpful review.

Focus on:
- mistakes
- bugs
- performance issues
- bad logic
- security flaws
- improvements

Always be direct and give suggestions.

Diff:
${diff}
  `;

  const response = await model.generateContent(prompt);
  return response.response.text();
}
