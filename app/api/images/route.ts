import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all images
export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST - Create a new image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, imageUrl, description, tags, isActive } = body;

    // Handle category
    let categoryId = null;
    if (category) {
      const categoryRecord = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: {
          name: category,
          slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          type: "IMAGE",
        },
      });
      categoryId = categoryRecord.id;
    }

    const image = await prisma.image.create({
      data: {
        title,
        imageUrl,
        description: description || null,
        categoryId,
        tags: tags || [],
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    );
  }
}