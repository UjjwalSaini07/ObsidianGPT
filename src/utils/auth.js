import { auth } from "@clerk/nextjs";

export function getAuthUser() {
  try {
    const { userId, sessionId } = auth();
    if (!userId) throw new Error("User not authenticated");
    return { userId, sessionId };
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    throw new Error("Authentication failed");
  }
}
