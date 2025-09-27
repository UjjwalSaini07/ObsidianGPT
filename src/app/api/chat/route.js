import { NextResponse } from "next/server";
import { generateAIResponse } from "@/utils/vercelAI";
import { estimateTokens } from "@/utils/tokens";
import { AI } from "@/helpers/constants";

export async function POST(req) {
  try {
    const { conversationId, messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
    }

    // Check total token count
    const totalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
    if (totalTokens > AI.MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message too long." }, { status: 400 });
    }

    // Generate AI response (with caching handled internally)
    const aiResponse = await generateAIResponse(messages);

    return NextResponse.json({
      message: aiResponse,
      cached: aiResponse.cached || false,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
