'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './SignInPage.module.css';

import { login } from '@/lib/api/clientApi';

import { useAuthStore } from '@/lib/store/authStore';

import type { APIError } from '@/app/api/api';

const SignIn = () => {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (formData: FormData) => {
    try {
      const user = await login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });

      if (user) {
        setUser(user);
        router.push('/profile');
      } else {
        setError('Oops... Something went wrong');
      }
    } catch (error) {
      setError(
        (error as APIError).response?.data?.error ??
          (error as APIError).message ??
          'Oops... Something went wrong'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <form action={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

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
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
};

export default SignIn;
