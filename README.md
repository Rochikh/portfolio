# ia.rochane.fr · Portfolio de Rochane Kherbouche

Portfolio professionnel de Rochane Kherbouche, technopédagogue et Ambassadeur IA :
conférences, ateliers, formations et accompagnements sur l'IA en formation et
l'évaluation. Auteur de « Évaluer en formation à l'ère de l'IA générative »
(Chronique Sociale, 2026).

## Architecture

- **Hébergement : Cloudflare Pages** (domaine `ia.rochane.fr`, fichier `CNAME`).
- `_worker.js` : Pages Function. Sert les fichiers statiques et l'endpoint
  `POST /api/chat` du chatbot (API Gemini, clé dans le secret d'environnement
  `GEMINI_API_KEY`, jamais exposée côté client).
- Six pages : `index.html`, `conferences.html`, `ateliers-formations.html`,
  `accompagnement.html`, `evaluer-ia.html`, `ressources.html`
  (plus `mentions-legales.html` et `livre3d.html`, toutes deux en noindex).
- `styles.css` et `site.js` sont partagés par toutes les pages. Cache-busting
  par `?v=N` : incrémenter le numéro dans toutes les pages à chaque modification
  de l'un de ces deux fichiers.
- Les liens internes sont sans extension (`/conferences`) : Cloudflare Pages
  redirige automatiquement `/conferences.html` vers `/conferences` (308).
- Le widget de chat est injecté par `site.js` : son markup n'existe qu'à un
  seul endroit.

## Chatbot : chaîne de contenu

Les pages HTML sont la source de vérité. `knowledge.md` (base de connaissance
du chatbot) en est dérivé :

```bash
python3 generate-knowledge.py . knowledge.md
```

À relancer après **toute** modification de contenu des six pages, puis
committer le `knowledge.md` produit. Le prompt système (ton, règles, tarifs,
langues, démarche) vit dans `_worker.js`.

## Ajouter une intervention

1. Dupliquer une ligne existante dans `conferences.html` (`.conf-row`) ou
   `ateliers-formations.html` (`.form-row`) en conservant les classes CSS :
   le générateur de knowledge les parse.
2. Mettre à jour les compteurs affichés : sous-titre de la section concernée,
   carte offre correspondante sur l'accueil, et `data-target="38"` de la carte
   stats du hero (38 = 14 conférences + 21 formations + 3 webinaires).
3. Régénérer `knowledge.md` (commande ci-dessus).

## Ajouter un article

Les articles de fond vivent dans `articles/` et sont servis en
`/articles/<slug>`. Le fichier `articles/pourquoi-les-detecteurs-dia-echouent.html`
sert de gabarit : il est livré à l'état de **brouillon** (`noindex`, non lié,
absent du sitemap et de `knowledge.md`).

Écrire un article :

1. **Dupliquer** le gabarit sous un nouveau slug (ex.
   `articles/mon-sujet.html`). Mettre à jour `title`, `meta description`,
   `canonical`, les balises Open Graph/Twitter, le `headline` du JSON-LD
   `Article`, le H1, le chapô et le plan des titres.
2. **Écrire le fond via voix-atelier** : remplacer chaque bloc
   `<p class="article-todo">` par de la prose, en gardant les encarts
   `.article-callout` pour les données vérifiables (avec leur source).
   Ne rien inventer : chiffres, citations et exemples doivent être exacts.

Publier (une fois le texte prêt) :

3. Retirer la balise `<meta name="robots" content="noindex">`, le bandeau
   `<div class="draft-banner">` et tous les blocs `.article-todo` restants.
4. Ajouter `"datePublished": "AAAA-MM-JJ"` au nœud `Article` du JSON-LD.
5. Ajouter une carte interne en tête de la section `#articles` de
   `ressources.html` (même markup que `.article-card` mais
   `href="/articles/<slug>"` **sans** `target="_blank"`), et mettre à jour le
   compteur du filtre (`Articles · 6` → `7`) et le titre « Six articles publiés ».
   Éventuellement l'ajouter aussi à la sélection Ressources de l'accueil.
6. Ajouter l'URL `https://ia.rochane.fr/articles/<slug>` au `sitemap.xml`.
7. Régénérer `knowledge.md` (l'article publié y apparaît automatiquement,
   sous « Articles du site ») et incrémenter `?v=` si `styles.css` a changé.

## Image de partage

`og-image.jpg` (1200x630) se régénère en capturant `og-template.html`
(polices chargées) en 1200x630, par exemple avec Playwright :

```bash
npx playwright screenshot --viewport-size "1200,630" og-template.html og-image.jpg
```

## Notes

- `.github/workflows/deploy.yml` est un vestige de l'ancien hébergement
  GitHub Pages : ne pas le réactiver, le site vit sur Cloudflare Pages.
- Après un merge, si `styles.css` ou `site.js` ne semblent pas à jour en
  production, purger le cache Cloudflare ou incrémenter `?v=`.
- Contrainte éditoriale : ne jamais présenter Rochane comme « expert IA »
  (technopédagogue, spécialiste des usages de l'IA en pédagogie, Ambassadeur IA).
