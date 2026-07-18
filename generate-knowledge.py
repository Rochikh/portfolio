#!/usr/bin/env python3
"""Genere knowledge.md (base de connaissance du chatbot) depuis les pages du site.

Usage: python3 generate-knowledge.py <dossier_du_site> knowledge.md
Exemple: python3 generate-knowledge.py . knowledge.md

Chaque contenu est rattache a la page du site ou il vit (ligne "Page:"),
avec deduplication : un outil present sur l'accueil et dans la bibliotheque
n'apparait qu'une fois, rattache a sa page de reference.
"""
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
}

PAGES_DESC = [
    (SITE + "/", "accueil : offres, livre, demarche, etudes de cas, contact et formulaire"),
    (SITE + "/conferences", "conferences IA et pedagogie : formats, themes, historique des 14 conferences"),
    (SITE + "/ateliers-formations", "ateliers et formations IA pour les equipes : deroulement, themes, historique des sessions"),
    (SITE + "/accompagnement", "accompagnement des organisations : demarche en quatre temps, perimetre, etudes de cas"),
    (SITE + "/evaluer-ia", "evaluer a l'ere de l'IA generative : le livre, les outils dedies, les publications"),
    (SITE + "/ressources", "bibliotheque en libre acces : outils, infographies, articles, webinaires, podcasts"),
]

# Ordre de lecture par section : la premiere page ou un contenu apparait
# devient sa page de reference.
PRIORITY = {
    "livre": ["index.html", "evaluer-ia.html"],
    "conferences": ["conferences.html", "evaluer-ia.html", "index.html"],
    "formations": ["ateliers-formations.html", "index.html"],
    "infographies": ["ressources.html", "index.html"],
    "projets": ["ressources.html", "evaluer-ia.html", "accompagnement.html", "index.html"],
    "articles": ["ressources.html", "evaluer-ia.html", "index.html"],
    "podcasts": ["ressources.html", "evaluer-ia.html", "index.html"],
    "webinaires": ["ressources.html", "index.html"],
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
        r'<a class="infog-card[^"]*" href="([^"]+)"[^>]*>'
        r'<span class="infog-idx">(.*?)</span><span class="infog-name">(.*?)</span>',
        re.S)
    infogs = collect(docs, "infographies", infog_re.findall, key=lambda it: it[0])
    out.append(f"## Infographies ({len(infogs)})")
    for (url, idx, name), page in infogs:
        out += [f"- {clean(idx)} {clean(name)}", f"  URL: {url}", f"  Page: {page}"]
    out.append("")

    # Projets et outils
    proj_re = re.compile(
        r'<a href="([^"]+)"[^>]*class="proj-card[^"]*"[^>]*>.*?'
        r'class="proj-name">(.*?)</div>.*?class="proj-desc">(.*?)</div>',
        re.S)
    projs = collect(docs, "projets", proj_re.findall, key=lambda it: it[0])
    out.append(f"## Projets et outils ({len(projs)})")
    for (url, name, desc), page in projs:
        out += [f"- {clean(name)}: {clean(desc)}", f"  URL: {url}", f"  Page: {page}"]
    out.append("")

    # Articles
    art_re = re.compile(
        r'<a href="([^"]+)"[^>]*class="article-card[^"]*"[^>]*>.*?'
        r'class="article-cat">(.*?)</div>.*?class="article-title">(.*?)</div>',
        re.S)
    arts = collect(docs, "articles", art_re.findall, key=lambda it: it[0])
    out.append(f"## Articles ({len(arts)})")
    for (url, cat, title), page in arts:
        out += [f"- [{clean(cat)}] {clean(title)}", f"  URL: {url}", f"  Page: {page}"]
    out.append("")

    # Podcasts
    def find_podcasts(doc):
        found = []
        for p in doc.split('<div class="podcast-card')[1:]:
            show = clean(re.search(r'class="podcast-show">(.*?)</div>', p, re.S).group(1))
            title = clean(re.search(r'class="podcast-title">(.*?)</div>', p, re.S).group(1))
            desc = clean(re.search(r'class="podcast-desc">(.*?)</div>', p, re.S).group(1))
            link = re.search(r'<a href="([^"]+)"[^>]*class="podcast-play-btn', p)
            found.append((show, title, desc, link.group(1) if link else ""))
        return found

    pods = collect(docs, "podcasts", find_podcasts, key=lambda it: it[3] or it[1])
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

    confs = collect(docs, "conferences", find_confs, key=lambda it: it[0])
    out.append(f"## Conferences ({len(confs)})")
    for (title, meta), page in confs:
        out += [f"- {title} ({meta})", f"  Page: {page}"]
    out.append("")

    # Formations et ateliers
    form_re = re.compile(
        r'<div class="form-row[^"]*">.*?class="form-title">(.*?)</div>'
        r'<div class="form-meta">(.*?)</div>',
        re.S)
    forms = collect(docs, "formations", form_re.findall, key=lambda it: clean(it[0]))
    out.append(f"## Formations et ateliers ({len(forms)})")
    for (title, meta), page in forms:
        out += [f"- {clean(title)} ({clean(meta)})", f"  Page: {page}"]
    out.append("")

    # Webinaires
    web_re = re.compile(
        r'<div class="webinar-row[^"]*">.*?class="w-title">(.*?)</div>'
        r'<div class="w-meta">(.*?)</div>',
        re.S)
    webs = collect(docs, "webinaires", web_re.findall, key=lambda it: clean(it[0]))
    out.append(f"## Webinaires ({len(webs)})")
    for (title, meta), page in webs:
        out += [f"- {clean(title)} ({clean(meta)})", f"  Page: {page}"]
    out.append("")

    open(dst, 'w', encoding='utf-8').write('\n'.join(out))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
