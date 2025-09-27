"use client";

import { useEffect, useState } from "react";

export default function Sidebar({ conversations, onSelect }) {
  return (
    <div className="w-64 bg-gray-50 p-4 border-r space-y-3">
      <h2 className="font-bold text-lg mb-2">Conversations</h2>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        onClick={async () => {
          try {
            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: "New Conversation" }),
              credentials: "include",
            });
            const data = await res.json();
            console.log("New conversation response:", data);

            if (!data.conversation?._id) {
              alert("Failed to create a new conversation");
              return;
            }

            setConversations((prev) => [data.conversation, ...prev]);
            setSelectedConv(data.conversation);
          } catch (err) {
            console.error("Failed to create conversation:", err);
            alert("Error creating conversation");
          }
        }}
      >
        + New Chat
      </button>

      <div className="mt-4 flex flex-col gap-2">
        {conversations.map((conv) => (
          <button
            key={conv._id}
            onClick={() => onSelect(conv)}
            className="text-left p-2 rounded-lg hover:bg-gray-200"
          >
            {conv.title || "Untitled"}
          </button>
        ))}
      </div>
    </div>
  );
}
