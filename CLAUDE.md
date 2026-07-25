# Portfolio ia.rochane.fr, guide de maintenance

Ce fichier est lu au démarrage de chaque session Claude Code (local, Code Server, web).
Il fait foi. Si le site et ce guide divergent, corrige le guide.

## Vue d'ensemble

- Site statique servi par **Cloudflare Pages** sur `ia.rochane.fr` (`rochane.fr` redirige).
  Dépôt GitHub `Rochikh/portfolio`. Cloudflare déploie la branche `main` à chaque merge.
- `_worker.js` = Cloudflare Pages Function : sert les fichiers statiques et l'endpoint
  `POST /api/chat` (chatbot Gemini, clé `GEMINI_API_KEY` en secret côté serveur, jamais
  exposée au navigateur). CNAME = `ia.rochane.fr`.

## Architecture (multi-pages, ce n'est PAS un mono-page)

- `index.html` : accueil conversion (hero, offres, livre, démarche, preuves, projets
  phares, sélection ressources, contact).
- Pages parcours : `conferences.html`, `ateliers-formations.html`, `accompagnement.html`,
  `evaluer-ia.html`.
- `ressources.html` : bibliothèque complète filtrable (outils, infographies, articles,
  webinaires, podcasts).
- `articles/<slug>.html` : articles de fond.
- `mentions-legales.html`, `livre3d.html` (couverture 3D en iframe, `noindex`).
- **Assets partagés** : `styles.css` et `site.js`, référencés par toutes les pages. Le
  widget chatbot est injecté par `site.js`. CSS et JS ne sont plus inline.
- SEO : `sitemap.xml`, `robots.txt`, `og-image.jpg` (1200x630). JSON-LD par page
  (Person `#person`, WebSite `#website`, plus WebPage / Service / Book / Article /
  CollectionPage selon la page).

## Chaîne de contenu du chatbot (à ne pas oublier)

Les pages HTML sont la **source de vérité**. `knowledge.md` en est un **dérivé**, jamais
édité à la main. Après toute modification de contenu d'une page, régénérer :

```
python3 generate-knowledge.py . knowledge.md
```

Le `.` = dossier du site (le script scanne toutes les pages + `articles/`). L'ancienne
forme `generate-knowledge.py index.html knowledge.md` est **obsolète** : elle raterait
tout le contenu hors accueil. Les articles en `noindex` sont volontairement exclus.
Le SYSTEM_PROMPT du bot vit dans `_worker.js` (le bot habille les URLs en Markdown ;
`knowledge.md` liste des URLs brutes, c'est voulu).

## Règles de fond

1. **Synchroniser avant de modifier.** Après chaque merge de PR sur `main`, repartir de
   `main` à jour : `git fetch origin main && git checkout -B <branche> origin/main`.
2. **Cache-busting.** Toute modification de `styles.css` ou `site.js` oblige à
   incrémenter `?v=N` **sur toutes les pages** qui les référencent. État courant :
   `styles.css?v=9`, `site.js?v=5`. Sans ça, les visiteurs récurrents gardent l'ancienne
   version (source du bug de scrollbar déjà corrigé).
3. **Compteurs, plusieurs emplacements et plusieurs formes.** Recenser TOUS les endroits
   par `grep` du chiffre ET du mot, sur toutes les pages, avant de conclure. Connus :
   - Accueil : `data-target` de `.stats-card` (38 interventions, 7 pays, 1000+, 20+).
   - Cartes offres de l'accueil (« 14 conférences dans 5 pays », « 21 sessions »).
   - Pages parcours : sous-titres de preuve (`conferences.html` « 14 conférences »,
     `ateliers-formations.html` « 21 sessions »).
   - `ressources.html` : boutons de filtre (`Tout · N`, `Outils · 9`, `Infographies · 15`,
     `Articles · 7`, `Webinaires · 3`, `Podcasts · 2`), en-tête `Volume · N ressources`,
     titres de section (« Neuf outils », « Quinze infographies », « Sept articles
     publiés »...), et **les 4 copies** de la meta description (`description`,
     `og:description`, `twitter:description`, JSON-LD).
4. **Ne pas toucher `_worker.js`** lors d'une modification de contenu. N'y toucher que
   sur demande explicite visant le chatbot. `ALLOWED_ORIGINS` inchangé.
5. **Diffs chirurgicaux.** Aucune ligne hors demande. Les incohérences repérées hors
   périmètre sont signalées en fin de réponse pour arbitrage, jamais corrigées d'office.
6. **Ampleur.** Changement visuel ou multi-fichiers : passer par un plan d'abord.
   Correction simple mono-fichier : direct.

## Publication (mise en ligne)

- Cloudflare déploie `main`. Selon l'environnement : en session web, le **push direct
  sur `main` est bloqué**, publier via une **pull request fusionnée** (outils GitHub) ;
  en local, adapter selon l'accès. Après un merge, repartir de `main` (règle 1).
- Vérifier avant push par `grep` et rendu Playwright. Le `curl` direct vers le site en
  ligne n'est **pas fiable** en session web (403 du proxy) ; vérifier par navigateur.

## Ajouter un contenu

- **Intervention** (conférence / formation) : dupliquer une ligne `.conf-row`
  (`conferences.html`) ou `.form-row` (`ateliers-formations.html`) en gardant les classes
  intactes (le générateur de knowledge les parse). Mettre à jour les compteurs (règle 3),
  régénérer `knowledge.md`.
- **Infographie** : ajouter en tête de `#infographies` dans `ressources.html` (plus
  récente d'abord), incrémenter le bouton de filtre + le `Volume` + le titre de section +
  les 4 metas, régénérer `knowledge.md`.
- **Carte projet / outil** : reproduire le pattern `.proj-card` (`proj-visual`,
  `proj-body`, `proj-tags`, `proj-footer`), SVG dans la palette (pas d'emoji pour les
  nouvelles), liens externes `target="_blank" rel="noopener"`. Ajouter aussi dans
  `ressources.html#outils` avec ses compteurs.
- **Article** : voir la section « Ajouter un article » du `README.md`. Brouillon
  `noindex` d'abord, écriture via voix-atelier, puis publication (retirer `noindex` + le
  bandeau brouillon, dater le JSON-LD Article, câbler la carte dans `ressources.html` +
  compteurs, ajouter au `sitemap.xml`, régénérer `knowledge.md`, bump `?v` si `styles.css`
  a bougé).

## Écriture de contenu (voix de l'auteur)

- Mobiliser les skills : `voix-atelier` (production de fond en quatre temps),
  `filtre-anti-baratin` et `humanizer` (passe finale), `ecriture-evaluation-ia` (contenu
  adossé au livre).
- **Règle permanente : jamais d'antithèse « pas X mais Y »** (ni « ce n'est pas X, c'est
  Y », ni « il ne s'agit pas de X, il s'agit de Y »).
