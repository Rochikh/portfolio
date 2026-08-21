# Base de mesure Lighthouse, etat AVANT

Campagne de reference etablie avant toute modification du site. Trois passes par URL,
mediane retenue. Toute campagne APRES doit reproduire ce protocole a l'identique.

## Date et perimetre

- Campagne du **21 aout 2026**, passes entre 15:14:21 et 15:19:30 UTC
- Cible : le **site en ligne** `https://ia.rochane.fr`, pas une copie locale
- 8 URL du sitemap, 3 passes chacune, **24 executions** au total, en sequentiel

Test de connectivite prealable :

    curl -s -o /dev/null -w '%{http_code}\n' --max-time 15 https://ia.rochane.fr/
    -> 200

Corps de 34718 octets, `content-type: text/html; charset=utf-8`, titre de page
conforme. La mesure porte donc sur la production reelle, en-tetes Cloudflare,
compression et cache inclus. La reserve de CLAUDE.md sur le curl bloque en 403 vaut
pour la session web, elle ne s'applique pas a une session locale.

## Versions, a figer entre campagnes

| element | version |
|---|---|
| Lighthouse | **13.4.1** (`npm install -g lighthouse`) |
| Chromium | Playwright **chromium-1228** |
| chemin Chromium | `/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome` |
| user agent | `HeadlessChrome/149.0.0.0` |
| Node | v22.22.2, npm 10.9.7 |

Le chemin du Chromium a ete resolu sur piece, pas repris de memoire :

    python3 -c "from playwright.sync_api import sync_playwright; p=sync_playwright().start(); print(p.chromium.executable_path); p.stop()"

## Commande exacte

    export CHROME_PATH=/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome

    lighthouse "<URL>" \
      --only-categories=performance,accessibility,best-practices,seo \
      --output=json --output=html --output-path="audit/avant/<NOM>-p<N>" \
      --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
      --quiet

`<N>` vaut 1, 2 ou 3 selon la passe.

### Flags, a reproduire caractere pour caractere

    --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage

**`--disable-gpu` est conserve deliberement**, y compris en sachant qu'il provoque
l'artefact WebGL decrit plus bas. Le retirer changerait le score de bonnes pratiques
de l'accueil et rendrait les deux campagnes incomparables.

### Parametres Lighthouse

Valeurs par defaut du profil mobile, aucune surcharge :

- `formFactor` : mobile
- `throttlingMethod` : **simulate**
- `screenEmulation` : 412 x 823, deviceScaleFactor 1.75
- `throttling` : rttMs 150, throughputKbps 1638.4, requestLatencyMs 562.5,
  downloadThroughputKbps 1474.56, uploadThroughputKbps 675, cpuSlowdownMultiplier 4

## Protocole des trois passes

1. Les 8 URL sont parcourues **dans l'ordre du tableau ci-dessous**, passe 1 complete,
   puis passe 2, puis passe 3. Cet ordre fait partie du protocole.
2. **Jamais deux executions en parallele.** Des Lighthouse concurrents se disputent le
   CPU et faussent le throttling simule.
3. Pour chaque URL, la **mediane de chaque metrique est calculee independamment** des
   autres. Une ligne de mediane ne correspond donc pas forcement a une passe reelle
   unique, c'est voulu : chaque metrique a sa propre dispersion.
4. Le **minimum et le maximum** de chaque metrique sont conserves. Ils fixent le seuil
   au-dela duquel un ecart AVANT / APRES devient attribuable a une modification.

## Ordre des URL

| rang | fichier | URL |
|---|---|---|
| 1 | `01-accueil` | https://ia.rochane.fr/ |
| 2 | `02-conferences` | https://ia.rochane.fr/conferences |
| 3 | `03-ateliers-formations` | https://ia.rochane.fr/ateliers-formations |
| 4 | `04-accompagnement` | https://ia.rochane.fr/accompagnement |
| 5 | `05-evaluer-ia` | https://ia.rochane.fr/evaluer-ia |
| 6 | `06-ressources` | https://ia.rochane.fr/ressources |
| 7 | `07-faq` | https://ia.rochane.fr/faq |
| 8 | `08-article-detecteurs` | https://ia.rochane.fr/articles/pourquoi-les-detecteurs-dia-echouent |

## Tableau 1, medianes par page

| page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Poids total |
|---|---|---|---|---|---|---|---|---|---|
| `01-accueil` | 79 | 100 | 96 | 100 | 2.5 s | 4.8 s | 47 ms | 0 | 435 Ko |
| `02-conferences` | 94 | 100 | 96 | 100 | 1.6 s | 3.0 s | 0 ms | 0 | 132 Ko |
| `03-ateliers-formations` | 94 | 100 | 96 | 100 | 1.6 s | 3.0 s | 23 ms | 0 | 134 Ko |
| `04-accompagnement` | 92 | 100 | 100 | 100 | 2.5 s | 2.9 s | 0 ms | 0 | 130 Ko |
| `05-evaluer-ia` | 93 | 100 | 100 | 100 | 1.6 s | 3.2 s | 0 ms | 0 | 346 Ko |
| `06-ressources` | 95 | 100 | 100 | 100 | 1.6 s | 2.9 s | 0 ms | 0.009 | 134 Ko |
| `07-faq` | 90 | 100 | 100 | 100 | 2.7 s | 3.0 s | 0 ms | 0 | 129 Ko |
| `08-article-detecteurs` | 91 | 100 | 100 | 100 | 2.8 s | 2.8 s | 0 ms | 0 | 130 Ko |

Speed Index, sorti du tableau principal pour la lisibilite :

