import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch single video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    console.log("📹 GET - Fetching video with ID:", videoId);

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        category: true,
      },
    });

    if (!video) {
      console.log("📹 Video not found with ID:", videoId);
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    console.log("📹 Video found:", video.title);
    return NextResponse.json({ video });
  } catch (error) {
    console.error("📹 Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

// PUT - Update a video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    console.log("📹 PUT - Updating video with ID:", videoId);

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, category, youtubeId, description, tags, isActive } = body;

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Check if another video has this YouTube ID
    if (youtubeId && youtubeId !== existingVideo.youtubeId) {
      const duplicateVideo = await prisma.video.findUnique({
        where: { youtubeId },
      });

      if (duplicateVideo) {
        return NextResponse.json(
          { error: "A video with this YouTube ID already exists." },
          { status: 409 }
        );
      }
    }

    // Handle category
    let categoryId = null;
    if (category) {
      const categoryRecord = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: {
          name: category,
          slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          type: "VIDEO",
        },
      });
      categoryId = categoryRecord.id;
    }

    // Generate thumbnail URL
    const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        title,
        youtubeId,
        description: description || null,
        categoryId,
        tags: tags || [],
        thumbnail,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        category: true,
      },
    });

    console.log("📹 Video updated:", video.title);
    return NextResponse.json({ video });
  } catch (error) {
    console.error("📹 Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    console.log("📹 PATCH - Updating video with ID:", videoId);

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const video = await prisma.video.update({
      where: { id: videoId },
      data: body,
      include: {
        category: true,
      },
    });

    console.log("📹 Video patched:", video.title);
    return NextResponse.json({ video });
  } catch (error) {
    console.error("📹 Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    console.log("📹 DELETE - Deleting video with ID:", videoId);

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    await prisma.video.delete({
      where: { id: videoId },
    });

    console.log("📹 Video deleted:", videoId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("📹 Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}