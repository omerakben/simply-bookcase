import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { SearchResults } from '../types';
import { db } from '../utils/firebase-admin';

export async function GET(request: Request) {
  try {
    if (!request?.url) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const query = searchParams.get('q')?.toLowerCase();

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Search books
    const booksSnapshot = await db.collection('books').get();
    const books = booksSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        firebaseKey: doc.id,
        title: data.title || '',
        author_id: data.author_id || '',
        description: data.description || '',
        image: data.image || '',
        price: parseFloat(data.price) || 0,
        sale: data.sale || false,
        uid: uid,
        type: 'book' as const
      };
    }).filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query)
    );

    // Search authors
    const authorsSnapshot = await db.collection('authors').get();
    const authors = authorsSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        firebaseKey: doc.id,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        image: data.image || '',
        uid: uid,
        favorite: data.favorite || false,
        type: 'author' as const
      };
    }).filter(author =>
      `${author.first_name} ${author.last_name}`.toLowerCase().includes(query) ||
      author.email.toLowerCase().includes(query)
    );

    const results: SearchResults = {
      books,
      authors,
      query
    };

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search API Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
