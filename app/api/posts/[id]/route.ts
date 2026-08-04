import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    
    console.log("📝 GET - Fetching post with ID:", postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        category: true,
      },
    });

    if (!post) {
      console.log("📝 Post not found with ID:", postId);
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    console.log("📝 Post found:", post.title);
    return NextResponse.json({ post });
  } catch (error) {
    console.error("📝 Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    
    console.log("📝 PUT - Updating post with ID:", postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, category, status, content, excerpt, tags, featured } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
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
          type: "POST",
        },
      });
      categoryId = categoryRecord.id;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content,
        excerpt: excerpt || null,
        categoryId,
        tags: tags || [],
        status: status || "Draft",
        featured: featured || false,
      },
      include: {
        category: true,
      },
    });

    console.log("📝 Post updated:", updatedPost.title);
    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("📝 Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// PATCH - Update status or featured
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    
    console.log("📝 PATCH - Updating post with ID:", postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: body,
      include: {
        category: true,
      },
    });

    console.log("📝 Post patched:", updatedPost.title);
    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("📝 Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    
    console.log("📝 DELETE - Deleting post with ID:", postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    console.log("📝 Post deleted:", postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("📝 Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}