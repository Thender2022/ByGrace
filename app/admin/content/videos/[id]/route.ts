import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single video by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

// PUT - Update a video
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, description, youtubeId, categoryId, tags, thumbnail, isActive } = body;

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Update video
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        title: title || existingVideo.title,
        description: description !== undefined ? description : existingVideo.description,
        youtubeId: youtubeId || existingVideo.youtubeId,
        categoryId: categoryId !== undefined ? categoryId : existingVideo.categoryId,
        tags: tags || existingVideo.tags,
        thumbnail: thumbnail !== undefined ? thumbnail : existingVideo.thumbnail,
        isActive: isActive !== undefined ? isActive : existingVideo.isActive,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ video: updatedVideo });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a video
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Delete video
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}