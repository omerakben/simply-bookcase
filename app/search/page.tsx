'use client';

import { Author, Book } from '@/app/api/types';
import AuthWarning from '@/app/components/AuthWarning';
import ErrorMessage from '@/app/components/ErrorMessage';
import AuthorSearchResult from '@/app/components/search/AuthorSearchResult';
import BookSearchResult from '@/app/components/search/BookSearchResult';
import { useAuth } from '@/lib/firebase/useAuth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type SearchResults = {
  books: (Book & { type: 'book' })[];
  authors: (Author & { type: 'author' })[];
  query: string;
};

export default function SearchPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user?.uid || !query) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/search?uid=${user.uid}&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch search results');
        }

        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setError(error instanceof Error ? error.message : 'Failed to perform search');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, user?.uid]);

  if (!user) {
    return (
      <div className="section_container">
        <AuthWarning message="Please sign in to search." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="section_container">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section_container">
        <ErrorMessage
          title="Search Error"
          message={error}
          action={{
            label: 'Try again',
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const { books, authors } = results;
  const hasResults = books.length > 0 || authors.length > 0;

  return (
    <div className="section_container">
      <h1 className="text-30-bold mb-8">Search Results for "{query}"</h1>

      {!hasResults ? (
        <p className="no-result">No results found for "{query}"</p>
      ) : (
        <div className="space-y-12">
          {books.length > 0 && (
            <div>
              <h2 className="text-24-black mb-6">Books</h2>
              <div className="card_grid">
                {books.map((book) => (
                  <BookSearchResult key={book.firebaseKey} book={book} />
                ))}
              </div>
            </div>
          )}

          {authors.length > 0 && (
            <div>
              <h2 className="text-24-black mb-6">Authors</h2>
              <div className="card_grid">
                {authors.map((author) => (
                  <AuthorSearchResult key={author.firebaseKey} author={author} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
