import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all videos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST - Create a new video
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, youtubeId, description, tags, isActive } = body;

    // Check if video already exists
    const existingVideo = await prisma.video.findUnique({
      where: { youtubeId },
    });

    if (existingVideo) {
      return NextResponse.json(
        { error: "A video with this YouTube ID already exists." },
        { status: 409 }
      );
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

    const video = await prisma.video.create({
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

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}