"use client";

import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      const res = await fetch("/api/chat", {
        method: "GET",             // or "POST" if sending data
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",    // ← this sends the Clerk session cookie
      });

      const data = await res.json();
      setConversations(data.conversations || []);
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      return;
    }
    async function fetchMessages() {
      const res = await fetch(`/api/messages/${selectedConv._id}`);
      const data = await res.json();
      setMessages(data.messages || []);
    }
    fetchMessages();
  }, [selectedConv]);

  const handleSend = async (content) => {
    let convId = selectedConv?._id;

    // Auto-create conversation if none selected
    if (!convId) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            conversationId: selectedConv._id,
            messages: messagesToSend,
          }),
        });
        const data = await res.json();
        console.log("Auto-created conversation:", data);

        if (!data.conversation?._id) {
          alert("Failed to create conversation");
          return;
        }

        convId = data.conversation._id;
        setConversations((prev) => [data.conversation, ...prev]);
        setSelectedConv(data.conversation);
      } catch (err) {
        console.error("Error creating conversation:", err);
        alert("Error creating conversation");
        return;
      }
    }

    // Send the message
    try {
      const res = await fetch(`/api/messages/${convId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Error sending message");
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar conversations={conversations} onSelect={setSelectedConv} />
      <div className="flex-1 flex flex-col p-4 gap-2">
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
