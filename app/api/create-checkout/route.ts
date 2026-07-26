import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Define the cart item type
interface CartItem {
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export async function POST(request: Request) {
  try {
    const { email, items } = await request.json();

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `${item.size} | ${item.color}`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/order-confirmation`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout`,
      metadata: {
        items: JSON.stringify(items),
      },
    });

    console.log("Session created:", session.id);
    
    // ✅ Return the URL directly (this is the fix)
    return NextResponse.json({ 
      url: session.url 
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}