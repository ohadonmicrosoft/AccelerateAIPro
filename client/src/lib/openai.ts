import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  pending?: boolean;
  error?: boolean;
  reaction?: string;
};

export async function* streamCompletion(messages: Array<{ role: string; content: string }>) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      stream: true,
    });

    for await (const chunk of completion) {
      if (chunk.choices[0]?.delta?.content) {
        yield chunk.choices[0].delta.content;
      }
    }
  } catch (error) {
    console.error("OpenAI stream error:", error);
    throw error;
  }
}