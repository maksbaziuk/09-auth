'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <h2>Error loading notes</h2>
      <p>{error.message}</p>
    </div>
  );
}
