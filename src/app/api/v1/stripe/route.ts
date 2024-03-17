import { headers } from "next/headers";

import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Missing Stripe signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.log(err);
    return new Response("Invalid stripe webhook request", { status: 400 });
  }

  const eventType = event.type;

  switch (eventType) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(`Checkout session completed - Session ID: ${session.id}`);
      console.log(`Checkout session completed - Session: ${session}`);
      break;

    default:
      console.log(`Unhandled event type ${eventType}`);
      break;
  }

  return new Response("OK", { status: 200 });
}
