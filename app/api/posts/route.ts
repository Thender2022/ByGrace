import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if category exists, if not create it
    let categoryId = null;
    if (body.category) {
      const category = await prisma.category.upsert({
        where: { name: body.category },
        update: {},
        create: {
          name: body.category,
          slug: body.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          type: "POST",
        },
      });
      categoryId = category.id;
    }

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content: body.content,
        excerpt: body.excerpt || null,
        categoryId: categoryId || null,
        tags: body.tags || [],
        status: body.status || "Draft",
        featured: body.featured || false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}