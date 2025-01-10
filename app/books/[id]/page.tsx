'use client';

import { Author, Book } from '@/app/api/types';
import { useAuth } from '@/lib/firebase/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookAndAuthor = async () => {
      if (!user?.uid) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      setError(null);
      try {
        // Fetch book details
        const bookResponse = await fetch(`/api/books/${params.id}`);
        if (!bookResponse.ok) {
          const errorText = await bookResponse.text();
          console.error('Book API Error Response:', errorText);
          throw new Error(`Failed to fetch book: ${bookResponse.status} ${bookResponse.statusText}`);
        }

        const bookData = await bookResponse.json();

        // Verify book ownership
        if (bookData.uid !== user.uid) {
          throw new Error('You do not have permission to view this book');
        }

        setBook(bookData);

        // Fetch author details
        const authorResponse = await fetch(`/api/authors/${bookData.author_id}`);
        if (!authorResponse.ok) {
          console.error(`Failed to fetch author: ${authorResponse.status} ${authorResponse.statusText}`);
        } else {
          const authorData = await authorResponse.json();
          setAuthor(authorData);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch book details';
        console.error('Error:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndAuthor();
  }, [params.id, user?.uid]);

  const handleDelete = async () => {
    if (!user?.uid) {
      setDeleteError('Authentication required');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    setDeleteError(null);
    try {
      const response = await fetch(`/api/books/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete API Error Response:', errorText);
        throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`);
      }

      router.push('/books');
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete book';
      console.error('Error:', errorMessage);
      setDeleteError(errorMessage);
    }
  };

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
              <p className="mt-2 text-sm text-yellow-700">Please sign in to view book details.</p>
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
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section_container">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading book</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <Link
                  href="/books"
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Return to Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="section_container">
      {deleteError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error deleting book</h3>
              <p className="mt-2 text-sm text-red-700">{deleteError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-30-bold">{book.title}</h1>
          <div className="flex space-x-4">
            <Link
              href={`/books/${book.firebaseKey}/edit`}
              className="bg-primary text-black font-bold py-2 px-6 rounded-full hover:bg-primary/80 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <Image
              src={book.image && book.image.startsWith('http') ? book.image : '/bookcase-logo.png'}
              alt={book.title}
              width={500}
              height={300}
              className="rounded-lg shadow-lg object-cover w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/bookcase-logo.png';
              }}
            />
            {book.sale && (
              <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                Sale
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-20-medium">Author</h2>
              {author ? (
                <Link href={`/authors/${author.firebaseKey}`} className="text-30-bold hover:text-primary">
                  {`${author.first_name} ${author.last_name}`}
                </Link>
              ) : (
                <p className="text-30-bold text-gray-500">Author information unavailable</p>
              )}
            </div>

            <div>
              <h2 className="text-20-medium">Description</h2>
              <p className="text-16-medium text-black-100">{book.description}</p>
            </div>

            <div>
              <h2 className="text-20-medium">Price</h2>
              <p className="text-24-black">${book.price}</p>
            </div>

            {book.sale && (
              <p className="text-red-500 font-bold">This book is currently on sale!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
