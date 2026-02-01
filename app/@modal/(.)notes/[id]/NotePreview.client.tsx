'use client';

import { useQuery } from '@tanstack/react-query';
import css from './NotePreview.module.css';
import { fetchNotesById } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';

interface NotePreviewClientProps {
  id: string;
}

function NotePreview({ id }: NotePreviewClientProps) {
  const router = useRouter();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNotesById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <button className={css.backBtn} onClick={handleClose}>
        Back
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note?.content}</p>
          <p className={css.date}>
            {new Date(note.createdAt).toLocaleDateString()}
          </p>
          <p className={css.tag}>{note.tag}</p>
        </div>
      </div>
    </Modal>
  );
}

export default NotePreview;
