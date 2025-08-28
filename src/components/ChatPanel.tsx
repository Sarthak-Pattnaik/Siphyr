import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type ChatUser = { id: string; username: string; profile_pic: string | null };
type DbMessage = { id: string; content: string; senderId: string; receiverId: string; createdAt: string };

interface ChatPanelProps {
  selectedUser: ChatUser | null;
}

export default function ChatPanel({ selectedUser }: ChatPanelProps) {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [content, setContent] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!session?.user?.id || !selectedUser?.id) {
        setMessages([]);
        return;
      }
      const currentId = session.user.id;
      const otherId = selectedUser.id;
      const { data } = await supabase
        .from('Message')
        .select('id, content, senderId, receiverId, createdAt')
        .or(`and(senderId.eq.${currentId},receiverId.eq.${otherId}),and(senderId.eq.${otherId},receiverId.eq.${currentId})`)
        .order('createdAt', { ascending: true });
      setMessages((data as DbMessage[]) ?? []);
      setTimeout(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, 0);
    };
    loadMessages();
  }, [session, selectedUser]);

  const sendMessage = async () => {
    if (!session?.user?.id || !selectedUser?.id || !content.trim()) return;
    const newMsg: DbMessage = {
      id: Math.random().toString(36).slice(2),
      content: content.trim(),
      senderId: session.user.id,
      receiverId: selectedUser.id,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setContent('');
    const { data, error } = await supabase
      .from('Message')
      .insert({ content: newMsg.content, senderId: newMsg.senderId, receiverId: newMsg.receiverId, createdAt: newMsg.createdAt });
    if (error) console.error('Insert failed:', error);
    else console.log('Insert succeeded:', data);
    setTimeout(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {selectedUser.profile_pic ? (
              <img src={selectedUser.profile_pic} alt={selectedUser.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 font-semibold text-sm">{selectedUser.username[0]?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedUser.username}</h2>
            <p className="text-sm text-gray-500">Direct message</p>
          </div>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet. Say hi!</p>
        ) : (
          messages.map(m => {
            const isOwn = m.senderId === session?.user?.id;
            return (
              <div key={m.id + m.createdAt} className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-purple-600 text-white ml-auto' : 'bg-gray-100 text-gray-900'}`}>
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <div className={`mt-1 text-xs ${isOwn ? 'text-purple-100' : 'text-gray-500'}`}>{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-field flex-1"
            placeholder={`Message ${selectedUser.username}...`}
          />
          <button onClick={sendMessage} disabled={!content.trim()} className="btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
}


