'use client';

import { Author } from '@/app/api/types';
import AuthorForm from '@/app/components/AuthorForm';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditAuthorPage() {
  const params = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`/api/authors/${params.id}`);
        if (!response.ok) {
          throw new Error('Author not found');
        }
        const data = await response.json();
        setAuthor(data);
      } catch (error) {
        console.error('Failed to fetch author:', error);
        router.push('/authors');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
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

  if (!author) {
    return null;
  }

  return (
    <div className="section_container">
      <h1 className="text-30-bold mb-8">Edit Author</h1>
      <AuthorForm initialData={author} isEditing />
    </div>
  );
}
