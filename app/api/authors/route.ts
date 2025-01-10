import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { Author } from '../types';
import { db } from '../utils/firebase-admin';

// GET all authors for a user
export async function GET(request: Request) {
  try {
    if (!request?.url) {
      console.error('Invalid request: Missing URL');
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      console.error('Missing UID in request');
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    if (!db) {
      console.error('Database connection not initialized');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    console.log('Fetching authors for UID:', uid);
    const snapshot = await db
      .collection('authors')
      .where('uid', '==', uid)
      .get();

    console.log('Authors query result:', {
      empty: snapshot.empty,
      size: snapshot.size
    });

    const authors = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      ...doc.data(),
      firebaseKey: doc.id
    }));

    return NextResponse.json(authors);
  } catch (error: unknown) {
    console.error('Authors API Error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }
}

// POST new author
export async function POST(request: Request) {
  try {
    if (!db) {
      console.error('Database connection not initialized');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const data: Author = await request.json();
    console.log('Received author data:', {
      ...data,
      email: data.email ? '[REDACTED]' : undefined
    });

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'uid'];
    const missingFields = requiredFields.filter(field => !data[field as keyof Author]);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Add default values for optional fields
    const authorData = {
      ...data,
      image: data.image || '/author-avatar.png',
      favorite: data.favorite || false,
      createdAt: new Date().toISOString()
    };

    console.log('Creating new author with data:', {
      ...authorData,
      email: '[REDACTED]'
    });

    const docRef = await db.collection('authors').add(authorData);
    console.log('Author created successfully with ID:', docRef.id);

    const newAuthor = {
      ...authorData,
      firebaseKey: docRef.id
    };

    return NextResponse.json(newAuthor);
  } catch (error: unknown) {
    console.error('Create Author Error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'Failed to create author. Please try again.' },
      { status: 500 }
    );
  }
}
