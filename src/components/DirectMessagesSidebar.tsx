
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser?: (user: { id: string; username: string; profile_pic: string | null }) => void;
}

type DbUser = { id: string; username: string; profile_pic: string | null };
// Chat message type no longer used here; handled by ChatPanel

export default function DirectMessagesSidebar({ isOpen, onClose, onSelectUser }: Props) {
  const [session, setSession] = useState<any>(null);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from('User')
        .select('id, username, profile_pic')
        .neq('id', session.user.id)
        .order('username', { ascending: true });
      setUsers((data as DbUser[]) ?? []);
    };
    loadUsers();
  }, [session]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => u.username.toLowerCase().includes(q));
  }, [users, search]);

  // Chat logic moved to ChatPanel; this component only lists users.

  return (
    <>
      {/* Desktop direct messages sidebar (shown only when isOpen) */}
      <div className={`hidden ${isOpen ? 'lg:flex' : 'lg:hidden'} w-[calc(20rem+1px)] bg-white border-r border-gray-200 shadow-lg`}>
        <div className="w-80 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Direct Messages</h2>
          </div>
          <div className="mb-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)] pr-1">
            {filteredUsers.map(u => (
              <button key={u.id} onClick={() => { setSelectedUser(u); onSelectUser?.(u); }} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedUser?.id === u.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  {u.profile_pic ? (
                    <img src={u.profile_pic} alt={u.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-600 font-semibold text-sm">{u.username[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-gray-900 truncate">{u.username}</p>
                </div>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-sm text-gray-500 px-2 py-4">No users found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop chat panel is external; no filler to avoid gaps */}

      {/* Mobile direct messages sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Direct Messages</h2>
        </div>
        <div className="p-4 space-y-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1">
            {filteredUsers.map(u => (
              <button key={u.id} onClick={() => { setSelectedUser(u); onSelectUser?.(u); onClose(); }} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  {u.profile_pic ? (
                    <img src={u.profile_pic} alt={u.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-600 font-semibold text-sm">{u.username[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-gray-900 truncate">{u.username}</p>
                </div>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-sm text-gray-500 px-2 py-4">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
