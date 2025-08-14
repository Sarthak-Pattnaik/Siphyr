import type { Message } from "../types";

interface Props {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: Props) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`chat-bubble ${isOwnMessage ? "sent" : "received"} animate-slide-up`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-2 ${isOwnMessage ? "text-primary-100" : "text-gray-400"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
