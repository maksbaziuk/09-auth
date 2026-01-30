'use client';
import Link from 'next/link';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesPage.module.css';
import Pagination from '@/components/Pagination/Pagination';

interface NotesFilterPageProps {
  tag: string;
}

function NotesFilterClient({ tag }: NotesFilterPageProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const tagForApi = tag === 'all' ? undefined : tag;

  const { data } = useQuery({
    queryKey: ['notes', search, page, 12, tag],
    queryFn: () => FetchNotes({ search, page, perPage: 12, tag: tagForApi }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const debounceSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setPage(1);
    },
    1000
  );

  const totalPages = data?.totalPages || 0;

  return (
    <div>
      <div className={css.toolbar}>
        <SearchBox search={search} onChange={debounceSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>
      <NoteList notes={data?.notes || []} />
    </div>
  );
}

export default NotesFilterClient;
