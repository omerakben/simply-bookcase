import { NextResponse } from 'next/server';
import { Book } from '../../types';
import { db } from '../../utils/firebase-admin';

// GET single book
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const doc = await db.collection('books').doc(params.id).get();

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
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const data: Partial<Book> = await request.json();
    await db.collection('books').doc(params.id).update({
      ...data,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, firebaseKey: params.id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update book';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE book
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    await db.collection('books').doc(params.id).delete();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete book';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
