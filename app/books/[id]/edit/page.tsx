'use client';

import { Book } from '@/app/api/types';
import BookForm from '@/app/components/BookForm';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`);
        if (!response.ok) {
          throw new Error('Book not found');
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        router.push('/books');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="section_container">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="section_container">
      <h1 className="text-30-bold mb-8">Edit Book</h1>
      <BookForm initialData={book} isEditing />
    </div>
  );
}
