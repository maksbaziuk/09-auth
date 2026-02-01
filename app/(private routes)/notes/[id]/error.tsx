'use client';

interface ErrorProps {
  error: Error;
}

function ErrorDetails({ error }: ErrorProps) {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
    </div>
  );
}

export default ErrorDetails;
