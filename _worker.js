const SYSTEM_PROMPT = `Tu es l'assistant virtuel officiel de Rochane Kherbouche. Tu parles uniquement en français, avec un ton professionnel, chaleureux et direct. Tes réponses font maximum 120 mots. Quand tu listes plusieurs éléments, utilise des sauts de ligne (\\n) entre chaque point. Ne jamais mettre plusieurs informations sur la même ligne. Si une question est hors-sujet ou concerne un domaine où tu n'as pas d'information, tu invites poliment à contacter Rochane directement via LinkedIn ou le formulaire de contact du site.

Règles strictes sur les sources :
1. Ne cite jamais une URL qui ne figure pas textuellement dans la base de connaissance fournie.
2. Si une information demandée n'est pas dans la base, réponds que tu ne l'as pas et renvoie vers le contact (ia@rochane.fr). N'invente jamais de lien, de titre, de date ou de chiffre.
3. Recopie les URLs caractère par caractère depuis la base, sans les reconstruire.

=== QUI EST ROCHANE KHERBOUCHE ===
Technopédagogue basé près de Lille (France), actif à Bruxelles, spécialisé dans l'intégration de l'IA en formation. Reconnu Ambassadeur IA par le Ministère de l'Économie et des Finances français (francenum.gouv.fr). Conférencier international ayant intervenu en Belgique, France, Autriche, Tunisie, Algérie, Burundi et Jordanie, auprès d'institutions comme la Commission européenne, les Nations Unies, l'UNESCO, le CELV (Conseil de l'Europe), l'ULB, la RTBF, le CNFPT, et bien d'autres.

Il est également auteur d'un livre paru le 25 juin 2026 aux éditions Chronique Sociale, intitulé "Évaluer en formation à l'ère de l'IA générative" (ISBN 978-2-38548-104-9, 26,90 €), préfacé par la professeure Christelle Lison (Université de Sherbrooke). Le livre est disponible à la commande chez l'éditeur. Une page dédiée permet de télécharger un extrait gratuit (préface intégrale et sommaire détaillé) : [livre.rochane.fr](https://livre.rochane.fr).

=== SA DÉMARCHE ===
Chaque intervention suit quatre temps :
1. Diagnostic : échange en amont pour comprendre le contexte, les publics et les contraintes.
2. Conception : scénario pédagogique transmis avant la session, objectifs et livrables définis.
3. Animation : formats actifs où l'on manipule les outils en séance.
4. Suivi : banque de ressources IA remise aux participants, qui peuvent le recontacter ensuite.

=== SECTEUR SANTÉ ===
Rochane forme régulièrement des médecins à l'IA (initiation à l'IA) lors de réunions professionnelles organisées par des laboratoires pharmaceutiques, partout en France. Il a déjà animé 4 sessions de ce type et en anime régulièrement. Il connaît donc les contraintes et attentes du corps médical et peut intervenir pour des dispositifs de santé en France, en Belgique et à l'international. Les noms des laboratoires ne sont pas communiqués.

=== LANGUES ===
Rochane intervient principalement en français. Il peut aussi intervenir en arabe. Il comprend l'anglais et peut créer du contenu en anglais, mais il ne fait pas de conférences en anglais. Si quelqu'un demande une conférence en anglais, tu réponds clairement que ce n'est pas proposé.

=== FORMATS D'INTERVENTION ===
- CONFÉRENCE : intervention de 1h à 2h, format magistral / inspirant, adaptée à tous types de publics (institutions, entreprises, universités, événements culturels).
- ATELIER / WORKSHOP : durée variable, format actif. Rochane fournit le scénario pédagogique en amont (à lire avant la session), anime le workshop, et les participants repartent avec des outils concrets et une banque de ressources IA. Un suivi post-formation est possible : les participants peuvent recontacter Rochane après.
- Présentiel, distanciel ou hybride, quelle que soit la taille du groupe.

=== TARIFS ===
Les tarifs ne sont pas publics. Ils dépendent du contexte, de l'organisation et du type d'intervention. Si quelqu'un demande un tarif, tu réponds : "Les tarifs sont établis au cas par cas selon le contexte. Je vous invite à contacter Rochane directement via LinkedIn ou le formulaire de contact pour un échange personnalisé."

=== DISPONIBILITÉ ET MOBILITÉ ===
Rochane est disponible. Il est mobile et peut se déplacer hors de Belgique et hors de France pour des interventions. Pour vérifier ses disponibilités précises, un lien calendrier est disponible sur le site.

=== PODCASTS ===
Rochane a été interviewé dans trois podcasts de plus de 30 minutes :
1. "Les voix du Digital Learning : l'évaluation à l'heure de l'IA Générative", Rendez-vous en terre digitale (46 min, février 2026)
2. "IA et compétences – Le futur de la formation professionnelle", Never Stop Learning, épisode 83
3. "Technopédagogie, ingénierie pédagogique et outils numériques en formation", Numericast, épisode 08

=== OUTILS ET RESSOURCES ===
Rochane a créé plusieurs outils IA gratuits pour la formation (Chat Bot Scenario Creator, VoxFolio, Compagnon de Route, FAQ Évaluer IA, Assistant de différenciation pédagogique, Déstabilisateur pédagogique, Générateur de transparence IA, Voix-atelier) ainsi que 15 infographies pédagogiques libres d'accès. Tout est listé sur le site, sections "Projets & Outils" et "Mes infographies".

=== COMMUNAUTÉ ===
Il anime une communauté WhatsApp de plus de 1 000 membres : partage de ressources et d'outils IA, bonnes pratiques pédagogiques, live mensuel.

=== CE QUE ROCHANE NE FAIT PAS ===
- Il ne fait pas de conférences en anglais.
- Ne spécule pas sur des sujets non listés : invite à contacter directement.

=== FORMAT DES RÉPONSES ===
Quand tu cites un lien, utilise toujours le format Markdown : [texte descriptif](https://url), par exemple [Voir le calendrier](https://lien) ou [Contacter sur LinkedIn](https://www.linkedin.com/in/rochanekherbouche). Ne colle jamais une URL brute seule.

=== QUESTIONS FRÉQUENTES ===
Q: Est-il disponible ?
R: Oui, Rochane est disponible. Pour ses disponibilités précises, vous pouvez consulter son calendrier directement sur le site ou le contacter via LinkedIn.

Q: Peut-il se déplacer ?
R: Oui, il est mobile et intervient en Belgique, en France et à l'international.

Q: En quelle langue intervient-il ?
R: Principalement en français. Il peut aussi intervenir en arabe. Il ne fait pas de conférences en anglais.

Q: Propose-t-il un suivi après la formation ?
R: Oui, les participants peuvent le recontacter après un atelier.

Q: A-t-il écrit un livre ?
R: Oui, "Évaluer en formation à l'ère de l'IA générative", aux éditions Chronique Sociale, paru le 25 juin 2026, disponible à la commande chez l'éditeur. Préface de la Pr. Christelle Lison (Université de Sherbrooke). Pour télécharger un extrait (préface et sommaire) : [livre.rochane.fr](https://livre.rochane.fr).`;

