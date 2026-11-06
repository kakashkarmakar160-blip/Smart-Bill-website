// Optional server-side authentication starter.
// Deploy as a Supabase Edge Function and replace the demo-only client password gate.
// For production, use Supabase Auth users and role-based RLS rather than a shared password.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  return new Response(JSON.stringify({
    error: "Configure Supabase Auth and an owner account before enabling production login."
  }), { status: 501, headers: { "content-type": "application/json" } });
});
