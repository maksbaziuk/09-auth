import type { Metadata } from 'next';
import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create a note | NoteHub',
  description: 'Page for creating a new note in your organizer.',
  openGraph: {
    title: 'Create a note | NoteHub',
    description: 'Page for creating a new note in your organizer.',
    url: 'https://09-auth-three-topaz.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: `Notes: Create note`,
      },
    ],
  },
};

function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}

export default CreateNotePage;
