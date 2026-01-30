import type { Metadata } from 'next';
import { FetchNotes } from '@/lib/api';
import NotesFilterPage from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug[0] === 'all' ? 'All' : slug[0];

  return {
    title: `Notes: ${currentTag} | NoteHub`,
    description: `List of notes in category ${currentTag}`,
    openGraph: {
      title: `Notes: ${currentTag} | NoteHub`,
      url: `https://08-zustand-lac-seven.vercel.app/notes/filter/${slug[0]}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes: ${currentTag}`,
        },
      ],
    },
  };
}

async function FilterPage({ params }: PageProps) {
  const { slug } = await params;
  const currentTag = slug?.[0] || 'all';

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, 12, currentTag],
    queryFn: () =>
      FetchNotes({ search: '', page: 1, perPage: 12, tag: currentTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesFilterPage tag={currentTag} />
    </HydrationBoundary>
  );
}

export default FilterPage;
