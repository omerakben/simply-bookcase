'use client';

import { Author, Book } from '@/app/api/types';
import { useAuth } from '@/lib/firebase/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorAndBooks = async () => {
      if (!user?.uid) return;

      try {
        // Fetch author details
        const authorResponse = await fetch(`/api/authors/${params.id}`);
        if (!authorResponse.ok) {
          throw new Error('Author not found');
        }
        const authorData = await authorResponse.json();
        setAuthor(authorData);

        // Fetch books by this author
        const booksResponse = await fetch(`/api/books?uid=${user.uid}`);
        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          if (Array.isArray(booksData)) {
            setBooks(booksData.filter((book: Book) => book.author_id === params.id));
          } else {
            console.error('Invalid books data format:', booksData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch author details:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorAndBooks();
  }, [params.id, user?.uid]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this author?')) {
      return;
    }

    try {
      const response = await fetch(`/api/authors/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete author');
      }

      router.push('/authors');
      router.refresh();
    } catch (error) {
      console.error('Error deleting author:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

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
                onClick={() => router.back()}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="section_container">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-30-bold">
            {author.first_name} {author.last_name}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/authors/${author.firebaseKey}/edit`}
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
              src={author.image || '@author-avatar.png'}
              alt={`${author.first_name} ${author.last_name}`}
              width={500}
              height={300}
              className="rounded-lg shadow-lg object-cover w-full"
            />
            {author.favorite && (
              <span className="absolute top-4 right-4 bg-primary text-black px-4 py-2 rounded-full font-bold">
                Favorite Author
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-20-medium">Email</h2>
              <p className="text-16-medium text-black-100">{author.email}</p>
            </div>

            <div>
              <h2 className="text-20-medium">Books by this Author</h2>
              {books.length === 0 ? (
                <p className="text-16-medium text-black-100">
                  No books found for this author.
                </p>
              ) : (
                <div className="space-y-2">
                  {books.map((book) => (
                    <Link
                      key={book.firebaseKey}
                      href={`/books/${book.firebaseKey}`}
                      className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="text-16-medium">{book.title}</h3>
                      <p className="text-14-regular text-black-100">
                        ${book.price}
                        {book.sale && (
                          <span className="ml-2 text-red-500 font-bold">
                            On Sale!
                          </span>
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
