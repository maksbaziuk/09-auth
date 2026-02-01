import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { fetchNotesById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface NoteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNotesById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.substring(0, 160),
    openGraph: {
      title: note.title,
      description: note.content.substring(0, 200),
      url: `https://09-auth-three-topaz.vercel.app/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

async function NoteDetailsPage({ params }: NoteProps) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNotesById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
export default NoteDetailsPage;
