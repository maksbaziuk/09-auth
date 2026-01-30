'use client';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateNote } from '@/lib/api';

const NoteForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully!');
      clearDraft();
      router.back();
    },
    onError: error => {
      console.error(error);
      toast.error('Failed to create note');
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setDraft({
      ...draft,
      [name]: value,
    });
  };

  const handleAction = () => {
    mutate(draft);
  };

  return (
    <form action={handleAction} className={css.form}>
      <fieldset className={css.formGroup}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className={css.formGroup}>
        <label>Content</label>
        <textarea
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className={css.formGroup}>
        <label>Tag</label>
        <select
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </fieldset>

      <fieldset className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </fieldset>
    </form>
  );
};

export default NoteForm;
