# SiteNizar — Project State

Dernière mise à jour : 2026-09-15

> Point d'entrée pour toute nouvelle modification : `NOTE-PROJET.md`.
> Ce fichier garde les objectifs et un historique court.

## 1. Objectif du portfolio

SiteNizar est un portfolio personnel professionnel orienté :

- ingénierie fullstack ;
- Product Owner / Project Manager ;
- automatisation n8n ;
- outils métier ;
- dashboards ;
- applications internes ;
- workflows industriels ;
- intégration IA dans des processus métier.

Objectif actuel : stabiliser une V1 crédible, démontrable et vendable avant de passer à une Phase 2 plus immersive.

---

## 2. Stack actuelle

Le portfolio est un site statique :

- HTML ;
- CSS ;
- JavaScript vanilla ;
- Three.js r180 minifié, pour l'avatar 3D uniquement ;
- aucun React ;
- aucun Next.js ;
- aucun bundler ;
- déploiement automatique par Netlify depuis `main`.

Bootstrap, jQuery et Paper Kit sont encore présents dans le dépôt mais ne sont
plus chargés par la page.

En ligne : https://nizart.netlify.app/home

En local :

```text
npm run dev                         → http://127.0.0.1:4173/home
XAMPP                               → localhost/sitenizar/home.html
```

## 3. Refonte éditoriale — publiée le 15 septembre 2026

Branche : `redesign/portfolio-editorial-motion`, fusionnée dans `main` au commit `db73e8c`.
Direction inspirée de https://www.aashishthakuri.com/ : composition éditoriale, fond sombre et papier crème, animations, compétences en orbite et projets avec révélation ASCII.

La nouvelle page reste statique, avec CSS et JavaScript sans dépendances de runtime. Bootstrap, jQuery et Paper Kit sont conservés sur disque mais ne sont plus chargés. Le formulaire n8n et les informations des projets sont préservés.

Version précédente dans Git : commit `28c0cda`.
Détail de la refonte : `docs/REFONTE-EDITORIALE.md`.

Tout commit, push ou fusion nécessite l'autorisation de l'utilisateur.

### Avatar interactif — 15 septembre 2026

La section À propos affiche un personnage 3D construit en code, sans image. Il
tourne de lui-même, se pilote à la souris, au doigt et au clavier, et six zones
de vêtements mènent chacune à une section du portfolio. Une étiquette suit le
pointeur et nomme la destination. Les mêmes liens existent en texte sous le
personnage.

Les onze logos des technologies sont installés en SVG local dans
`assets/img/skills/`.

Three.js est vendu en version minifiée et chargé à l'approche de la section.
Sur un grand écran, il est en pratique téléchargé dès le premier écran.

Détail : `docs/IMAGES-ET-AVATAR.md`.

## 4. Prochaines étapes

Liste priorisée dans `NOTE-PROJET.md`.
