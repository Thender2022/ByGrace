import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    
    // Parse JSON fields safely with error handling
    const parsed = products.map((p) => {
      let images = [];
      let tags = [];
      let metadata = null;
      
      try {
        images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      } catch {
        images = [];
      }
      
      try {
        tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
      } catch {
        tags = [];
      }
      
      try {
        metadata = p.metadata ? (typeof p.metadata === 'string' ? JSON.parse(p.metadata) : p.metadata) : null;
      } catch {
        metadata = null;
      }
      
      return {
        ...p,
        images,
        tags,
        metadata,
      };
    });
    
    return NextResponse.json({ products: parsed });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      currency, 
      images, 
      category, 
      tags, 
      inventoryCount, 
      isDigital
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        stripeProductId: `pending_${Date.now()}`,
        stripePriceId: `pending_${Date.now()}`,
        name,
        description: description || null,
        price: parseFloat(price) || 0,
        currency: currency || 'usd',
        images: JSON.stringify(images || []),
        category: category || null,
        tags: JSON.stringify(tags || []),
        inventoryCount: parseInt(inventoryCount) || 0,
        isDigital: isDigital || false,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PATCH - update product status
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('PATCH /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - remove product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}