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

    // Find products with low stock
    const { data: allProducts, error: productsError } = await supabaseClient
      .from("products")
      .select("id, name, stock_quantity, low_stock_threshold")
      .gt("stock_quantity", 0);

    if (productsError) throw productsError;

    // Filter products where stock <= threshold
    const lowStockProducts = allProducts?.filter(p => 
      p.stock_quantity !== null && 
      p.low_stock_threshold !== null && 
      p.stock_quantity <= p.low_stock_threshold
    ) || [];

    if (productsError) throw productsError;

    if (!lowStockProducts || lowStockProducts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No low stock products found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get admin users
    const { data: admins } = await supabaseClient
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    const adminIds = admins?.map(a => a.user_id) || [];

    // Get admin profiles for emails
    const { data: adminProfiles } = await supabaseClient
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", adminIds);

    // Check which products already have notifications sent today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingNotifications } = await supabaseClient
      .from("stock_notifications")
      .select("product_id")
      .gte("sent_at", today);

    const notifiedProductIds = new Set(existingNotifications?.map(n => n.product_id) || []);

    // Filter products that haven't been notified today
    const productsToNotify = lowStockProducts.filter(p => !notifiedProductIds.has(p.id));

    if (productsToNotify.length === 0) {
      return new Response(
        JSON.stringify({ message: "All low stock products already notified today" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log notifications (email sending would require RESEND_API_KEY)
    const notifications = productsToNotify.map(product => ({
      product_id: product.id,
      sent_to: "admin-dashboard",
      stock_level: product.stock_quantity,
    }));

    const { error: notifyError } = await supabaseClient
      .from("stock_notifications")
      .insert(notifications);

    if (notifyError) throw notifyError;

    // Return the low stock products for dashboard notification
    return new Response(
      JSON.stringify({
        success: true,
        lowStockCount: productsToNotify.length,
        products: productsToNotify.map(p => ({
          id: p.id,
          name: p.name,
          stock: p.stock_quantity,
          threshold: p.low_stock_threshold,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error checking low stock:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
