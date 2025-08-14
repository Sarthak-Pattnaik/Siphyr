import { useEffect, useState } from "react";
import type { User } from "../types";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ selectedUser, setSelectedUser, isOpen, onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error("Failed to load users", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select User</h2>
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" color="primary" />
              </div>
            ) : (
              users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedUser?.id === user.id
                      ? 'bg-primary-50 border border-primary-200 text-primary-700'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">Click to chat</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select User</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" color="primary" />
              </div>
            ) : (
              users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedUser?.id === user.id
                      ? 'bg-primary-50 border border-primary-200 text-primary-700'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">Click to chat</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
