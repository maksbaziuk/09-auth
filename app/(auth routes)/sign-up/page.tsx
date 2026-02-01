'use client';

import css from './SignUpPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { register } from '@/lib/api/clientApi';

import { useAuthStore } from '@/lib/store/authStore';

import { APIError } from '@/app/api/api';

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userData = await register({ email, password });
      setUser(userData);
      router.push('/profile');
    } catch (error) {
      setError(
        (error as APIError).response?.data?.error ??
          (error as APIError).message ??
          'Registration failed. Please try again.'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        <p className={css.error}>Error</p>
      </form>
    </main>
  );
}
