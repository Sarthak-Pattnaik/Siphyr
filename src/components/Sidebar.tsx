import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AuthModal from "./AuthModal";
import { supabase } from "../lib/supabaseClient";
import ProfileSetupModal from "./ProfileSetupModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sidebar_profile_pic') || null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

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
    const check = async () => {
      if (!session?.user?.id) {
        setNeedsSetup(false);
        setProfilePicUrl(null);
        return;
      }
      const { data, error } = await supabase
        .from('User')
        .select('username, profile_pic')
        .eq('id', session.user.id)
        .maybeSingle();
      const missing = !!error || !data || !data.username;
      setNeedsSetup(missing);
      const pic = (data as any)?.profile_pic ?? null;
      setProfilePicUrl(pic);
      try {
        if (pic) localStorage.setItem('sidebar_profile_pic', pic);
        else localStorage.removeItem('sidebar_profile_pic');
      } catch {}
    };
    check();
  }, [session]);

  const avatarThumbUrl = useMemo(() => {
    if (!profilePicUrl) return null;
    // Cloudinary: ensure /image/upload/ then add transformations for small, fast avatar
    // e.g., https://res.cloudinary.com/<cloud>/image/upload/v123/abc.jpg
    // ->     https://res.cloudinary.com/<cloud>/image/upload/c_fill,w_56,h_56,f_auto,q_auto:eco/<rest>
    try {
      const idx = profilePicUrl.indexOf('/image/upload/');
      if (idx === -1) return profilePicUrl;
      const before = profilePicUrl.substring(0, idx + '/image/upload'.length);
      const after = profilePicUrl.substring(idx + '/image/upload'.length);
      return `${before}/c_fill,w_56,h_56,f_auto,q_auto:eco${after}`;
    } catch {
      return profilePicUrl;
    }
  }, [profilePicUrl]);

  const onProfileClick = () => {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }
    if (needsSetup) {
      setIsSetupOpen(true);
      return;
    }
    navigate('/profile');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-20 bg-gradient-to-b from-purple-500 to-purple-600 shadow-2xl relative z-50">

        {/* Navigation icons */}
        <div className="flex flex-col items-center pt-8 space-y-8">
          {/* Home icon */}
          <Link to="/" className="group relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Home
            </div>
          </Link>

          {/* Search icon */}
          <Link to="/search" className="group relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Search
            </div>
          </Link>

          {/* Chat icon */}
          <Link to="/messages" className="group relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chat
            </div>
          </Link>
        </div>

        {/* Profile picture at bottom */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button onClick={onProfileClick} className="group relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {avatarThumbUrl ? (
                  <img src={avatarThumbUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" loading="eager" decoding="async" fetchPriority="high" />
                ) : (
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-20 bg-gradient-to-b from-purple-500 to-purple-600 border-r-2 border-blue-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>

        {/* Close button for mobile */}
        <div className="absolute top-4 right-2">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:bg-white/30"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation icons */}
        <div className="flex flex-col items-center pt-20 space-y-8">
          {/* Home icon */}
          <button className="group relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </button>

          {/* Search icon */}
          <button className="group relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </button>

          {/* Chat icon */}
          <button className="group relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Profile picture at bottom */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button onClick={onProfileClick} className="group relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {avatarThumbUrl ? (
                  <img src={avatarThumbUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" loading="eager" decoding="async" fetchPriority="high" />
                ) : (
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {session?.user?.id && (
        <ProfileSetupModal
          isOpen={isSetupOpen}
          userId={session.user.id}
          onComplete={() => {
            setIsSetupOpen(false);
            setNeedsSetup(false);
            window.location.reload();
          }}
          onClose={() => setIsSetupOpen(false)}
        />
      )}
    </>
  );
}
