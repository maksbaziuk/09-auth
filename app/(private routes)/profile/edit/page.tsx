'use client';

import css from './EditProfilePage.module.css';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { updateMe } from '@/lib/api/clientApi';

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username || '');

  const { mutate, isPending } = useMutation({
    mutationFn: (newUsername: string) => updateMe({ username: newUsername }),
    onSuccess: updatedUser => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });

      router.push('/profile');
    },
  });

  const handleSubmit = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    if (username.trim()) {
      mutate(username);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarContainer}>
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              name="username"
              className={css.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <p className={css.emailText}>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
