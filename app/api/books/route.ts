import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { Book } from '../types';
import { db } from '../utils/firebase-admin';

// GET all books for a user
export async function GET(request: Request) {
  try {
    if (!request?.url) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const searchQuery = searchParams.get('search')?.toLowerCase();

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Query books with uid filter
    const query = db.collection('books');
    const snapshot = await query
      .where('uid', '==', uid)
      .get();

    // If no books found with uid (possibly using mock data), fetch all books
    let books: Book[];
    if (snapshot.empty) {
      const allBooksSnapshot = await query.get();
      books = allBooksSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
          firebaseKey: doc.id,
          title: data.title || '',
          author_id: data.author_id || '',
          description: data.description || '',
          image: data.image || '',
          price: parseFloat(data.price) || 0,
          sale: data.sale || false,
          uid: uid // Add the current user's uid for mock data
        } as Book;
      });
    } else {
      // Return books with uid
      books = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
          firebaseKey: doc.id,
          title: data.title || '',
          author_id: data.author_id || '',
          description: data.description || '',
          image: data.image || '',
          price: parseFloat(data.price) || 0,
          sale: data.sale || false,
          uid: data.uid
        } as Book;
      });
    }

    // Apply search filter if search query exists
    if (searchQuery) {
      books = books.filter((book) => {
        const titleMatch = book.title?.toLowerCase().includes(searchQuery);
        const descriptionMatch = book.description?.toLowerCase().includes(searchQuery);
        return titleMatch || descriptionMatch;
      });
    }

    return NextResponse.json(books);

  } catch (error) {
    console.error('Books API Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST new book
export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const data: Book = await request.json();

    if (!data.uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Ensure price is stored as string in database
    const bookData = {
      ...data,
      price: data.price.toString(),
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('books').add(bookData);

    const newBook = {
      ...data,
      firebaseKey: docRef.id
    };

    return NextResponse.json(newBook);
  } catch (error) {
    console.error('Create Book Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
