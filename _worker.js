/*
 * Cloudflare Pages Function - Proxy pour l'API Gemini
 *
 * Ce script intercepte les requêtes faites depuis votre site,
 * y ajoute la clé API Gemini en toute sécurité côté serveur,
 * et transmet la requête à Google.
 *
 * COMMENT ÇA MARCHE :
 * 1. Ce fichier doit être nommé `_worker.js` et placé à la racine de votre projet.
 * 2. Votre code frontend (dans index.html) doit envoyer les requêtes fetch vers l'URL relative `/`,
 *    par exemple : fetch('/', { method: 'POST', ... }).
 * 3. La clé API doit être configurée dans les variables d'environnement de votre projet Cloudflare Pages.
 *    (Paramètres > Fonctions > Variables d'environnement).
 */
export default {
  async fetch(request, env, ctx) {
    // Accepter uniquement les requêtes POST
    if (request.method !== 'POST') {
      // Pour toute autre méthode, servir le site statique normalement.
      // C'est la magie des Pages Functions !
      return env.ASSETS.fetch(request);
    }

    // Gérer les en-têtes CORS pour autoriser la requête
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Vous pouvez remplacer '*' par votre domaine pour plus de sécurité
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Récupérer la clé API depuis les secrets du projet Cloudflare
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return new Response('Clé API non configurée sur le serveur.', { status: 500, headers: corsHeaders });
    }

    // Construire l'URL de l'API Gemini
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const requestBody = await request.json();

      // Transférer la requête à l'API Gemini
      const geminiResponse = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Gérer les erreurs de l'API Gemini
      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Erreur API Gemini:", errorText);
        return new Response(`Erreur de l'API Gemini: ${geminiResponse.status}`, { status: geminiResponse.status, headers: corsHeaders });
      }

      const geminiData = await geminiResponse.json();

      // Retourner la réponse de Gemini au client
      return new Response(JSON.stringify(geminiData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error("Erreur du proxy:", error);
      return new Response('Erreur interne du serveur.', { status: 500, headers: corsHeaders });
    }
  },
};
