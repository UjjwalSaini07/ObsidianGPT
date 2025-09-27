import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = getAuthUser();

    const conversationId = params.id;
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit")) || 50;
    const skip = parseInt(url.searchParams.get("skip")) || 0;

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Messages GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const user = getAuthUser();

    const conversationId = params.id;
    const { role = "user", content = "", attachments = [] } = await req.json();

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    if (!content && attachments.length === 0) {
      return NextResponse.json({ error: "Message content or attachments required" }, { status: 400 });
    }

    // Create message
    const message = await Message.createMessage({
      conversationId,
      role,
      content,
      attachments,
    });

    // Touch the conversation to update lastMessageAt
    await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() }).exec();

    return NextResponse.json({ message });
  } catch (err) {
    console.error("Messages POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
