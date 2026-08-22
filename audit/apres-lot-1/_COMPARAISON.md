# Comparaison Lighthouse, AVANT lot 1 / APRES lot 1

Campagne APRES : `audit/apres-lot-1/`. Campagne de reference : `audit/avant/`.
Protocole, versions, flags, ordre des URL et nombre de passes identiques,
voir `audit/apres-lot-1/_METHODE.md`.

## Regle d'attribution appliquee

- **Score de performance** : un ecart **inferieur a 8 points** n'est pas attribuable.
  L'amplitude mesuree sur `07-faq` etait de 7 points entre trois executions identiques.
  Verdict `attribuable` si et seulement si l'ecart absolu atteint 8 points.
- **Autres metriques** : le seuil est l'amplitude min-max la plus large des deux
  campagnes pour cette page et cette metrique. Verdict `attribuable` si l'ecart
  absolu depasse strictement ce seuil.
- **Metriques de preuve** : LCP, poids transfere, CLS. Les autres sont indicatives,
  score de performance compris.

## `01-accueil`

https://ia.rochane.fr/

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 4 786 ms | 4 581 ms | -205 ms | seuil 448 | **non attribuable** |
| Poids transfere | preuve | 445 933 o | 419 810 o | -26 123 o | seuil 108 | **attribuable** |
| CLS | preuve | 0.000 | 0.000 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 79 pts | 78 pts | -1 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 2 483 ms | 2 908 ms | +425 ms | seuil 1 470 | **non attribuable** |
| TBT | indicative | 47 ms | 45 ms | -2 ms | seuil 736 | **non attribuable** |
| Speed Index | indicative | 2 483 ms | 2 908 ms | +425 ms | seuil 1 470 | **non attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 96 pts | 96 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## `02-conferences`

https://ia.rochane.fr/conferences

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 2 984 ms | 2 919 ms | -65 ms | seuil 88 | **non attribuable** |
| Poids transfere | preuve | 135 410 o | 135 650 o | +240 o | seuil 25 | **attribuable** |
| CLS | preuve | 0.000 | 0.000 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 94 pts | 90 pts | -4 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 1 621 ms | 2 908 ms | +1 287 ms | seuil 1 372 | **non attribuable** |
| TBT | indicative | 0 ms | 0 ms | +0 ms | seuil 26 | **non attribuable** |
| Speed Index | indicative | 1 621 ms | 2 908 ms | +1 287 ms | seuil 1 372 | **non attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 96 pts | 96 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## `03-ateliers-formations`

https://ia.rochane.fr/ateliers-formations

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 2 996 ms | 2 999 ms | +3 ms | seuil 80 | **non attribuable** |
| Poids transfere | preuve | 136 861 o | 137 111 o | +250 o | seuil 28 | **attribuable** |
| CLS | preuve | 0.000 | 0.000 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 94 pts | 91 pts | -3 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 1 562 ms | 2 455 ms | +893 ms | seuil 1 418 | **non attribuable** |
| TBT | indicative | 23 ms | 0 ms | -23 ms | seuil 37 | **non attribuable** |
| Speed Index | indicative | 1 562 ms | 2 455 ms | +893 ms | seuil 1 418 | **non attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 96 pts | 96 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## `04-accompagnement`

https://ia.rochane.fr/accompagnement

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 2 901 ms | 2 770 ms | -131 ms | seuil 149 | **non attribuable** |
| Poids transfere | preuve | 133 226 o | 133 456 o | +230 o | seuil 13 | **attribuable** |
| CLS | preuve | 0.000 | 0.000 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 92 pts | 91 pts | -1 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 2 464 ms | 2 770 ms | +306 ms | seuil 47 | **attribuable** |
| TBT | indicative | 0 ms | 0 ms | +0 ms | seuil 125 | **non attribuable** |
| Speed Index | indicative | 2 464 ms | 2 770 ms | +306 ms | seuil 47 | **attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## `05-evaluer-ia`

