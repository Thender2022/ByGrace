import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - all videos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('GET /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST - create video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtubeId, categoryId, tags } = body;

    if (!title || !youtubeId) {
      return NextResponse.json(
        { error: 'Title and YouTube ID are required' },
        { status: 400 }
      );
    }

    // ✅ Validate categoryId
    const validCategoryId = categoryId && categoryId.trim() !== '' ? categoryId.trim() : null;

    // ✅ Verify the category exists (if provided)
    if (validCategoryId) {
      const existingCategory = await prisma.category.findUnique({
        where: { id: validCategoryId },
      });
      if (!existingCategory) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
    }

    const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        youtubeId,
        categoryId: validCategoryId,
        tags: tags || [],
        thumbnail,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error('POST /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

// PATCH - update video status
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const video = await prisma.video.update({
      where: { id },
      data: { isActive },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('PATCH /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE - remove video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}