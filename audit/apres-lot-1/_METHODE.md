# Campagne de mesure Lighthouse, etat APRES lot 1

Campagne de controle apres fusion des items du lot 1. Protocole **strictement
identique** a `audit/avant/_METHODE.md` : memes versions, memes flags, memes 8 URL
dans le meme ordre, 3 passes par URL, mediane par metrique, min et max conserves.

## Date et perimetre

- Campagne du **22 aout 2026**, passes entre 2026-08-22T05:27:07.863Z et 2026-08-22T05:32:09.717Z
- Cible : le **site en ligne** `https://ia.rochane.fr`, pas une copie locale
- 8 URL du sitemap, 3 passes chacune, **24 executions** au total, en sequentiel

Test de connectivite prealable :

    curl -s -o /dev/null -w '%{http_code}\n' --max-time 15 https://ia.rochane.fr/
    -> 200

Commit de production mesure : **35a7aa9**, dernier commit de `main` au moment de
la campagne, incluant les six items fusionnes du lot 1.

## Versions, identiques a la campagne AVANT

| element | version AVANT | version APRES | identique |
|---|---|---|---|
| Lighthouse | 13.4.1 | **13.4.1** | oui |
| Chromium | Playwright chromium-1228 | **Playwright chromium-1228** | oui |
| chemin Chromium | `/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome` | idem | oui |
| Node | v22.22.2 | **v22.22.2** | oui |
| npm | 10.9.7 | **10.9.7** | oui |

Chemin du Chromium resolu sur piece, pas repris de memoire :

    python3 -c "from playwright.sync_api import sync_playwright; p=sync_playwright().start(); print(p.chromium.executable_path); p.stop()"

**Aucune divergence de version.** La comparaison AVANT / APRES est valide.

## Commande exacte

    export CHROME_PATH=/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome

    lighthouse "<URL>" \
      --only-categories=performance,accessibility,best-practices,seo \
      --output=json --output=html --output-path="audit/apres-lot-1/<NOM>-p<N>" \
      --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
      --quiet

### Flags, reproduits caractere pour caractere

    --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage

`--disable-gpu` est conserve, conformement a la consigne de la campagne AVANT.
L'artefact WebGL de l'accueil doit donc se reproduire a l'identique.

## Ordre des URL, identique a la campagne AVANT

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
| `01-accueil` | 78 | 100 | 96 | 100 | 2.9 s | 4.6 s | 45 ms | 0 | 410 Ko |
| `02-conferences` | 90 | 100 | 96 | 100 | 2.9 s | 2.9 s | 0 ms | 0 | 132 Ko |
| `03-ateliers-formations` | 91 | 100 | 96 | 100 | 2.5 s | 3.0 s | 0 ms | 0 | 134 Ko |
| `04-accompagnement` | 91 | 100 | 100 | 100 | 2.8 s | 2.8 s | 0 ms | 0 | 130 Ko |
| `05-evaluer-ia` | 90 | 100 | 100 | 100 | 2.5 s | 3.1 s | 0 ms | 0 | 237 Ko |
| `06-ressources` | 90 | 100 | 100 | 100 | 2.9 s | 2.9 s | 0 ms | 0.009 | 134 Ko |
| `07-faq` | 91 | 100 | 100 | 100 | 2.8 s | 2.9 s | 0 ms | 0 | 129 Ko |
| `08-article-detecteurs` | 90 | 100 | 100 | 100 | 2.9 s | 2.9 s | 0 ms | 0 | 130 Ko |

Speed Index, sorti du tableau principal pour la lisibilite :

| page | Speed Index median |
|---|---|
| `01-accueil` | 2.9 s |
| `02-conferences` | 2.9 s |
| `03-ateliers-formations` | 2.5 s |
| `04-accompagnement` | 2.8 s |
| `05-evaluer-ia` | 2.5 s |
| `06-ressources` | 2.9 s |
| `07-faq` | 2.8 s |
| `08-article-detecteurs` | 2.9 s |

## Tableau 2, amplitude min-max de la performance et du LCP

