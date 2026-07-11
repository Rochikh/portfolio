#!/usr/bin/env python3
"""Genere knowledge.md (base de connaissance du chatbot) depuis index.html.

Usage: python3 generate-knowledge.py index.html knowledge.md
"""
import html
import re
import sys


def clean(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace('­', '')
    return re.sub(r'\s+', ' ', s).strip()


def main(src, dst):
    doc = open(src, encoding='utf-8').read()

    out = [
        "# Base de connaissance, travaux de Rochane Kherbouche",
        "",
        "Travaux publies sur le portfolio ia.rochane.fr.",
        "Quand une question porte sur l'un de ces travaux, citer la ressource et fournir son URL si elle figure ci-dessous. Ne jamais fabriquer d'URL.",
        "Si une ressource n'a pas d'URL, la decrire sans inventer de lien.",
        "",
    ]

    # Livre
    book_h = clean(re.search(r'class="book-h">(.*?)</h3>', doc, re.S).group(1))
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
        "",
    ]

    # Infographies
    infogs = re.findall(
        r'<a class="infog-card[^"]*" href="([^"]+)"[^>]*>'
        r'<span class="infog-idx">(.*?)</span><span class="infog-name">(.*?)</span>',
        doc, re.S)
    out.append(f"## Infographies ({len(infogs)})")
    for url, idx, name in infogs:
        out += [f"- {clean(idx)} {clean(name)}", f"  URL: {url}"]
    out.append("")

    # Projets et outils
    projs = re.findall(
        r'<a href="([^"]+)"[^>]*class="proj-card[^"]*"[^>]*>.*?'
        r'class="proj-name">(.*?)</div>.*?class="proj-desc">(.*?)</div>',
        doc, re.S)
    out.append(f"## Projets et outils ({len(projs)})")
    for url, name, desc in projs:
        out += [f"- {clean(name)}: {clean(desc)}", f"  URL: {url}"]
    out.append("")

    # Articles
    arts = re.findall(
        r'<a href="([^"]+)"[^>]*class="article-card[^"]*"[^>]*>.*?'
        r'class="article-cat">(.*?)</div>.*?class="article-title">(.*?)</div>',
        doc, re.S)
    out.append(f"## Articles ({len(arts)})")
    for url, cat, title in arts:
        out += [f"- [{clean(cat)}] {clean(title)}", f"  URL: {url}"]
    out.append("")

    # Podcasts
    pods = doc.split('<div class="podcast-card')[1:]
    out.append(f"## Podcasts ({len(pods)})")
    for p in pods:
        show = clean(re.search(r'class="podcast-show">(.*?)</div>', p, re.S).group(1))
        title = clean(re.search(r'class="podcast-title">(.*?)</div>', p, re.S).group(1))
        desc = clean(re.search(r'class="podcast-desc">(.*?)</div>', p, re.S).group(1))
        out.append(f"- {show}: {title}. {desc}")
        link = re.search(r'<a href="([^"]+)"[^>]*class="podcast-play-btn', p)
        if link:
            out.append(f"  URL: {link.group(1)}")
    out.append("")

    # Conferences
    confs = re.findall(
        r'<div class="conf-row[^"]*">.*?class="conf-title">(.*?)</div>'
        r'<div class="conf-meta">(.*?)</div></div>',
        doc, re.S)
    out.append(f"## Conferences ({len(confs)})")
    for title, meta in confs:
        spans = [clean(s) for s in re.findall(r'<span[^>]*>(.*?)</span>', meta, re.S)]
        out.append(f"- {clean(title)} ({' '.join(spans)})")
    out.append("")

    # Formations et ateliers
    forms = re.findall(
        r'<div class="form-row[^"]*">.*?class="form-title">(.*?)</div>'
        r'<div class="form-meta">(.*?)</div>',
        doc, re.S)
    out.append(f"## Formations et ateliers ({len(forms)})")
    for title, meta in forms:
        out.append(f"- {clean(title)} ({clean(meta)})")
    out.append("")

    # Webinaires
    webs = re.findall(
        r'<div class="webinar-row[^"]*">.*?class="w-title">(.*?)</div>'
        r'<div class="w-meta">(.*?)</div>',
        doc, re.S)
    out.append(f"## Webinaires ({len(webs)})")
    for title, meta in webs:
        out.append(f"- {clean(title)} ({clean(meta)})")
    out.append("")

    open(dst, 'w', encoding='utf-8').write('\n'.join(out))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
