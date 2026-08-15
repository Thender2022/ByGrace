import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      where: {
        isSlideshow: true,
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching slideshow images:", error);
    return NextResponse.json(
      { error: "Failed to fetch slideshow images" },
      { status: 500 }
    );
  }
}