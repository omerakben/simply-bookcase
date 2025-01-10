import { Author } from '@/app/api/types';
import Image from 'next/image';
import Link from 'next/link';

interface AuthorSearchResultProps {
  author: Author & { type: 'author' };
}

export default function AuthorSearchResult({ author }: AuthorSearchResultProps) {
  return (
    <Link href={`/authors/${author.firebaseKey}`} className="book-card group">
      <div className="relative w-full mb-4">
        <Image
          src={author.image && author.image.startsWith('http') ? author.image : '/author-avatar.png'}
          alt={`${author.first_name} ${author.last_name}`}
          width={300}
          height={164}
          className="book-card_img object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/author-avatar.png';
          }}
        />
      </div>
      <h3 className="text-20-medium mb-2">{`${author.first_name} ${author.last_name}`}</h3>
      <p className="book-card_desc">{author.email}</p>
      <div className="flex justify-end mt-4">
        <button className="book-card_btn group-hover:bg-black">View Profile</button>
      </div>
    </Link>
  );
}
