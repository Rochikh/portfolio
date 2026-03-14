
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- API Route: /api/chat ---
    if (url.pathname === '/api/chat') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      if (request.method !== 'POST') {
        return new Response('Method Not Allowed. This endpoint only accepts POST requests.', {
          status: 405,
          headers: corsHeaders
        });
      }

      try {
        const GEMINI_API_KEY = env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
          return new Response(JSON.stringify({ error: 'API key not configured on server.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const clientRequestBody = await request.json();
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const googleResponse = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientRequestBody),
        });

        const googleData = await googleResponse.json();

        // If the Google API returned an error, forward it to the client
        if (!googleResponse.ok) {
          return new Response(JSON.stringify(googleData), {
            status: googleResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify(googleData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error in worker.', details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // --- Static Asset Handling ---
    return env.ASSETS.fetch(request);
  },
};
