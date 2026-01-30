import axios, { type AxiosInstance } from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${API_KEY}` },
});

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

export const FetchNotes = async (
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

export const FetchNotesById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const CreateNote = async (newNote: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const res = await api.post<Note>('/notes', newNote);
  return res.data;
};

export const DeleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
