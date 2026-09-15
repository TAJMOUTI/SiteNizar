# SiteNizar — Project State

Dernière mise à jour : 2026-05-18

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
- Bootstrap legacy partiellement utilisé ;
- Paper Kit utilisé historiquement ;
- aucun React ;
- aucun Next.js ;
- aucun bundler ;
- XAMPP en local.

URL locale :

```text
localhost/sitenizar/home.html
```

## 3. Refonte en cours — 15 septembre 2026

Branche : `redesign/portfolio-editorial-motion`.
Direction inspirée de https://www.aashishthakuri.com/ : composition éditoriale, fond sombre et papier crème, animations, compétences en orbite et projets avec révélation ASCII.

La nouvelle page reste statique, avec CSS et JavaScript sans dépendances de runtime. Bootstrap, jQuery et Paper Kit sont conservés sur disque mais ne sont plus chargés. Le formulaire n8n et les informations des projets sont préservés.

Aperçu : `npm run dev`, puis `http://127.0.0.1:4173/home`.
Sauvegarde locale de la version précédente : `.cache/redesign-baseline`.
Guide de prévisualisation, fichiers et retour arrière : `docs/REFONTE-EDITORIALE.md`.

Les modifications ne sont pas commitées. Tout commit ou push nécessite l'autorisation de l'utilisateur.

### Avatar interactif — 15 septembre 2026

La section À propos affiche un personnage 3D construit en code, sans image. Il
tourne de lui-même, se pilote à la souris, au doigt et au clavier, et six zones
de vêtements mènent chacune à une section du portfolio. Une étiquette suit le
pointeur et nomme la destination. Les mêmes liens existent en texte sous le
personnage.

Les onze logos des technologies sont installés en SVG local dans
`assets/img/skills/`.

Three.js est vendu en version minifiée et chargé uniquement à l'approche de la
section.

Détail : `docs/IMAGES-ET-AVATAR.md`.