- Aucun tiret cadratin dans le contenu. Rien d'inventé : chiffres, clients, citations,
  résultats, certifications.

## Contraintes éditoriales NON NÉGOCIABLES

- Jamais « **expert IA** ». Titre : « Technopédagogue & Ambassadeur IA ». « Spécialiste
  des usages de l'IA en pédagogie » est admis.
- Jamais l'organisme « **Bruxelles Formation** » (texte, logo, métadonnées, données
  structurées, `knowledge.md`). L'activité indépendante et l'emploi salarié restent
  strictement séparés.
- Localisation : basé en France près de Lille, actif à Bruxelles et à l'international.
  Jamais « basé à Bruxelles ».
- Préserver : le livre « Évaluer en formation à l'ère de l'IA générative » (Chronique
  Sociale, 2026), Ambassadeur IA France Num, les références institutionnelles exactes,
  les outils, les articles, les interventions internationales.

## Identité visuelle (« copie corrigée »)

- Papier clair `--paper #fdfdfb`, encre `--text #14151b`, accent bleu `--accent #1d3db0`,
  rouge correcteur `--rouge #cf2e2e`, réglure seyes `--seyes #ccd9ec`.
- Polices : Bricolage Grotesque (titres), Instrument Sans (texte), Spline Sans Mono
  (labels / mono).
- Jamais l'ancienne charte : orange `#e8520a`, crème `#f7f6f3`, Plus Jakarta Sans.

## Vérification locale

- `python3 -m http.server` ne sert pas les URLs sans extension. Les liens internes sont
  extensionless (`/conferences`) car Cloudflare redirige `.html` en 308 : utiliser un
  petit serveur Python qui mappe `/x` vers `x.html`.
- Rendu et débordements : Playwright + Chromium (`/opt/pw-browsers/chromium`), captures
  desktop et mobile.
- Grep de conformité avant push : `Bruxelles Formation`, `expert`, tiret cadratin,
  `soundcloud|numericast`.

## Commits

- Messages **sans accents et sans tirets cadratins**.
- Ne pas inclure d'identifiant de modèle dans les artefacts poussés.

## Conversion

- CTA principal : Cal.com `https://cal.com/rochane/echange-avec-rochane`.
- Email public affiché : `ia@rochane.fr`. Formulaire de contact via Formspree.

## Vestiges à ne pas réactiver

- `.github/workflows/deploy.yml` (ancien déploiement GitHub Pages) : supprimé du
  dépôt en juillet 2026, il se déclenchait encore à chaque push sur `main`. Ne pas
  recréer de workflow de déploiement, Cloudflare Pages déploie `main` tout seul.
- `og-template.html` sert uniquement à régénérer `og-image.jpg` (capture 1200x630).
