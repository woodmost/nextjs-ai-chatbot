import Stripe from "stripe";

declare const global: Global & { stripe: Stripe };

export let stripe: Stripe;

if (typeof window === "undefined") {
  if (process.env["NODE_ENV"] === "production") {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2023-10-16",
    });
  } else {
    if (!global.stripe) {
      global.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2023-10-16",
      });
    }
    stripe = global.stripe;
  }
}
