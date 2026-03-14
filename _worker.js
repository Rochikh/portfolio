
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

    // --- Routing: We only care about /api/chat ---
    if (url.pathname !== '/api/chat') {
        // This is not the chat API, so it's a request for a resource that wasn't found.
        // The static assets are served by Pages before the worker runs.
        return new Response(`Not Found. This worker only handles POST requests to /api/chat. You tried to access ${url.pathname}`, { status: 404 });
    }

    // --- Handle POST to /api/chat ---
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed. Please send a POST request to /api/chat.', { status: 405 });
    }

    // --- Main API Logic from here ---
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
        console.log('[WORKER] GEMINI_API_KEY found.');

        const clientRequestBody = await request.json();
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

        console.log('[WORKER] Forwarding request to Google Gemini API...');
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
        
        console.log('[WORKER] Successfully received response from Google API.');
        const googleData = await googleResponse.json();

        return new Response(JSON.stringify(googleData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[WORKER_CATCH_ERROR] An unexpected error occurred:', error.message, error.stack);
        return new Response(JSON.stringify({ error: 'Internal server error in worker.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  },
};
