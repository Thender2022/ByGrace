import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CategoryType, Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const where: Prisma.CategoryWhereInput = {
      isActive: true,
    };
    
    if (type && Object.values(CategoryType).includes(type as CategoryType)) {
      where.type = type as CategoryType;
    }
    
    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}