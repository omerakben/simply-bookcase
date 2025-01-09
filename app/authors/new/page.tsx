'use client';

import AuthorForm from '@/app/components/AuthorForm';

export default function NewAuthorPage() {
  return (
    <div className="section_container">
      <h1 className="text-30-bold mb-8">Add New Author</h1>
      <AuthorForm />
    </div>
  );
}
