import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import type { Message, User } from "../types";
import MessageBubble from "./MessageBubble";

interface Props {
  selectedUser: User | null;
}

const socket = io("http://localhost:3000"); // adjust port if needed

export default function Chat({ selectedUser }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedUser) {
      // Fetch messages for the selected user
      fetch(`http://localhost:3000/messages?senderId=${selectedUser.id}`)
        .then(res => res.json())
        .then(setMessages)
        .catch(err => console.error("Failed to load messages", err));
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.on("new_message", (msg: Message) => {
      if (selectedUser && (msg.sender.id === selectedUser.id || msg.sender.id === "current_user")) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!selectedUser || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: {
        id: "current_user",
        username: "You"
      },
      createdAt: new Date().toISOString()
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, newMessage]);

    // Emit to socket
    socket.emit("send_message", {
      content: content.trim(),
      senderId: selectedUser.id,
      recipientId: selectedUser.id
    });

    setContent("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a user to start chatting</h3>
          <p className="text-gray-500">Choose someone from the sidebar to begin your conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-sm">
              {selectedUser.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedUser.username}</h2>
            <p className="text-sm text-gray-500">Direct message</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id + "-" + msg.createdAt}
              message={msg}
              isOwnMessage={msg.sender.id === "current_user"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-field flex-1"
            placeholder={`Message ${selectedUser.username}...`}
            disabled={!selectedUser}
          />
          <button
            onClick={sendMessage}
            disabled={!content.trim() || !selectedUser}
            className="btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}