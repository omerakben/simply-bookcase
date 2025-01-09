'use client';

import { Author } from '@/app/api/types';
import { useAuth } from '@/lib/firebase/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAuthors = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/authors?uid=${user.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error('Error fetching authors:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="section_container">
        <div className="card_grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="book-card_skeleton animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section_container">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section_container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-30-bold">Authors</h1>
        <Link
          href="/authors/new"
          className="bg-primary text-black font-bold py-2 px-6 rounded-full hover:bg-primary/80 transition-colors"
        >
          Add New Author
        </Link>
      </div>

      {authors.length === 0 ? (
        <p className="no-result">No authors found. Add some authors to your collection!</p>
      ) : (
        <div className="card_grid">
          {authors.map((author) => (
            <Link
              href={`/authors/${author.firebaseKey}`}
              key={author.firebaseKey}
              className="book-card group"
            >
              <div className="relative w-full mb-4">
                <Image
                  src={author.image && author.image.startsWith('http') ? author.image : '/default-avatar.png'}
                  alt={`${author.first_name} ${author.last_name}`}
                  width={300}
                  height={164}
                  className="book-card_img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
                {author.favorite && (
                  <span className="absolute top-2 right-2 bg-primary text-black px-2 py-1 rounded-full text-sm font-bold">
                    Favorite
                  </span>
                )}
              </div>
              <h3 className="text-20-medium mb-2">
                {author.first_name} {author.last_name}
              </h3>
              <p className="text-16-medium text-black-100">{author.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
