#!/usr/bin/env python3
"""Genere knowledge.md (base de connaissance du chatbot) depuis les pages du site.

Usage: python3 generate-knowledge.py <dossier_du_site> <fichier_sortie>
Exemple: python3 generate-knowledge.py . knowledge.md

Apres chaque collecte, le script affiche l'effectif de la section et le compare
au minimum attendu declare dans EXPECTED. Si une section rend moins d'entrees
que prevu, il ecrit l'ecart sur stderr et sort en code 1 sans produire le
fichier de sortie : une regex cassee par un changement de HTML est ainsi
signalee, meme quand elle ne fait perdre qu'une seule entree.
Toute ressource ajoutee au site impose de bump la valeur correspondante dans
EXPECTED, au meme titre que les compteurs affiches dans les pages HTML.

Chaque contenu est rattache a la page du site ou il vit (ligne "Page:"),
avec deduplication : un outil present sur l'accueil et dans la bibliotheque
n'apparait qu'une fois, rattache a sa page de reference.
"""
import glob
import html
import os
import re
import sys

SITE = "https://ia.rochane.fr"

# Fichier -> URL publique (sans extension, comme servie par Cloudflare Pages)
PAGE_URLS = {
    "index.html": SITE + "/",
    "conferences.html": SITE + "/conferences",
    "ateliers-formations.html": SITE + "/ateliers-formations",
    "accompagnement.html": SITE + "/accompagnement",
    "evaluer-ia.html": SITE + "/evaluer-ia",
    "ressources.html": SITE + "/ressources",
    "faq.html": SITE + "/faq",
}

PAGES_DESC = [
    (SITE + "/", "accueil : offres, livre, demarche, etudes de cas, contact et formulaire"),
    (SITE + "/conferences", "conferences IA et pedagogie : formats, themes, historique des 14 conferences"),
    (SITE + "/ateliers-formations", "ateliers et formations IA pour les equipes : deroulement, themes, historique des sessions"),
    (SITE + "/accompagnement", "accompagnement des organisations : demarche en quatre temps, perimetre, etudes de cas"),
    (SITE + "/evaluer-ia", "evaluer a l'ere de l'IA generative : le livre, les outils dedies, les publications"),
    (SITE + "/ressources", "bibliotheque en libre acces : outils, infographies, articles, webinaires, podcasts, BD"),
    (SITE + "/faq", "questions frequentes : accompagnement IA pour organisme de formation, formation des formateurs, presence France-Belgique, contact"),
]

# Ordre de lecture par section : la premiere page ou un contenu apparait
# devient sa page de reference.
PRIORITY = {
    "livre": ["index.html", "evaluer-ia.html"],
    "conferences": ["conferences.html", "evaluer-ia.html", "index.html"],
    "formations": ["ateliers-formations.html", "index.html"],
    "infographies": ["ressources.html", "index.html"],
    "bd": ["ressources.html", "index.html"],
    "projets": ["ressources.html", "evaluer-ia.html", "accompagnement.html", "index.html"],
    "articles": ["ressources.html", "evaluer-ia.html", "index.html"],
    "podcasts": ["ressources.html", "evaluer-ia.html", "index.html"],
    "webinaires": ["ressources.html", "index.html"],
    "faq": ["faq.html"],
}

# Effectif minimal attendu par section, renseigne a l'etat courant du site.
# A bump a chaque ressource ajoutee, comme les compteurs des pages HTML.
EXPECTED = {
    "infographies": 15,
    "bd": 1,
    "projets": 9,
    "articles": 7,
    "podcasts": 2,
    "conferences": 14,
    "formations": 21,
    "webinaires": 3,
    "faq": 8,
}


