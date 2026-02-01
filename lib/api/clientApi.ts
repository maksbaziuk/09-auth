import type { Note, NoteTag } from '@/types/note';
import { api } from './api';
import type { User } from '@/types/user';

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

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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

export const fetchNotesById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNote: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const res = await api.post<Note>('/notes', newNote);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (payload: LoginRequest) => {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
};

export const login = async (payload: LoginRequest) => {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const checkSession = async () => {
  const { data } = await api.get<{ success: boolean }>('/auth/session');

  return data.success;
};

export const getMe = async () => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (payload: { username: string }) => {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
};
