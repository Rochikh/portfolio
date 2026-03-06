# 🤖 Portfolio – Rochane Kherbouche

> Portfolio personnel d'expert IA & Pédagogie Numérique, hébergé sur GitHub Pages.

## 🚀 Déploiement sur GitHub Pages

### Étape 1 – Créer le dépôt GitHub
1. Aller sur [github.com/new](https://github.com/new)
2. Nommer le dépôt : **`portfolio`** (ou `rochane.fr`)
3. Le laisser **Public**
4. Cliquer **Create repository**
### Étape 2 – Pousser le code
```bash
git init
git add .
git commit -m "🚀 Initial portfolio"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/portfolio.git
git push -u origin main
```

### Étape 3 – Activer GitHub Pages
1. Aller dans **Settings → Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** / **(root)**
4. Cliquer **Save**
5. Ton site sera dispo sur : `https://TON_USERNAME.github.io/portfolio/`

### Étape 4 – Ajouter ton nom de domaine personnalisé
1. Dans **Settings → Pages → Custom domain**
2. Entrer : `ia.rochane.fr` (ou autre sous-domaine)
3. Chez ton registraire (ex. OVH), ajouter un enregistrement DNS :
   - Type : `CNAME`
   - Nom : `ia`
   - Valeur : `TON_USERNAME.github.io`
4. Cocher **Enforce HTTPS**

---

## ✏️ Mettre à jour le site

### Modifier le contenu
Tout le site est dans **un seul fichier** : `index.html`

Les sections à modifier sont bien commentées avec des blocs `<!-- ═══ SECTION ═══ -->`.

### Ajouter une conférence
Trouver la section `<!-- CONFÉRENCES -->` et ajouter :
```html
<div class="conf-card fade-in">
  <div class="conf-flag">🇫🇷</div>
  <div class="conf-content">
    <div class="conf-name">Nom de la conférence</div>
    <div class="conf-meta">
      <span class="conf-location"><i class="fas fa-map-marker-alt"></i>Ville</span>
      <span class="conf-category">Catégorie</span>
    </div>
  </div>
</div>
```

### Pousser les modifications
```bash
git add .
git commit -m "✏️ Mise à jour conférences"
git push
```
GitHub Pages se met à jour automatiquement en ~1 minute.

---

## 🏗️ Structure du projet

```
portfolio/
├── index.html   ← Tout le site (HTML + CSS + JS)
└── README.md    ← Ce fichier
```

## 🎨 Couleurs principales
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--blue` | `#4472C4` | Couleur principale |
| `--blue-dark` | `#2c4a8a` | Titres, hover |
| `--rose` | `#d4a5a5` | Accents, badges |

