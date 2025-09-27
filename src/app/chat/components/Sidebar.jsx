"use client";

import { useEffect, useState } from "react";

export default function Sidebar({ conversations, onSelect }) {
  return (
    <div className="w-64 bg-gray-50 p-4 border-r space-y-3">
      <h2 className="font-bold text-lg mb-2">Conversations</h2>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        onClick={() => onSelect(null)}
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
