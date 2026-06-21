import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, userId, planName } = await req.json();

    if (!priceId) {
      return NextResponse.json({ url: null });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: { userId, planName },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}