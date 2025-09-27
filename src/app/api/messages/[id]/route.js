import { dbConnect } from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

// ✅ GET messages for a conversation
export async function GET(req, context) {
  try {
    await dbConnect();

    const user = getAuthUser(req);
    if (!user) {
      console.error("❌ Auth error: User not authenticated");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // ✅ await params
    const { id } = await context.params;

    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("❌ GET /api/messages/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// ✅ POST a new message to a conversation
export async function POST(req, context) {
  try {
    await dbConnect();

    const user = getAuthUser(req);
    if (!user) {
      console.error("❌ Auth error: User not authenticated");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { id } = await context.params;
    const { role, content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Create message
    const message = await Message.create({
      conversationId: id,
      senderId: user.userId,
      role,
      content,
    });

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(id, {
      lastMessageAt: new Date(),
    });

    return NextResponse.json({ message });
  } catch (err) {
    console.error("❌ POST /api/messages/[id] error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
