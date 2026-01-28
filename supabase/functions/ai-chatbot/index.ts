import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation
const MAX_MESSAGE_LENGTH = 5000;

interface ChatRequest {
  message: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !claims?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    const body: ChatRequest = await req.json();
    
    if (!body.message || typeof body.message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize and limit message length
    const sanitizedMessage = body.message.trim().slice(0, MAX_MESSAGE_LENGTH);
    
    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get AI API URL from secrets
    const aiApiUrl = Deno.env.get("AI_API_URL");
    if (!aiApiUrl) {
      console.error("AI_API_URL not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Forward request to AI backend
    const response = await fetch(`${aiApiUrl}/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ message: sanitizedMessage }),
    });

    if (!response.ok) {
      console.error(`AI API error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ reply: data.reply || "No response received" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
