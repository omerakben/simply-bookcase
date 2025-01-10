import { Book } from '@/app/api/types';
import Image from 'next/image';
import Link from 'next/link';

interface BookSearchResultProps {
  book: Book & { type: 'book' };
}

export default function BookSearchResult({ book }: BookSearchResultProps) {
  return (
    <Link href={`/books/${book.firebaseKey}`} className="book-card group">
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
  );
}
