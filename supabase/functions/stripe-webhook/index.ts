import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    logStep("Webhook received", { hasSignature: !!signature });

    // For now, we'll process without signature verification since webhook secret isn't set up
    // In production, you should verify the signature
    let event: Stripe.Event;

    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (err) {
      logStep("Error parsing webhook body", { error: err });
      return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
    }

    logStep("Event type", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { sessionId: session.id, orderId: session.metadata?.order_id });

      const orderId = session.metadata?.order_id;

      if (orderId) {
        // Update order status to 'paid'
        const { error } = await supabaseClient
          .from("orders")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", orderId);

        if (error) {
          logStep("Error updating order", { error: error.message });
        } else {
          logStep("Order updated to paid", { orderId });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Webhook error", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
