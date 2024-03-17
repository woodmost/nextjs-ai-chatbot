/* eslint-disable no-unused-vars */
import React from "react";

import { loadStripe } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { CreateStripeCheckoutSession } from "@/lib/actions";

interface SubscriptionDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  modal?: boolean;
}

const subscriptionPlans = [
  {
    name: "Get More Points",
    id: "Premium",
    href: "#",
    price: { monthly: "$5" },
    description: "Support your team and get more points.",
    features: ["100 Points", "Covers 100 conversations"],
  },
];

const asyncStripe = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const SubscriptionDialog = (props: SubscriptionDialogProps) => {
  const { toast } = useToast();
  const handleSubmit = async () => {
    const lineItems = [
      {
        price: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIERE_API_ID,
        quantity: 1,
      },
    ];
    try {
      const { error, sessionId } = await CreateStripeCheckoutSession(lineItems);

      if (!sessionId || error) {
        throw new Error("Failed to create checkout session");
      }

      const stripe = await asyncStripe;

      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const { error: StripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (StripeError) {
        if (StripeError instanceof Error) {
          throw new Error(StripeError.message);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error?.message || "Something went wrong.",
      });
    }
  };
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Plans & Pricing</DialogTitle>
        </DialogHeader>
        {subscriptionPlans.map((plan) => (
          <div className="grid gap-4 py-8 text-center" key={plan.id}>
            <div className="-ml-12 text-xl font-bold"> {plan.id}</div>
            <div className="mb-8">
              <span className="text-6xl font-bold">{plan.price.monthly}</span>
              <span className="font-bold">/ month</span>
            </div>
            {plan.features.map((feature) => (
              <ul
                className="w-3/4 ml-4 list-disc font-medium text-sm text-left text-gray-400"
                key={feature}
              >
                <li>{feature}</li>
              </ul>
            ))}
          </div>
        ))}
        <DialogFooter>
          <Button
            className="w-1/2 mx-auto"
            type="submit"
            onClick={handleSubmit}
          >
            Start Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
