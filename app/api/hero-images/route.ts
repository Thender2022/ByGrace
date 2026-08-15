// app/api/hero-images/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all active hero images
export async function GET() {
  try {
    const heroImages = await prisma.heroImage.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ heroImages });
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero images' },
      { status: 500 }
    );
  }
}

// POST - Create a new hero image
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, altText, title, order, isActive } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const heroImage = await prisma.heroImage.create({
      data: {
        imageUrl,
        altText: altText || null,
        title: title || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ heroImage }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero image:', error);
    return NextResponse.json(
      { error: 'Failed to create hero image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a hero image
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    await prisma.heroImage.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Hero image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting hero image:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero image' },
      { status: 500 }
    );
  }
}

// PATCH - Update a hero image (for reordering or toggling)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, order, isActive, altText, title } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const heroImage = await prisma.heroImage.update({
      where: { id },
      data: {
        order: order !== undefined ? order : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        altText: altText !== undefined ? altText : undefined,
        title: title !== undefined ? title : undefined,
      },
    });

    return NextResponse.json({ heroImage });
  } catch (error) {
    console.error('Error updating hero image:', error);
    return NextResponse.json(
      { error: 'Failed to update hero image' },
      { status: 500 }
    );
  }
}