'use client';

import BookForm from '@/app/components/BookForm';

export default function NewBookPage() {
  return (
    <div className="section_container">
      <h1 className="text-30-bold mb-8">Add New Book</h1>
      <BookForm />
    </div>
  );
}
