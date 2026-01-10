import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent", "customer"],
    });

    // Get payment method details if available
    let paymentMethod = null;
    if (session.payment_intent && typeof session.payment_intent === "object") {
      const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
      if (paymentIntent.payment_method) {
        const pm = await stripe.paymentMethods.retrieve(
          typeof paymentIntent.payment_method === "string" 
            ? paymentIntent.payment_method 
            : paymentIntent.payment_method.id
        );
        paymentMethod = {
          type: pm.type,
          card: pm.card ? {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year,
          } : null,
          paypal: pm.type === "paypal" ? { email: pm.paypal?.payer_email } : null,
        };
      }
    }

    const response = {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email || session.customer_email,
      customer_name: session.customer_details?.name,
      payment_status: session.payment_status,
      status: session.status,
      shipping_address: session.shipping_details?.address,
      shipping_name: session.shipping_details?.name,
    line_items: session.line_items?.data.map((item: Stripe.LineItem) => ({
      description: item.description,
      quantity: item.quantity,
      amount_total: item.amount_total,
    })),
      payment_method: paymentMethod,
      created: session.created,
      metadata: session.metadata,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
