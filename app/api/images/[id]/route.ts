import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch single image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: imageId } = await params;
    
    console.log("🖼️ GET - Fetching image with ID:", imageId);

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        category: true,
      },
    });

    if (!image) {
      console.log("🖼️ Image not found with ID:", imageId);
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    console.log("🖼️ Image found:", image.title);
    return NextResponse.json({ image });
  } catch (error) {
    console.error("🖼️ Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

// PUT - Update an image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: imageId } = await params;
    
    console.log("🖼️ PUT - Updating image with ID:", imageId);

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, category, imageUrl, description, tags, isActive } = body;

    // Check if image exists
    const existingImage = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
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
          type: "IMAGE",
        },
      });
      categoryId = categoryRecord.id;
    }

    const updatedImage = await prisma.image.update({
      where: { id: imageId },
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

    console.log("🖼️ Image updated:", updatedImage.title);
    return NextResponse.json({ image: updatedImage });
  } catch (error) {
    console.error("🖼️ Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
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
    const { id: imageId } = await params;
    
    console.log("🖼️ PATCH - Updating image with ID:", imageId);

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: body,
      include: {
        category: true,
      },
    });

    console.log("🖼️ Image patched:", updatedImage.title);
    return NextResponse.json({ image: updatedImage });
  } catch (error) {
    console.error("🖼️ Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: imageId } = await params;
    
    console.log("🖼️ DELETE - Deleting image with ID:", imageId);

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    await prisma.image.delete({
      where: { id: imageId },
    });

    console.log("🖼️ Image deleted:", imageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🖼️ Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}