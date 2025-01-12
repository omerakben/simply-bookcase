import { NextRequest, NextResponse } from 'next/server';
import { Author } from '../../types';
import { db } from '../../utils/firebase-admin';

// -- Add either or both of these lines:
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET single author
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = await db.collection('authors').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({
      firebaseKey: doc.id,
      ...doc.data()
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch author';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH update author
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data: Partial<Author> = await request.json();

    await db.collection('authors').doc(id).update({
      ...data,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, firebaseKey: id });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update author';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE author
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.collection('authors').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete author';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