def clean(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace('­', '')
    return re.sub(r'\s+', ' ', s).strip()


def collect(docs, section, finder, key):
    """Concatene les trouvailles de chaque page (ordre de PRIORITY), dedupliquees."""
    seen, items = set(), []
    for fname in PRIORITY[section]:
        if fname not in docs:
            continue
        for item in finder(docs[fname]):
            k = key(item)
            if k in seen:
                continue
            seen.add(k)
            items.append((item, PAGE_URLS[fname]))
    return items


def check(section, items, dst):
    """Affiche l'effectif de la section et abandonne s'il est sous EXPECTED."""
    found, expected = len(items), EXPECTED[section]
    print(f"  {section}: {found}", flush=True)
    if found < expected:
        print(f"Erreur: section '{section}' incomplete, "
              f"{expected} entrees attendues au minimum, {found} trouvee(s).",
              file=sys.stderr)
        print(f"Abandon: {dst} n'a pas ete ecrit.", file=sys.stderr)
        sys.exit(1)
    return items


def main(src_dir, dst):
    docs = {}
    for fname in PAGE_URLS:
        path = os.path.join(src_dir, fname)
        if os.path.exists(path):
            docs[fname] = open(path, encoding='utf-8').read()

    out = [
        "# Base de connaissance, travaux de Rochane Kherbouche",
        "",
        "Travaux publies sur le portfolio ia.rochane.fr.",
        "Quand une question porte sur l'un de ces travaux, citer la ressource et fournir son URL si elle figure ci-dessous. Ne jamais fabriquer d'URL.",
        "Si une ressource n'a pas d'URL, la decrire sans inventer de lien.",
        "La ligne Page: indique ou le contenu se trouve sur le site : elle peut etre citee comme lien interne.",
        "",
        "## Pages du site",
    ]
    for url, desc in PAGES_DESC:
        out.append(f"- {url} : {desc}")
    out.append("")

    # Livre
    for fname in PRIORITY["livre"]:
        doc = docs.get(fname, "")
        m = re.search(r'class="book-h">(.*?)</h3>', doc, re.S)
        if not m:
            continue
        book_h = clean(m.group(1))
        book_st = clean(re.search(r'class="book-stitle">(.*?)</p>', doc, re.S).group(1))
        status = clean(re.search(r'class="book-status">(.*?)</span>', doc, re.S).group(1))
        status = status.split('·')[0].strip()
        status = status[0].lower() + status[1:]
        actions = re.search(r'class="book-actions">(.*?)</div>', doc, re.S).group(1)
        urls = re.findall(r'href="([^"]+)"', actions)
        out += [
            "## Livre",
            f"- {book_h} ({book_st})",
            f"  Commande ({status}): {urls[0]}",
            f"  Extrait gratuit et infos: {urls[1]}",
            f"  Page: {PAGE_URLS[fname]}",
            "",
        ]
        break

    # Infographies
    infog_re = re.compile(
        r'<a class="infog-card reveal" href="([^"]+)"[^>]*>'
        r'<span class="infog-idx">(.*?)</span><(?:span|h3) class="infog-name">(.*?)</(?:span|h3)>',
        re.S)
    infogs = check("infographies",
                   collect(docs, "infographies", infog_re.findall, key=lambda it: it[0]), dst)
    out.append(f"## Infographies ({len(infogs)})")
    for (url, idx, name), page in infogs:
        out += [f"- {clean(idx)} {clean(name)}", f"  URL: {url}", f"  Page: {page}"]
    out.append("")

    # BD : meme gabarit visuel que les infographies, distingue par la classe
    # inerte bd-card pour ne pas etre compte comme une infographie.
    bd_re = re.compile(
        r'<a class="infog-card bd-card reveal" href="([^"]+)"[^>]*>'
        r'<span class="infog-idx">(.*?)</span><(?:span|h3) class="infog-name">(.*?)</(?:span|h3)>',
        re.S)
    bds = check("bd", collect(docs, "bd", bd_re.findall, key=lambda it: it[0]), dst)
    out.append(f"## BD ({len(bds)})")
    for (url, idx, name), page in bds:
        out += [f"- {clean(idx)} {clean(name)}", f"  URL: {url}", f"  Page: {page}"]
    out.append("")

    # Projets et outils
    proj_re = re.compile(
        r'<a href="([^"]+)"[^>]*class="proj-card[^"]*"[^>]*>.*?'
        r'class="proj-name">(.*?)</(?:div|h3)>.*?class="proj-desc">(.*?)</div>',
        re.S)
    projs = check("projets",
                  collect(docs, "projets", proj_re.findall, key=lambda it: it[0]), dst)
    out.append(f"## Projets et outils ({len(projs)})")
    for (url, name, desc), page in projs:
        out += [f"- {clean(name)}: {clean(desc)}", f"  URL: {url}", f"  Page: {page}"]
    out.append("")

    # Articles
    art_re = re.compile(
        r'<a href="([^"]+)"[^>]*class="article-card[^"]*"[^>]*>.*?'
        r'class="article-cat">(.*?)</div>.*?class="article-title">(.*?)</(?:div|h3)>',
        re.S)
    arts = check("articles",
                 collect(docs, "articles", art_re.findall, key=lambda it: it[0]), dst)
    out.append(f"## Articles ({len(arts)})")
    for (url, cat, title), page in arts:
        out += [f"- [{clean(cat)}] {clean(title)}", f"  URL: {url}", f"  Page: {page}"]
    out.append("")

    # Podcasts
    def find_podcasts(doc):
        found = []
        for p in doc.split('<div class="podcast-card')[1:]:
            show = clean(re.search(r'class="podcast-show">(.*?)</div>', p, re.S).group(1))
            title = clean(re.search(r'class="podcast-title">(.*?)</(?:div|h3)>', p, re.S).group(1))
            desc = clean(re.search(r'class="podcast-desc">(.*?)</div>', p, re.S).group(1))
            link = re.search(r'<a href="([^"]+)"[^>]*class="podcast-play-btn', p)
            found.append((show, title, desc, link.group(1) if link else ""))
        return found

    pods = check("podcasts",
                 collect(docs, "podcasts", find_podcasts, key=lambda it: it[3] or it[1]), dst)
    out.append(f"## Podcasts ({len(pods)})")
    for (show, title, desc, url), page in pods:
        out.append(f"- {show}: {title}. {desc}")
        if url:
            out.append(f"  URL: {url}")
        out.append(f"  Page: {page}")
    out.append("")

    # Conferences
    conf_re = re.compile(
        r'<div class="conf-row[^"]*">.*?class="conf-title">(.*?)</div>'
        r'<div class="conf-meta">(.*?)</div></div>',
        re.S)

    def find_confs(doc):
        found = []
        for title, meta in conf_re.findall(doc):
            spans = [clean(s) for s in re.findall(r'<span[^>]*>(.*?)</span>', meta, re.S)]
            found.append((clean(title), ' '.join(spans)))
        return found

    confs = check("conferences",
                  collect(docs, "conferences", find_confs, key=lambda it: it[0]), dst)
    out.append(f"## Conferences ({len(confs)})")
    for (title, meta), page in confs:
        out += [f"- {title} ({meta})", f"  Page: {page}"]
    out.append("")

    # Formations et ateliers
    form_re = re.compile(
        r'<div class="form-row[^"]*">.*?class="form-title">(.*?)</div>'
        r'<div class="form-meta">(.*?)</div>',
        re.S)
    forms = check("formations",
                  collect(docs, "formations", form_re.findall, key=lambda it: clean(it[0])), dst)
    out.append(f"## Formations et ateliers ({len(forms)})")
    for (title, meta), page in forms:
        out += [f"- {clean(title)} ({clean(meta)})", f"  Page: {page}"]
    out.append("")

    # Webinaires
    web_re = re.compile(
        r'<div class="webinar-row[^"]*">.*?class="w-title">(.*?)</(?:div|h3)>'
        r'<div class="w-meta">(.*?)</div>',
        re.S)
    webs = check("webinaires",
                 collect(docs, "webinaires", web_re.findall, key=lambda it: clean(it[0])), dst)
    out.append(f"## Webinaires ({len(webs)})")
    for (title, meta), page in webs:
        out += [f"- {clean(title)} ({clean(meta)})", f"  Page: {page}"]
    out.append("")

    # Questions frequentes
    faq_re = re.compile(
        r'<div class="info-card[^"]*">.*?class="info-card-title">(.*?)</(?:div|h[23])>'
        r'.*?class="info-card-text">(.*?)</div>',
        re.S)
    faqs = check("faq",
                 collect(docs, "faq", faq_re.findall, key=lambda it: clean(it[0])), dst)
    out.append(f"## Questions frequentes ({len(faqs)})")
    for (q, a), page in faqs:
        out += [f"- {clean(q)}", f"  R: {clean(a)}", f"  Page: {page}"]
    out.append("")

    # Articles du site (dossier articles/) : uniquement les articles PUBLIES.
    # Regle : un article en brouillon porte <meta name="robots" content="noindex">
    # et reste donc invisible pour l'assistant tant qu'il n'est pas ecrit.
    articles = []
    for path in sorted(glob.glob(os.path.join(src_dir, "articles", "*.html"))):
        doc = open(path, encoding="utf-8").read()
        if re.search(r'name="robots"[^>]*noindex', doc):
            continue  # brouillon
        slug = os.path.basename(path)[:-5]
        m = re.search(r'<h1[^>]*>(.*?)</h1>', doc, re.S)
        title = clean(m.group(1)) if m else clean(re.search(r'<title>(.*?)</title>', doc, re.S).group(1))
        d = re.search(r'name="description" content="([^"]*)"', doc)
        desc = clean(d.group(1)) if d else ""
        articles.append((title, desc, f"{SITE}/articles/{slug}"))
    if articles:
        out.append(f"## Articles du site ({len(articles)})")
        for title, desc, url in articles:
            out.append(f"- {title}" + (f" : {desc}" if desc else ""))
            out += [f"  URL: {url}", f"  Page: {url}"]
        out.append("")

    open(dst, 'w', encoding='utf-8').write('\n'.join(out))


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 generate-knowledge.py <dossier_du_site> <fichier_sortie>", file=sys.stderr)
        print("Exemple: python3 generate-knowledge.py . knowledge.md", file=sys.stderr)
        sys.exit(2)
    main(sys.argv[1], sys.argv[2])
