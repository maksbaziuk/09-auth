import type { Note } from '@/types/note';
import { api } from './api';
import type { User } from '@/types/user';
import { cookies } from 'next/headers';

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { search, page = 1, perPage = 12, tag } = params;
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: {
      ...(search ? { search } : {}),
      ...(tag && tag !== 'all' ? { tag } : {}),
      page,
      perPage,
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getMeServer = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