| page | Perf mediane | Perf min | Perf max | amplitude Perf | LCP mediane | LCP min | LCP max | amplitude LCP |
|---|---|---|---|---|---|---|---|---|
| `01-accueil` | 78 | 58 | 79 | **21** | 4.6 s | 4.5 s | 5.0 s | **0.4 s** |
| `02-conferences` | 90 | 89 | 95 | **6** | 2.9 s | 2.9 s | 3.0 s | **0.1 s** |
| `03-ateliers-formations` | 91 | 88 | 94 | **6** | 3.0 s | 3.0 s | 3.1 s | **0.1 s** |
| `04-accompagnement` | 91 | 91 | 91 | **0** | 2.8 s | 2.8 s | 2.8 s | **0.0 s** |
| `05-evaluer-ia` | 90 | 89 | 90 | **1** | 3.1 s | 3.1 s | 3.2 s | **0.1 s** |
| `06-ressources` | 90 | 90 | 90 | **0** | 2.9 s | 2.9 s | 2.9 s | **0.0 s** |
| `07-faq` | 91 | 90 | 91 | **1** | 2.9 s | 2.8 s | 2.9 s | **0.1 s** |
| `08-article-detecteurs` | 90 | 90 | 90 | **0** | 2.9 s | 2.9 s | 2.9 s | **0.0 s** |

## Reserves de methode

Les cinq reserves de `audit/avant/_METHODE.md` restent valables : trois passes
restent peu, la mesure part de ce serveur, l'etat du cache Cloudflare n'est pas
controle, les scores de categorie sont des entiers arrondis.

### Derive systematique du FCP et du Speed Index entre les deux campagnes

| page | FCP avant | FCP apres | ecart | Perf avant | Perf apres | ecart |
|---|---|---|---|---|---|---|
| `01-accueil` | 2483 ms | 2908 ms | +425 ms | 79 | 78 | -1 |
| `02-conferences` | 1621 ms | 2908 ms | +1287 ms | 94 | 90 | -4 |
| `03-ateliers-formations` | 1562 ms | 2455 ms | +893 ms | 94 | 91 | -3 |
| `04-accompagnement` | 2464 ms | 2770 ms | +306 ms | 92 | 91 | -1 |
| `05-evaluer-ia` | 1572 ms | 2532 ms | +960 ms | 93 | 90 | -3 |
| `06-ressources` | 1555 ms | 2904 ms | +1349 ms | 95 | 90 | -5 |
| `07-faq` | 2680 ms | 2774 ms | +94 ms | 90 | 91 | +1 |
| `08-article-detecteurs` | 2777 ms | 2912 ms | +135 ms | 91 | 90 | -1 |

FCP en hausse sur **8 pages sur 8**, moyenne des ecarts **+681 ms**.
Score de performance en baisse sur **7 pages sur 8**, moyenne des ecarts **-2.12 point**.

Le Speed Index est egal au FCP sur les 8 pages des deux campagnes, il suit donc la
meme derive.

Cette derive porte sur des metriques declarees indicatives. Elle est concordante,
de meme signe sur la quasi-totalite des pages, y compris sur les 6 pages dont le
contenu n'a pas ete modifie par le lot 1. Les 3 metriques de preuve, LCP, poids
transfere et CLS, ne la suivent pas : le LCP est stable ou en baisse sur 8 pages
sur 8, le CLS est inchange sur 8 pages sur 8.

### Poids transfere des 6 pages non modifiees

| page | poids avant | poids apres | ecart |
|---|---|---|---|
| `02-conferences` | 135410 o | 135650 o | +240 o |
| `03-ateliers-formations` | 136861 o | 137111 o | +250 o |
| `04-accompagnement` | 133226 o | 133456 o | +230 o |
| `06-ressources` | 137042 o | 137274 o | +232 o |
| `07-faq` | 132366 o | 132605 o | +239 o |
| `08-article-detecteurs` | 133266 o | 133514 o | +248 o |

Ces 6 pages ne portent aucune des images retravaillees. Leur ecart de poids provient
des 4 lignes ajoutees a `styles.css` et des 7 lignes ajoutees a `site.js` par le lot 1.

## Fichiers

| fichier | versionne | role |
|---|---|---|
| `_METHODE.md` | oui | ce document, protocole et resultats bruts |
| `_COMPARAISON.md` | oui | comparaison chiffree AVANT / APRES et verdicts d'attribution |
| `_scores.json` | oui | medianes, min, max et les 3 valeurs brutes par metrique |
| `<NOM>-p<N>.report.json` | non | 24 rapports Lighthouse bruts |
| `<NOM>-p<N>.report.html` | non | 24 rapports lisibles en navigateur |

Les 48 rapports bruts restent sur disque pour consultation, exclus par `.gitignore`
via `audit/**/*.report.html` et `audit/**/*.report.json`.

