import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { productId } = await req.json();

    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from("products")
      .select("id, name, in_stock, stock_quantity")
      .eq("id", productId)
      .single();

    if (productError) throw productError;

    if (!product.in_stock || product.stock_quantity <= 0) {
      return new Response(
        JSON.stringify({ message: "Product still out of stock" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find users who want to be notified
    const { data: wishlistUsers, error: wishlistError } = await supabaseClient
      .from("wishlists")
      .select("id, user_id, notified_at")
      .eq("product_id", productId)
      .eq("notify_when_available", true)
      .is("notified_at", null);

    if (wishlistError) throw wishlistError;

    if (!wishlistUsers || wishlistUsers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users to notify" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as notified
    const userIds = wishlistUsers.map(u => u.id);
    const { error: updateError } = await supabaseClient
      .from("wishlists")
      .update({ notified_at: new Date().toISOString() })
      .in("id", userIds);

    if (updateError) throw updateError;

    // Note: Email sending would require RESEND_API_KEY
    // For now, we just mark the notification and users see it in their wishlist

    return new Response(
      JSON.stringify({
        success: true,
        notifiedCount: wishlistUsers.length,
        productName: product.name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error notifying back-in-stock:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