https://ia.rochane.fr/evaluer-ia

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 3 170 ms | 3 137 ms | -33 ms | seuil 125 | **non attribuable** |
| Poids transfere | preuve | 354 292 o | 243 135 o | -111 157 o | seuil 22 | **attribuable** |
| CLS | preuve | 0.000 | 0.000 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 93 pts | 90 pts | -3 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 1 572 ms | 2 532 ms | +960 ms | seuil 965 | **non attribuable** |
| TBT | indicative | 0 ms | 0 ms | +0 ms | seuil 0 | **non attribuable** |
| Speed Index | indicative | 1 572 ms | 2 532 ms | +960 ms | seuil 965 | **non attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## `06-ressources`

https://ia.rochane.fr/ressources

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 2 913 ms | 2 904 ms | -9 ms | seuil 28 | **non attribuable** |
| Poids transfere | preuve | 137 042 o | 137 274 o | +232 o | seuil 61 | **attribuable** |
| CLS | preuve | 0.009 | 0.009 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 95 pts | 90 pts | -5 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 1 555 ms | 2 904 ms | +1 349 ms | seuil 1 368 | **non attribuable** |
| TBT | indicative | 0 ms | 0 ms | +0 ms | seuil 0 | **non attribuable** |
| Speed Index | indicative | 1 555 ms | 2 904 ms | +1 349 ms | seuil 1 368 | **non attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## `07-faq`

https://ia.rochane.fr/faq

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 2 980 ms | 2 900 ms | -80 ms | seuil 225 | **non attribuable** |
| Poids transfere | preuve | 132 366 o | 132 605 o | +239 o | seuil 14 | **attribuable** |
| CLS | preuve | 0.000 | 0.000 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 90 pts | 91 pts | +1 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 2 680 ms | 2 774 ms | +94 ms | seuil 1 435 | **non attribuable** |
| TBT | indicative | 0 ms | 0 ms | +0 ms | seuil 0 | **non attribuable** |
| Speed Index | indicative | 2 680 ms | 2 774 ms | +94 ms | seuil 1 435 | **non attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## `08-article-detecteurs`

https://ia.rochane.fr/articles/pourquoi-les-detecteurs-dia-echouent

| Metrique | Role | Mediane AVANT | Mediane APRES | Ecart | Seuil | Verdict |
|---|---|---|---|---|---|---|
| LCP | preuve | 2 777 ms | 2 912 ms | +135 ms | seuil 448 | **non attribuable** |
| Poids transfere | preuve | 133 266 o | 133 514 o | +248 o | seuil 72 | **attribuable** |
| CLS | preuve | 0.000 | 0.000 | +0.000 | seuil 0.000 | **non attribuable** |
| Performance | indicative | 91 pts | 90 pts | -1 pts | |ecart| >= 8 pts | **non attribuable** |
| FCP | indicative | 2 777 ms | 2 912 ms | +135 ms | seuil 448 | **non attribuable** |
| TBT | indicative | 0 ms | 0 ms | +0 ms | seuil 0 | **non attribuable** |
| Speed Index | indicative | 2 777 ms | 2 912 ms | +135 ms | seuil 448 | **non attribuable** |
| Accessibilite | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| Bonnes pratiques | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |
| SEO | indicative | 100 pts | 100 pts | +0 pts | seuil 0 | **non attribuable** |

## Recapitulatif des metriques de preuve

