import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VAT_RATE = 0.19; // German VAT rate

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Order ID required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("id, user_id, total, shipping_address, created_at")
      .eq("id", orderId)
      .single();

    if (orderError) throw orderError;

    // Check if invoice already exists
    const { data: existingInvoice } = await supabaseClient
      .from("invoices")
      .select("id, invoice_number")
      .eq("order_id", orderId)
      .single();

    if (existingInvoice) {
      return new Response(
        JSON.stringify({
          success: true,
          invoice: existingInvoice,
          message: "Invoice already exists",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate invoice number using database function
    const { data: invoiceNumber, error: numError } = await supabaseClient
      .rpc("generate_invoice_number");

    if (numError) throw numError;

    // Calculate VAT
    const total = Number(order.total);
    const netAmount = total / (1 + VAT_RATE);
    const vatAmount = total - netAmount;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from("invoices")
      .insert({
        order_id: orderId,
        invoice_number: invoiceNumber,
        user_id: order.user_id,
        subtotal: netAmount,
        vat_amount: vatAmount,
        total: total,
        status: "pending",
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    return new Response(
      JSON.stringify({
        success: true,
        invoice: {
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          subtotal: invoice.subtotal,
          vat_amount: invoice.vat_amount,
          total: invoice.total,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error generating invoice:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
