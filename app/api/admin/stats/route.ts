import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    // Get all products (both active and inactive)
    const products = await stripe.products.list({
      limit: 100,
    });

    // Get all successful payments - use 'charge.succeeded' or filter by status
    const payments = await stripe.paymentIntents.list({
      limit: 100,
    });

    // Filter for succeeded payments only
    const succeededPayments = payments.data.filter(
      payment => payment.status === 'succeeded'
    );

    // Calculate total revenue (sum of all successful payments)
    const totalRevenue = succeededPayments.reduce((sum, payment) => {
      return sum + (payment.amount_received || 0);
    }, 0);

    // For videos - you might store these in your database
    // For now, we'll return 0 or you can fetch from your database
    const totalVideos = 0; // Replace with your actual video count

    return NextResponse.json({
      totalProducts: products.data.length,
      totalOrders: succeededPayments.length,
      totalVideos: totalVideos,
      revenue: totalRevenue / 100, // Convert from cents to dollars
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}