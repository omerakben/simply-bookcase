'use client';

import { useAuth } from '@/lib/firebase/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Book } from '../api/types';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      setError(null);
      try {
        const response = await fetch(`/api/books?uid=${user.uid}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch books');
        }

        console.log('Books API Response:', data);

        if (!Array.isArray(data)) {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format');
        }

        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error instanceof Error ? error.message : 'Unknown error');
        setError(error instanceof Error ? error.message : 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user?.uid]);

  if (!user) {
    return (
      <div className="section_container">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Authentication Required</h3>
              <p className="mt-2 text-sm text-yellow-700">Please sign in to view your books.</p>
              <div className="mt-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-yellow-600 hover:text-yellow-500"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading books</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
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
        <h1 className="text-30-bold">My Books</h1>
        <Link
          href="/books/new"
          className="bg-primary text-black font-bold py-2 px-6 rounded-full hover:bg-primary/80 transition-colors"
        >
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <p className="no-result">No books found. Add some books to your collection!</p>
      ) : (
        <div className="card_grid">
          {books.map((book) => (
            <Link href={`/books/${book.firebaseKey}`} key={book.firebaseKey} className="book-card group">
              <div className="relative w-full mb-4">
                <Image
                  src={book.image && book.image.startsWith('http') ? book.image : '/bookcase-logo.png'}
                  alt={book.title}
                  width={300}
                  height={164}
                  className="book-card_img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/bookcase-logo.png';
                  }}
                />
                {book.sale && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    Sale
                  </span>
                )}
              </div>
              <h3 className="text-20-medium mb-2">{book.title}</h3>
              <p className="book-card_desc">{book.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-16-medium">${book.price}</span>
                <button className="book-card_btn group-hover:bg-black">View Details</button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
