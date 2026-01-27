import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Payload = {
  sellerId: string;
  rating: number;
  comment?: string | null;
  orderId?: string | null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sellerId, rating, comment, orderId } = (await req.json()) as Payload;

    if (!sellerId) throw new Error("sellerId is required");
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) throw new Error("rating must be 1..5");

    // Service client (bypasses RLS) to validate verified purchase safely
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // User client to resolve user id from token
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: userData, error: userErr } = await anonClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    let isVerifiedPurchase = false;
    let normalizedOrderId: string | null = orderId ? String(orderId) : null;

    if (normalizedOrderId) {
      // Verify the order belongs to user and contains at least one item for that seller
      const { data: order, error: orderError } = await serviceClient
        .from("orders")
        .select("id, user_id")
        .eq("id", normalizedOrderId)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!order || order.user_id !== userId) {
        normalizedOrderId = null; // do not mark verified
      } else {
        const { data: item, error: itemErr } = await serviceClient
          .from("order_items")
          .select("id")
          .eq("order_id", normalizedOrderId)
          .eq("seller_id", sellerId)
          .limit(1)
          .maybeSingle();

        if (itemErr) throw itemErr;
        isVerifiedPurchase = Boolean(item);
        if (!isVerifiedPurchase) normalizedOrderId = null;
      }
    }

    const { error: insertErr } = await serviceClient.from("seller_ratings").insert({
      seller_id: sellerId,
      user_id: userId,
      order_id: normalizedOrderId,
      rating,
      comment: comment ?? null,
      is_verified_purchase: isVerifiedPurchase,
    });

    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-seller-rating error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