| page | Speed Index median |
|---|---|
| `01-accueil` | 2.5 s |
| `02-conferences` | 1.6 s |
| `03-ateliers-formations` | 1.6 s |
| `04-accompagnement` | 2.5 s |
| `05-evaluer-ia` | 1.6 s |
| `06-ressources` | 1.6 s |
| `07-faq` | 2.7 s |
| `08-article-detecteurs` | 2.8 s |

Accessibilite, bonnes pratiques et SEO n'ont **varie sur aucune page** : mediane, min
et max sont confondus pour ces trois categories sur les 24 executions.

## Tableau 2, amplitude min-max de la performance et du LCP

| page | Perf mediane | Perf min | Perf max | amplitude Perf | LCP mediane | LCP min | LCP max | amplitude LCP |
|---|---|---|---|---|---|---|---|---|
| `01-accueil` | 79 | 77 | 83 | **6** | 4.8 s | 4.6 s | 4.8 s | **0.2 s** |
| `02-conferences` | 94 | 94 | 95 | **1** | 3.0 s | 2.9 s | 3.0 s | **0.1 s** |
| `03-ateliers-formations` | 94 | 91 | 94 | **3** | 3.0 s | 3.0 s | 3.0 s | **0.0 s** |
| `04-accompagnement` | 92 | 90 | 93 | **3** | 2.9 s | 2.8 s | 2.9 s | **0.1 s** |
| `05-evaluer-ia` | 93 | 89 | 94 | **5** | 3.2 s | 3.1 s | 3.2 s | **0.1 s** |
| `06-ressources` | 95 | 90 | 95 | **5** | 2.9 s | 2.9 s | 2.9 s | **0.0 s** |
| `07-faq` | 90 | 89 | 96 | **7** | 3.0 s | 2.8 s | 3.0 s | **0.2 s** |
| `08-article-detecteurs` | 91 | 90 | 94 | **4** | 2.8 s | 2.5 s | 2.9 s | **0.4 s** |

### Seuil d'attribution

L'amplitude de performance atteint **7 points** au pire (`07-faq`), et depasse 3 points
sur la moitie des pages. En consequence :

> Un ecart de score de performance **inferieur ou egal a 7 points** entre la campagne
> AVANT et la campagne APRES ne prouve rien. Seul un ecart superieur, ou un ecart
> concordant sur plusieurs pages a la fois, est attribuable a une modification.

Le LCP est nettement plus stable, amplitude maximale de 0.4 s sur
`08-article-detecteurs`, 0.2 s ou moins ailleurs. C'est la metrique la plus fiable
pour juger un effet reel.

## Reserves de methode

1. **Trois passes restent peu.** La mediane sur 3 valeurs absorbe une aberration
   isolee, pas une derive. Les amplitudes du tableau 2 sont un ordre de grandeur, pas
   un intervalle de confiance statistique.
2. **Mesure depuis ce serveur**, avec sa latence propre vers Cloudflare. Une mesure
   refaite ailleurs donnera d'autres temps absolus. Seule la comparaison AVANT / APRES
   dans les memes conditions a du sens.
3. **Etat du cache Cloudflare non controle.** Les passes s'enchainent sur quelques
   minutes, une URL peut etre servie froide en passe 1 et chaude ensuite.
4. **Aucune reserve TLS.** Le flag `--ssl-version-max=tls1.2`, prevu en secours, n'a
   pas ete necessaire : aucune interstitielle, aucune erreur de poignee de main.
5. Les scores de categorie sont des entiers arrondis par Lighthouse. Un ecart d'un
   point peut venir d'un arrondi et non d'un changement reel.

## Artefact WebGL de l'accueil, a ne pas corriger

L'accueil plafonne a **96 en bonnes pratiques** a cause de l'audit `errors-in-console` :

    THREE.WebGLRenderer: Error creating WebGL context.
    Uncaught Error: Error creating WebGL context.
    source : https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

**C'est un artefact du protocole de mesure, pas un defaut du site.** Le flag
`--disable-gpu` prive Chromium de tout contexte WebGL, three.js echoue donc
mecaniquement. Un navigateur reel dote d'un GPU ne produit pas cette erreur.

Consequences :

- Ne rien corriger dans le site pour ce point.
- **S'attendre a le retrouver a l'identique dans la campagne APRES.** Sa disparition
  signalerait un changement de protocole, pas une amelioration.
- L'audit a echoue sur les **3 passes sur 3**, la reproduction est donc fiable.

## Deux ecarts reels a 96 en bonnes pratiques

`02-conferences` et `03-ateliers-formations` echouent sur l'audit `image-aspect-ratio`,
sur les 3 passes sur 3. Les drapeaux servis par `https://flagcdn.com/w80/<pays>.png`
sont affiches dans un rapport de forme different de leur rapport natif, sous
`div.conf-flag` et `div.form-flag`.

Contrairement a l'artefact WebGL, celui-ci est **un defaut reel du site**, reproductible
hors headless. Il est consigne ici comme constat de mesure. Aucune correction n'est
engagee dans le cadre de cette base de mesure.

## Fichiers

| fichier | versionne | role |
|---|---|---|
| `_METHODE.md` | oui | ce document, protocole et resultats |
| `_scores.json` | oui | medianes, min, max et les 3 valeurs brutes par metrique |
| `<NOM>-p<N>.report.json` | non | 24 rapports Lighthouse bruts |
| `<NOM>-p<N>.report.html` | non | 24 rapports lisibles en navigateur |

Les 48 rapports bruts restent sur disque pour consultation, ils sont exclus par
`.gitignore` (environ 25 Mo, sans interet en historique de depot).

## Reproduire la campagne APRES

Memes versions, memes flags, meme ordre, 3 passes, en sequentiel, sortie dans
`audit/apres/`. Toute divergence de version de Lighthouse ou de Chromium invalide la
comparaison et doit etre notee dans le `_METHODE.md` de cette campagne.
