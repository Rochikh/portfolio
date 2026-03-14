
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- CORS Preflight Handling ---
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- Routing ---
    // If the request is not for our API, pass it through to the static asset handler
    if (url.pathname !== '/api/chat') {
      return ctx.next();
    }

    // --- Handle POST to /api/chat ---
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed. This endpoint only accepts POST requests.', { status: 405 });
    }

    // --- Main API Logic ---
    try {
        console.log('[WORKER] API request received for /api/chat.');
        const GEMINI_API_KEY = env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) {
            console.error('[WORKER_ERROR] GEMINI_API_KEY is missing or invalid.');
            return new Response(JSON.stringify({ error: 'API key not configured on server.' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const clientRequestBody = await request.json();
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

        const googleResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientRequestBody),
        });

        if (!googleResponse.ok) {
            const errorBody = await googleResponse.text();
            console.error(`[WORKER_ERROR] Google API Error. Status: ${googleResponse.status}. Body: ${errorBody}`);
            return new Response(JSON.stringify({ error: `Google API Error: ${errorBody}` }), {
                status: googleResponse.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        const googleData = await googleResponse.json();

        return new Response(JSON.stringify(googleData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[WORKER_CATCH_ERROR] An unexpected error occurred:', error.message);
        return new Response(JSON.stringify({ error: 'Internal server error in worker.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  },
};
