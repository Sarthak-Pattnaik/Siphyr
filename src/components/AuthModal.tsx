import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import ProfileSetupModal from './ProfileSetupModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [showSetup, setShowSetup] = useState(false);  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user?.id) {
        setNeedsSetup(false);
        return;
      }

      const { data, error } = await supabase
        .from('User')
        .select('username, profile_pic')
        .eq('id', session.user.id)
        .maybeSingle();

      // user needs setup only if missing username
      const missing = !!error || !data || !data.username;
      setNeedsSetup(missing);
      if (missing) setShowSetup(true); // force open if missing

    };

    if (session) checkProfile();
  },[session]);


  if (!isOpen) return null;
  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!session ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sign In/Sign Up</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['github', 'google']}
              onlyThirdPartyProviders={false}
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      ) :needsSetup ? (
        <ProfileSetupModal
          isOpen={showSetup}
          userId={session?.user?.id ?? ""}
          onClose={() => setShowSetup(false)} // just hides temporarily
          onComplete={() => {
            setNeedsSetup(false); // now user is complete
            setShowSetup(false);
            window.location.reload();
          }}
        />
      ) : null}
    </>
  );
}  