import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageSidebar from "../components/MessageSidebar";
import HeaderBar from "../components/HeaderBar";

export default function Messages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messageSidebarOpen, setMessageSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header always at the top */}
      <HeaderBar 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile message sidebar overlay */}
        {messageSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMessageSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Right Message Sidebar */}
        <MessageSidebar
          isOpen={messageSidebarOpen}
          onClose={() => setMessageSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Put your chat/messages UI here */}
        </div>

        
      </div>
    </div>
  );
}

