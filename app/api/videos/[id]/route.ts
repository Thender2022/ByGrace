import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - update video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, youtubeId, categoryId, tags, isActive } = body;

    // ✅ If categoryId is empty string or invalid, set to null
    const validCategoryId = categoryId && categoryId.trim() !== '' ? categoryId.trim() : null;

    // ✅ Verify the category exists before updating (if a categoryId is provided)
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

    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        description: description || null,
        youtubeId,
        categoryId: validCategoryId,
        tags: tags || [],
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// PATCH - update video status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    const video = await prisma.video.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE - remove video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.video.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}