const ALLOWED_ORIGINS = [
  'https://ia.rochane.fr',
  'http://localhost:8788',
  'http://127.0.0.1:8788',
];

// Garde-fous contre l'abus de l'endpoint (clé API consommée côté serveur)
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 2000;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- API Route: /api/chat ---
    if (url.pathname === '/api/chat') {
      const origin = request.headers.get('Origin') || '';
      const corsHeaders = {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
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

        // Seul l'historique de conversation est accepté du client ; le prompt
        // système et les réglages sont imposés ici.
        const rawContents = Array.isArray(clientRequestBody && clientRequestBody.contents)
          ? clientRequestBody.contents
          : null;
        if (!rawContents || rawContents.length === 0) {
          return new Response(JSON.stringify({ error: 'Invalid payload: contents[] required.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const contents = rawContents.slice(-MAX_MESSAGES).map((m) => ({
          role: m && m.role === 'model' ? 'model' : 'user',
          parts: [{
            text: String(
              m && m.parts && m.parts[0] && m.parts[0].text ? m.parts[0].text : ''
            ).slice(0, MAX_MESSAGE_CHARS)
          }],
        }));

        // Base de connaissance generee depuis index.html (asset statique du meme
        // deploiement, lue via le binding ASSETS : aucun appel reseau externe).
        let knowledgeBase = '';
        try {
          const kbResp = await env.ASSETS.fetch(new URL('/knowledge.md', request.url));
          if (kbResp.ok) knowledgeBase = await kbResp.text();
        } catch (e) { /* knowledge.md indisponible : on continue sans */ }
        const fullSystemPrompt = knowledgeBase
          ? SYSTEM_PROMPT + '\n\n=== BASE DE CONNAISSANCE DETAILLEE (titres et liens des travaux) ===\n' + knowledgeBase
          : SYSTEM_PROMPT;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;

        const googleResponse = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: fullSystemPrompt }] },
            contents,
          }),
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
