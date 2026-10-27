# Moroccan Software Crafters · site des meetups

Site statique (HTML, CSS, JavaScript, sans build) hébergé sur GitHub Pages. Tout le contenu éditable vit dans des fichiers JSON sous `content/` : les pages HTML ne contiennent que la structure.

- `index.html` : accueil (format, historique, galerie, entreprises, SoCraTes, formules, FAQ)
- `meetup.html` : le déroulé d'un meetup (accueil, lightning talks, bubble topics, tables rondes, rétro)
- `socrates.html` : la conférence SoCraTes Maroc, les règles de l'open space, les éditions, l'appel au sponsoring et son formulaire
- `association.html` : mission, principes, histoire, façons de contribuer
- `actualites.html` : articles (récaps, annonces) ; `actualites.html?a=<slug>` affiche un article
- `accueillir.html` : formulaire en 4 étapes pour les entreprises hôtes

## Le CMS : `content/*.json`

| Fichier | Contenu |
|---|---|
| `site.json` | nom, liens, e-mail de contact, **endpoint du formulaire**, navigation, pied de page, nombre d'abonnés LinkedIn |
| `home.json` | textes de la page d'accueil (hero, format, FAQ, bandeau final…) |
| `offers.json` | les formules « Accueillir un meetup » (nom, prix, contreparties) |
| `sponsoring.json` | l'appel à partenaires SoCraTes : arguments, niveaux de partenariat, FAQ, formulaire |
| `events.json` | tous les événements (meetups, SoCraTes, Code Snacks) avec photos, sujets, liens |
| `companies.json` | les entreprises (nom, logo, lien LinkedIn) ; leurs rôles sont calculés depuis `events.json` |
| `meetup.json`, `socrates.json`, `association.json` | textes des pages correspondantes |
| `articles.json` | les actualités : titre, date, extrait, image, corps en Markdown simple |

Règles :

- Les textes sont injectés dans les éléments portant `data-cms="fichier.chemin.clé"`. Les listes (événements, cartes, FAQ…) sont rendues par `assets/js/home.js`, `pages.js` et `funnel.js`.
- Le champ `name` d'une entreprise doit être identique à la valeur `host` ou `sponsors[]` des événements : c'est ce qui relie les deux.
- Les corps d'articles acceptent : `## Titre`, paragraphes, `- listes`, `1. listes`, `> citation`, `**gras**`, `*italique*`, `[lien](url)`.
- Les photos sont dans `assets/img/meetups/` et référencées par leur nom sans extension (`"photo": "2026-10-sg-gscm-5"`). Les logos sont dans `assets/img/logos/` (`"logo": "axa.png"`, vide = monogramme).

### Ajouter un meetup

1. Déposer les photos dans `assets/img/meetups/` au format `AAAA-MM-hote-N.jpg`, redimensionnées (1600 px de large au plus) et sans métadonnées :
   ```bash
   python3 -c "from PIL import Image, ImageOps; im = ImageOps.exif_transpose(Image.open('in.jpg')).convert('RGB'); im.thumbnail((1600, 1600)); im.save('out.jpg', quality=80, optimize=True, progressive=True)"
   ```
2. Ajouter l'événement en tête de `content/events.json` (le plus récent d'abord).
3. Si l'hôte est nouveau : l'ajouter dans `content/companies.json` avec son logo (240 × 240 px, PNG) dans `assets/img/logos/`.
4. Facultatif : un récap dans `content/articles.json`.

## Brancher les formulaires

GitHub Pages ne sert que des fichiers statiques : les demandes (hébergement et sponsoring) partent vers un service tiers. Renseigner `form.endpoint` dans `content/site.json`.

| Service | Endpoint | Réglage |
|---|---|---|
| Formspree (gratuit jusqu'à 50 envois/mois) | `https://formspree.io/f/<id>` | rien de plus |
| Web3Forms (gratuit, 250 envois/mois) | `https://api.web3forms.com/submit` | `"extraFields": { "access_key": "<clé>" }` |
| Google Apps Script vers Google Sheets | URL de l'application web publiée | le script lit `e.postData.contents` (JSON) |

Sans endpoint, les formulaires ouvrent un e-mail pré-rempli vers `contact.email`. Sans aucun des deux, ils renvoient vers la page LinkedIn.

Chaque envoi contient un champ `type` (« Hébergement meetup » ou « Sponsoring SoCraTes »), les réponses, et les paramètres `utm_*` et le référent s'ils existent. Un champ caché bloque les robots simples.

## Tester en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Le contenu étant chargé par `fetch()`, le site doit être servi par HTTP (pas ouvert en `file://`).

## Publier

Dépôt : `bzinoun/moroccan-software-crafters`, branche `main`, dossier racine (Settings → Pages). Chaque push publie sur `https://bzinoun.github.io/moroccan-software-crafters/`. En cas de changement de domaine, mettre à jour `baseUrl` dans `content/site.json`, les balises `og:` des pages HTML, `sitemap.xml` et `robots.txt`.

## Sources des données

Base Notion « Events » de l'association et posts de la page LinkedIn, au 27 octobre 2026. Les inscriptions Luma ne sont connues que depuis 2025. Les logos viennent des pages LinkedIn des entreprises.
