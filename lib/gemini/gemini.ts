"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function generateSummary(buffer: Buffer): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const base64Pdf: string = buffer.toString("base64");

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf,
        },
      },
      {
        text: "",
      },
    ]);

    return result.response.text();
  } catch (error) {
    console.error(error);
    throw new Error("Ai error");
  }
}