| Page | LCP avant | LCP apres | Ecart LCP | Verdict LCP | Poids avant | Poids apres | Ecart poids | Verdict poids | CLS avant | CLS apres | Ecart CLS | Verdict CLS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `01-accueil` | 4 786 | 4 581 | -205 | **non attribuable** | 445 933 | 419 810 | -26 123 | **attribuable** | 0.000 | 0.000 | +0.000 | **non attribuable** |
| `02-conferences` | 2 984 | 2 919 | -65 | **non attribuable** | 135 410 | 135 650 | +240 | **attribuable** | 0.000 | 0.000 | +0.000 | **non attribuable** |
| `03-ateliers-formations` | 2 996 | 2 999 | +3 | **non attribuable** | 136 861 | 137 111 | +250 | **attribuable** | 0.000 | 0.000 | +0.000 | **non attribuable** |
| `04-accompagnement` | 2 901 | 2 770 | -131 | **non attribuable** | 133 226 | 133 456 | +230 | **attribuable** | 0.000 | 0.000 | +0.000 | **non attribuable** |
| `05-evaluer-ia` | 3 170 | 3 137 | -33 | **non attribuable** | 354 292 | 243 135 | -111 157 | **attribuable** | 0.000 | 0.000 | +0.000 | **non attribuable** |
| `06-ressources` | 2 913 | 2 904 | -9 | **non attribuable** | 137 042 | 137 274 | +232 | **attribuable** | 0.009 | 0.009 | +0.000 | **non attribuable** |
| `07-faq` | 2 980 | 2 900 | -80 | **non attribuable** | 132 366 | 132 605 | +239 | **attribuable** | 0.000 | 0.000 | +0.000 | **non attribuable** |
| `08-article-detecteurs` | 2 777 | 2 912 | +135 | **non attribuable** | 133 266 | 133 514 | +248 | **attribuable** | 0.000 | 0.000 | +0.000 | **non attribuable** |

## Comptage des verdicts

| Metrique | Attribuable | Non attribuable |
|---|---|---|
| LCP | 0 / 8 | 8 / 8 |
| Poids transfere | 8 / 8 | 0 / 8 |
| CLS | 0 / 8 | 8 / 8 |
| Performance | 0 / 8 | 8 / 8 |
| FCP | 1 / 8 | 7 / 8 |
| TBT | 0 / 8 | 8 / 8 |
| Speed Index | 1 / 8 | 7 / 8 |
| Accessibilite | 0 / 8 | 8 / 8 |
| Bonnes pratiques | 0 / 8 | 8 / 8 |
| SEO | 0 / 8 | 8 / 8 |

## Derive du FCP

Derive du FCP de +681 ms en moyenne sur 8 pages sur 8, y compris les pages non modifiees
par le lot. Non imputable au lot. Piste principale : la latence des deux domaines Google
Fonts, qui representent 235,9 Ko sur 9 requetes dans la campagne d'avant, soit la majorite
du transfert de l'accueil, et qui echappent totalement au controle du site. A verifier au
lot 4, lors de l'auto-hebergement des polices : si la derive disparait, la cause est
confirmee. Poids identique a l'octet entre les deux campagnes, 239 426 o sur fonts.gstatic.com. La derive porte donc sur la latence de ces domaines, pas sur leur poids.

| page | FCP avant | FCP apres | ecart |
|---|---|---|---|
| `01-accueil` | 2483 ms | 2908 ms | +425 ms |
| `02-conferences` | 1621 ms | 2908 ms | +1287 ms |
| `03-ateliers-formations` | 1562 ms | 2455 ms | +893 ms |
| `04-accompagnement` | 2464 ms | 2770 ms | +306 ms |
| `05-evaluer-ia` | 1572 ms | 2532 ms | +960 ms |
| `06-ressources` | 1555 ms | 2904 ms | +1349 ms |
| `07-faq` | 2680 ms | 2774 ms | +94 ms |
| `08-article-detecteurs` | 2777 ms | 2912 ms | +135 ms |

## Incoherences signalees et non corrigees

| # | Fichier | Constat | Lot de destination |
|---|---|---|---|
| 1 | `styles.css:597` | Regle `.about-right` orpheline, aucune occurrence HTML dans le depot. | lot 4, nettoyage et minification CSS |
| 2 | `conferences.html`, `ateliers-formations.html` | conferences.html et ateliers-formations.html, 35 requetes d'images vers flagcdn.com. Rapport de forme incorrect, latence hors controle, transfert d'adresse IP vers un tiers non mentionne dans les mentions legales. Correction attendue au lot 4 : rapatriement des drapeaux en local, en SVG, avec width et height corrects. A traiter avec l'auto-hebergement des polices, meme nature de probleme. | lot 4 |
| 3 | `site.js:396` | site.js, chemin d'echec du gestionnaire #contact-form. Correction attendue au lot 4 : afficher l'adresse de contact en clair avec un bouton de copie, sans declencher de navigation mailto: non demandee. | lot 4, item comportements du formulaire |
