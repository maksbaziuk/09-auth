import axios, { AxiosError } from 'axios';

export type APIError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});
