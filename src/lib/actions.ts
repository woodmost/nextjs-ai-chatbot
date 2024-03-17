"use server";

import { clerkClient, currentUser } from "@clerk/nextjs";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN as string;

export async function AddFreePoints() {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: true,
      message: "You need to sign in first.",
    };
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      points: process.env.CLERK_INIT_POINTS as string,
    },
  });

  return {
    success: true,
    error: null,
    message: "Get Free Trial!",
  };
}

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem[] | undefined;

export async function CreateStripeCheckoutSession(lineItems: LineItem) {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: true,
      message: "You need to sign in first.",
    };
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "subscription",
    success_url: `${DOMAIN}/checkout?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: DOMAIN,
    customer_email: user.emailAddresses[0].emailAddress,
  });

  return {
    error: null,
    sessionId: session.id,
  };
}

export async function RetrieveStripeCheckoutSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: "No session ID provided." };
  }

  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You need to sign in first first." };
  }

  const previousCheckoutSessionIds = Array.isArray(
    user.publicMetadata.checkoutSessionIds,
  )
    ? user.publicMetadata.checkoutSessionIds
    : [];

  if (previousCheckoutSessionIds.includes(sessionId)) {
    return {
      success: true,
      error: null,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  console.log("session", session);
  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      points: process.env.CLERK_PREMIUM_POINTS,
      checkoutSessionIds: [...previousCheckoutSessionIds, sessionId],
      stripeCustomerId: session.customer,
      stripeSubscriptionId:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id,
      stripeCurrentPeriodEnd:
        typeof session.subscription === "string"
          ? undefined
          : session.subscription?.current_period_end,
    },
  });

  return { success: true, error: null };
}
