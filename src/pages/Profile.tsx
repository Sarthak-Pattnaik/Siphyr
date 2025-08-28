import { useEffect, useState } from "react";
// Sidebar and HeaderBar are provided by AppLayout
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<{ username: string; profile_pic: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('User')
        .select('username, profile_pic')
        .eq('id', session.user.id)
        .maybeSingle();
      setProfile((data as any) ?? null);
      setLoading(false);
    };
    loadProfile();
  }, [session]);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto w-full">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !session ? (
          <p className="text-gray-700">Please sign in to view your profile.</p>
        ) : !profile ? (
          <p className="text-gray-700">No profile found.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {profile.profile_pic ? (
                  <img src={profile.profile_pic} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{profile.username}</h1>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
                className="rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

