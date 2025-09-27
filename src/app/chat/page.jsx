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
      const res = await fetch("/api/conversations");
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
    if (!selectedConv) {
      alert("Select a conversation first!");
      return;
    }
    const res = await fetch(`/api/messages/${selectedConv._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", content }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
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
