"use client";

import { useSearchParams } from "next/navigation";

import React, { useEffect } from "react";

import { useClerk } from "@clerk/clerk-react";

import CheckoutSuccessMessage from "@/components/component/CheckoutSuccessMessage";
import { useToast } from "@/components/ui/use-toast";
import { RetrieveStripeCheckoutSession } from "@/lib/actions";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const { session } = useClerk();
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId || !session) return;
    RetrieveStripeCheckoutSession(sessionId).then(({ success, error }) => {
      if (success) {
        session?.reload();
      }

      if (error) {
        toast({
          variant: "destructive",
          description: "Failed to retrieve checkout session!",
        });
      }
    });
  }, [sessionId, session, toast]);

  return (
    <div className="flex w-100 h-screen justify-center items-center border border-red-200">
      <CheckoutSuccessMessage></CheckoutSuccessMessage>
    </div>
  );
};

export default CheckoutPage;
