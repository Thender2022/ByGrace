import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all team members
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST - Create a new team member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, quote, image, order, isActive } = body;

    // Validate required fields
    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        quote: quote || null,
        image: image || '/team/placeholder.jpg',
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ teamMember }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}