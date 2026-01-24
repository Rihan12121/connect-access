import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  tags?: string[];
  discount?: number;
}

interface UserContext {
  browsedCategories: Record<string, number>;
  purchasedCategories: string[];
  recentlyViewed: string[];
  searchQueries: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { products, userContext, limit = 8 }: { 
      products: Product[]; 
      userContext: UserContext; 
      limit?: number 
    } = await req.json();

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ recommendations: [], reasoning: "No products provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      // Fallback to rule-based if no API key
      const recommendations = getFallbackRecommendations(products, userContext, limit);
      return new Response(
        JSON.stringify({ recommendations, reasoning: "Rule-based recommendations" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context for AI
    const topCategories = Object.entries(userContext.browsedCategories || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    const prompt = `Du bist ein E-Commerce Empfehlungs-System für einen deutschen Online-Shop. 
    
Analysiere das Nutzerverhalten und wähle die ${limit} besten Produkte aus:

NUTZER-KONTEXT:
- Meistbesuchte Kategorien: ${topCategories.join(", ") || "keine"}
- Gekaufte Kategorien: ${userContext.purchasedCategories?.join(", ") || "keine"}
- Suchbegriffe: ${userContext.searchQueries?.slice(0, 5).join(", ") || "keine"}

VERFÜGBARE PRODUKTE (${products.length} total):
${products.slice(0, 50).map(p => `[${p.id}] ${p.name} (${p.category}) - ${p.price}€ ${p.discount ? `(-${p.discount}%)` : ''}`).join("\n")}

Antworte NUR mit einem JSON-Array der Produkt-IDs in der Reihenfolge der Relevanz:
["id1", "id2", "id3", ...]

Priorisiere:
1. Produkte aus bevorzugten Kategorien des Nutzers
2. Produkte mit guten Rabatten
3. Produkte die zu bisherigen Käufen passen
4. Abwechslung für Entdeckung neuer Kategorien`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", await response.text());
      const recommendations = getFallbackRecommendations(products, userContext, limit);
      return new Response(
        JSON.stringify({ recommendations, reasoning: "Fallback due to AI error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "[]";
    
    // Parse AI response
    let recommendedIds: string[] = [];
    try {
      const match = aiResponse.match(/\[[\s\S]*\]/);
      if (match) {
        recommendedIds = JSON.parse(match[0]);
      }
    } catch {
      console.error("Failed to parse AI response:", aiResponse);
    }

    // Map IDs to products
    const productMap = new Map(products.map(p => [p.id, p]));
    const recommendations = recommendedIds
      .filter(id => productMap.has(id))
      .slice(0, limit)
      .map(id => productMap.get(id)!);

    // Fill remaining slots with fallback
    if (recommendations.length < limit) {
      const fallback = getFallbackRecommendations(
        products.filter(p => !recommendedIds.includes(p.id)),
        userContext,
        limit - recommendations.length
      );
      recommendations.push(...fallback);
    }

    return new Response(
      JSON.stringify({ 
        recommendations, 
        reasoning: "AI-powered personalized recommendations" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Recommendation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getFallbackRecommendations(
  products: Product[], 
  userContext: UserContext, 
  limit: number
): Product[] {
  const recentlyViewedSet = new Set(userContext.recentlyViewed || []);
  
  // Score products
  const scored = products
    .filter(p => !recentlyViewedSet.has(p.id))
    .map(product => {
      let score = 0;
      
      // Category browsing score
      const categoryScore = userContext.browsedCategories?.[product.category] || 0;
      score += categoryScore * 10;
      
      // Purchased category boost
      if (userContext.purchasedCategories?.includes(product.category)) {
        score += 50;
      }
      
      // Discount boost
      if (product.discount && product.discount > 0) {
        score += product.discount * 0.5;
      }
      
      // Random variety
      score += Math.random() * 5;
      
      return { product, score };
    });
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit).map(s => s.product);
}
