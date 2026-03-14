
export default {
  async fetch(request, env, ctx) {
    // --- CORS Preflight ---
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // In production, should be your domain
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // We only want to handle POST requests
    if (request.method !== 'POST') {
      return new Response('Please send a POST request', { status: 405 });
    }

    try {
        // --- 1. Check for API Key ---
        console.log('[WORKER] Function execution started.');
        const GEMINI_API_KEY = env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) { // Basic check
            console.error('[WORKER_ERROR] GEMINI_API_KEY is missing or invalid.');
            return new Response(JSON.stringify({ error: 'API key not configured correctly on the server.' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        console.log('[WORKER] GEMINI_API_KEY found.');

        // --- 2. Prepare Google API Request ---
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        const clientRequestBody = await request.json();

        // --- 3. Call Google API ---
        console.log('[WORKER] Forwarding request to Google Gemini API...');
        const googleResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientRequestBody),
        });

        // --- 4. Handle Google API Response ---
        if (!googleResponse.ok) {
            const errorBody = await googleResponse.text();
            console.error(`[WORKER_ERROR] Google API returned an error. Status: ${googleResponse.status}. Body: ${errorBody}`);
            return new Response(JSON.stringify({ error: `Google API Error: ${errorBody}` }), {
                status: googleResponse.status, // Proxy the status
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        console.log('[WORKER] Successfully received response from Google API.');
        const googleData = await googleResponse.json();

        // --- 5. Return Success Response to Client ---
        return new Response(JSON.stringify(googleData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        // --- Global Error Handler ---
        console.error('[WORKER_CATCH_ERROR] An unexpected error occurred:', error.message, error.stack);
        return new Response(JSON.stringify({ error: 'An internal server error occurred in the worker.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  },
};
