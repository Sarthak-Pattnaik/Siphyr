import { useState } from "react";
import DirectMessagesSidebar from "../components/DirectMessagesSidebar";
import ChatPanel from "../components/ChatPanel";
import MessageSidebar from "../components/MessageSidebar";
import { useState as useReactState } from "react";

export default function Messages() {
  const [messageSidebarOpen, setMessageSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useReactState<{ id: string; username: string; profile_pic: string | null } | null>(null);
  const [showDirectMessages, setShowDirectMessages] = useReactState(false);

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}

        {/* Left Message Sidebar (channels/nav) */}
        <MessageSidebar
          isOpen={messageSidebarOpen}
          onClose={() => setMessageSidebarOpen(false)}
          onOpenDirectMessages={() => setShowDirectMessages(prev => !prev)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="hidden lg:flex flex-1">
            <DirectMessagesSidebar isOpen={showDirectMessages} onClose={() => setShowDirectMessages(false)} onSelectUser={(u) => setSelectedUser(u)}/>
            <ChatPanel selectedUser={selectedUser} />
          </div>
          <div className="lg:hidden flex-1">
            <ChatPanel selectedUser={selectedUser} />
          </div>
        </div>

        
      </div>
    </div>
  );
}

