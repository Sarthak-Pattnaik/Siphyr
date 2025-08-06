import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { Message, User } from "../types";
import UserSelect from "./UserSelect";
const socket = io("http://localhost:3000"); // adjust port if needed

export default function Chat() {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/messages")
            .then(res => res.json())
            .then(setMessages)
            .catch(err => console.error("Failed to load messages", err));

        socket.on("new_message", (msg: Message) => {
            setMessages(prev => [msg, ...prev]);
        });

        return () => {
            socket.off("new_message");
        };
    }, []);

    const sendMessage = async () => {
        if (!selectedUser || !content.trim()) return;

        socket.emit("send_message", {
            content,
            senderId: selectedUser.id
        });

        setContent("");
    };


    return (
        <div className="p-4 space-y-4">
            <UserSelect selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

            <div className="flex space-x-2">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2">
                    Send
                </button>
            </div>

            <ul className="space-y-2">
                {messages.map((msg) => (
                    <li key={msg.id + "-" + msg.createdAt}>
                        <strong>{msg.sender?.username ?? "Unknown"}:</strong> {msg.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}