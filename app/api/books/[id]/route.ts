import { NextRequest, NextResponse } from 'next/server';
import { Book } from '../../types';
import { db } from '../../utils/firebase-admin';

// GET single book
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const doc = await db.collection('books').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({
      firebaseKey: doc.id,
      ...doc.data()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch book';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH update book
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const data: Partial<Book> = await request.json();
    await db.collection('books').doc(id).update({
      ...data,
      image: data.image || '/bookcase-logo.png',
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, firebaseKey: id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update book';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE book
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    await db.collection('books').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete book';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
