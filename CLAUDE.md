# Portfolio ia.rochane.fr, guide de maintenance

Site statique multi-pages de Rochane (offres, livre, ressources, articles) avec chatbot.
Ce guide fait foi : s'il diverge du site, corriger le guide. Détails annexes : `docs/NOTES.md`.

## Stack et publication

- Cloudflare Pages sur `ia.rochane.fr`, dépôt `Rochikh/portfolio`, branche `main`
  déployée à chaque merge. Aucun workflow GitHub de déploiement à recréer.
- `_worker.js` : fichiers statiques + `POST /api/chat` (Gemini, secret `GEMINI_API_KEY`).
  N'y toucher que sur demande explicite visant le chatbot ; `ALLOWED_ORIGINS` inchangé.
- Session web : push direct sur `main` bloqué, publier par PR fusionnée. `curl` vers le
  site en ligne renvoie 403 en session web : vérifier par navigateur.

## Chemins clés

- `index.html`, pages parcours (`conferences.html`, `ateliers-formations.html`,
  `accompagnement.html`, `evaluer-ia.html`), `ressources.html`, `faq.html`,
  `financement.html` (référence pour toute mention de financement), `articles/<slug>.html`.
- `styles.css` et `site.js` partagés (le widget chatbot est injecté par `site.js`).
- `knowledge.md` : dérivé des pages, **jamais édité à la main**. SYSTEM_PROMPT dans `_worker.js`.
- Hors site, ignorés par `.gitignore` : `pedago-fiches/`, `_templates/`, `crfpa/`. Tout
  nouveau dossier hors site s'inscrit dans `.gitignore`.

## Commandes

```
git fetch origin main && git checkout -B <branche> origin/main   # en début de session
python3 generate-knowledge.py . knowledge.md                     # après toute modif de contenu
```

`generate-knowledge.py` compare chaque section au dict **`EXPECTED`** et sort en code 1
sans écrire `knowledge.md` au moindre écart : corriger le HTML, ou porter le nouvel
effectif dans `EXPECTED`. Une carte infographie garde exactement
`class="infog-card reveal"` ; la BD porte `infog-card bd-card reveal`.

Vérification locale : un petit serveur Python qui mappe `/x` vers `x.html` (liens
extensionless), Playwright + Chromium en desktop et mobile. Grep de conformité avant
push : `Bruxelles Formation`, `expert`, tiret cadratin, `soundcloud|numericast`.

## Règles de fond

1. **Cache-busting** : toute modif de `styles.css` ou `site.js` incrémente `?v=N` sur
   toutes les pages (état courant : `v=11`).
2. **Compteurs** : recenser par `grep` du chiffre ET du mot sur toutes les pages. Connus :
   `.stats-card` et cartes offres de l'accueil, sous-titres des pages parcours, boutons
   de filtre, `Volume`, titres de section (en toutes lettres) et **4 copies** de la meta
   description de `ressources.html`, réponse ressources de `faq.html` (2 copies),
   `llms.txt`, `llms-full.txt`, `EXPECTED`.
3. Incohérences hors périmètre : signalées en fin de réponse, jamais corrigées d'office.
4. Changement visuel ou multi-fichiers : plan d'abord. Correction mono-fichier : direct.
5. Commits sans accents ni tirets cadratins, sans identifiant de modèle.

## Contraintes éditoriales NON NÉGOCIABLES

- Jamais « **expert IA** ». Titre : « Technopédagogue & Ambassadeur IA ».
- Jamais l'organisme « **Bruxelles Formation** » (texte, logo, métadonnées, `knowledge.md`).
- Basé en France près de Lille, actif à Bruxelles et à l'international. Jamais « basé à Bruxelles ».
- Jamais « **Certifié Qualiopi** », ni logo Qualiopi, ni « organisme de formation » pour
  Rochane. Seule formulation : interventions conventionnables par un organisme certifié
  Qualiopi (**AUTONOMIA Formation**, NDA **42 68 02034 68**), Rochane **formateur porté**.
- Jamais de promesse **CPF** ni de mention **EDOF**. Délai de trois à cinq semaines :
  **OPCO uniquement**. Catégorie d'action de la certification : ne jamais l'écrire.
- Rien d'inventé (chiffres, clients, citations, résultats). Aucun tiret cadratin.
- Préserver le livre (Chronique Sociale, 2026), Ambassadeur IA France Num, les références
  institutionnelles, outils, articles, interventions internationales.
- Écriture : skills `voix-atelier`, `filtre-anti-baratin`, `humanizer`, `ecriture-evaluation-ia`.

## Identité visuelle « copie corrigée »

`--paper #fdfdfb`, `--text #14151b`, `--accent #1d3db0`, `--rouge #cf2e2e`,
`--seyes #ccd9ec`. Bricolage Grotesque, Instrument Sans, Spline Sans Mono.
Jamais l'ancienne charte (orange `#e8520a`, crème `#f7f6f3`, Plus Jakarta Sans).
