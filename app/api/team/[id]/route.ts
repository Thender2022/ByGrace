import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single team member by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ teamMember });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

// PUT - Update a team member
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, role, quote, image, order, isActive } = body;

    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Update team member
    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name: name || existingMember.name,
        role: role || existingMember.role,
        quote: quote !== undefined ? quote : existingMember.quote,
        image: image || existingMember.image,
        order: order !== undefined ? order : existingMember.order,
        isActive: isActive !== undefined ? isActive : existingMember.isActive,
      },
    });

    return NextResponse.json({ teamMember: updatedMember });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a team member
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Team member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}