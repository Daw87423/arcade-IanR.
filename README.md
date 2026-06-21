# Arcade — 4 jeux avec comptes joueurs

Snake, 2048, Motus et Morpion réunis derrière **une seule connexion**.
Les comptes sont stockés côté serveur (Netlify Blobs), mots de passe hachés (scrypt).

## Comment ça marche

- `public/index.html` : menu + écran de connexion / inscription + espace admin.
- Les 4 jeux sont **protégés** : sans session valide, on est renvoyé au menu.
- Les records sont enregistrés **par compte et par jeu** (Snake et 2048).
- L'accès admin (engrenage ⚙ en haut à droite) affiche la liste des identifiants
  et leurs records.

## Accès administrateur

- Identifiant : **Ian**
- Code : **2048**

Modifiables sans toucher au code via les variables d'environnement `ADMIN_ID` et
`ADMIN_CODE` (Netlify → Site settings → Environment variables).

## ⚠️ Conserver les comptes déjà créés sur le 2048

Les comptes existants sont stockés dans le **store Netlify Blobs « users » du site**.
Pour les conserver, **déployez ce projet sur le MÊME site Netlify** que la version
2048 précédente (re-déploiement du site existant), et non sur un nouveau site.
Un nouveau site = un nouveau stockage = comptes repartis de zéro.

## Déploiement

Le glisser-déposer (Netlify Drop) ne suffit pas : le backend doit installer ses
dépendances. Deux méthodes :

### A — via GitHub (sans terminal)
1. Créez (ou réutilisez) un dépôt sur https://github.com.
2. Déposez **tout le contenu de ce dossier** dans le dépôt.
3. Sur Netlify, ouvrez le site existant → onglet **Deploys**, ou
   **Add new site → Import an existing project → GitHub**, puis choisissez le dépôt.
4. Réglages par défaut (le `netlify.toml` configure tout) → **Deploy**.

### B — via le terminal (Netlify CLI)
```bash
npm install -g netlify-cli
netlify login
netlify link        # pour relier au site existant (conserve les comptes)
netlify deploy --build --prod
```

## Structure

```
public/index.html     menu + connexion + admin
public/auth.js        helper d'authentification partagé
public/snake.html     jeux (protégés)
public/2048.html
public/motus.html
public/morpion.html
netlify/functions/    signup, login, score, admin
netlify/lib/store.mjs stockage + hachage
```
