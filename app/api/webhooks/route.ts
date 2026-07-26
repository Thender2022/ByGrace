import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`✅ Webhook received: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`🎉 Payment successful! Session ID: ${session.id}`);
      console.log(`📧 Customer: ${session.customer_email}`);
      console.log(`💰 Amount: $${(session.amount_total! / 100).toFixed(2)}`);
      // TODO: Update your database, send confirmation email, etc.
      break;
    }
    case "payment_intent.succeeded": {
      console.log("💰 Payment intent succeeded!");
      break;
    }
    case "charge.succeeded": {
      console.log("💳 Charge succeeded!");
      break;
    }
    default:
      console.log(`📋 Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}