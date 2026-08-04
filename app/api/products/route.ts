import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
    });

    const formattedProducts = products.data.map((product) => {
      const price = product.default_price as Stripe.Price | null;
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images || [],
        price: price?.unit_amount ? price.unit_amount / 100 : 0,
        currency: price?.currency || 'usd',
        priceId: price?.id || null,
        metadata: product.metadata || {},
        isActive: product.active, // ✅ Changed from 'active' to 'isActive' to match frontend
        // Also add these fields that your frontend expects
        category: product.metadata?.category || null,
        tags: product.metadata?.tags ? product.metadata.tags.split(',').map(t => t.trim()) : [],
        inventoryCount: parseInt(product.metadata?.inventoryCount) || 0,
        isDigital: product.metadata?.isDigital === 'true',
        createdAt: new Date(product.created * 1000).toISOString(),
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('Error fetching products from Stripe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}