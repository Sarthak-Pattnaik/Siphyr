import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ProfileSetupModalProps {
  isOpen: boolean;
  userId: string;
  onComplete: () => void;
  onClose: () => void;
}

export default function ProfileSetupModal({ isOpen, userId, onComplete, onClose }: ProfileSetupModalProps) {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(()=>{console.log(userId)},[userId]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) setFile(selected);
  }, []);

  const uploadToCloudinary = useCallback(async (): Promise<string | null> => {
    if (!file) return null;
    if (!cloudName || !uploadPreset) {
      throw new Error('Missing Cloudinary configuration. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'user-avatars');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to upload image');
    }
    const data = await res.json();
    return data.secure_url as string;
  }, [cloudName, uploadPreset, file]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (!username || username.trim().length < 3) {
        throw new Error('Please enter a username with at least 3 characters.');
      }

      // Check uniqueness (allow same user to keep their username)
      const { data: existingUsers, error: countErr } = await supabase
        .from('User')
        .select('id, username')
        .eq('username', username.trim());
      if (countErr) throw countErr;
      const takenByAnother = (existingUsers ?? []).some((u) => u.id !== userId);
      if (takenByAnother) {
        throw new Error('Username is already taken. Choose another.');
      }

      const uploadedUrl = await uploadToCloudinary();

      // Upsert into Supabase User table
      const payload = {
        id: userId,
        username: username.trim(),
        profile_pic: uploadedUrl ?? null,
      };

      const { error: upsertErr } = await supabase
        .from('User')
        .upsert(payload);

      if (upsertErr) throw upsertErr;

      onComplete();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }, [userId, username, uploadToCloudinary, onComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Complete your profile</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={isSubmitting}>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Choose a unique username"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile picture</label>
            <div className="flex items-center space-x-3">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={isSubmitting} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 text-white py-2 font-medium hover:bg-purple-700 transition-colors disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}


