# Note projet — Portfolio Nizar Tajmouti

Mise à jour : 27 septembre 2026.
À lire avant toute nouvelle modification. Elle résume ce qui a été fait, l'état
réel du site et les prochaines étapes, par ordre de priorité.

---

## En bref

| Élément | État |
| ------- | ---- |
| Site en ligne | https://nizart.netlify.app/home |
| Déploiement | Automatique par Netlify à chaque push sur `main` |
| Dernier commit sur `main` | `db73e8c` — refonte éditoriale et avatar 3D |
| Dernier état avant la refonte | `28c0cda` |
| Arbre de travail | Propre, tout est commité et publié |
| Domaine `nizar-tajmouti.fr` | Ne résout pas |

Le site est une page statique unique, sans framework ni étape de compilation.
Ce qui est dans le dépôt est ce qui est publié.

---

## Démarrer

```sh
npm run dev          # aperçu local sur http://127.0.0.1:4173/home
npm run check        # vérifie la présence des fichiers indispensables
npm run check:html   # vérifie sections, ancres, casse des chemins et textes alternatifs
```

Aucune installation n'est nécessaire pour ces trois commandes.
XAMPP reste utilisable sur http://localhost/sitenizar/home.html.

Pour publier, pousser sur `main`. Netlify déploie en une vingtaine de secondes.

---

## Architecture actuelle

### Ce que la page charge

| Fichier | Rôle |
| ------- | ---- |
| `home.html` | Toute la page |
| `assets/css/editorial.css` | Thème, mise en page, responsive, animations |
| `assets/css/contact-form.css` | Formulaire de contact et notifications |
| `assets/css/avatar.css` | Carte de l'avatar 3D |
| `assets/js/editorial.js` | Menu, apparitions, orbites, aperçus ASCII, fiches projet |
| `assets/js/projects-data.js` | Contenu détaillé des sept études de cas |
| `assets/js/contact-automation.js` | Envoi du formulaire vers le workflow n8n |
| `assets/js/avatar.js` | Chargement et commandes de l'avatar, en module |
| `assets/js/avatar-model.js` | Construction, rendu et zones du personnage |
| `assets/js/vendor/three.*.min.js` | Three.js r180 minifié |

Les polices Montserrat et Caveat sont servies localement, licences à côté.

### Les sections, dans l'ordre

`#accueil`, `#propos`, `#skills`, `#realisations`, `#experience`, `#contact`.

### L'avatar 3D

Personnage construit entièrement en code, sans image. Il tourne de lui-même,
s'arrête quand le pointeur se pose dessus, et se pilote au clavier.

| Zone | Destination |
| ---- | ----------- |
| Tête et cou | Accueil |
| Veste et buste | À propos |
| Manches et mains | Compétences |
| Poche poitrine | Projets |
| Pantalon | Parcours |
| Chaussures | Contact |

La tête pointe vers Accueil par choix par défaut, faute d'autre section libre.
Détails complets dans `docs/IMAGES-ET-AVATAR.md`.

### L'éditeur de projets local

`npm run dev`, puis http://127.0.0.1:4173/admin. Il ajoute un projet dans
`projects-data.js` et dans les cartes de `home.html`. Il ne fonctionne qu'en
local. Mode d'emploi dans `docs/ESPACE-PROJETS-LOCAL.md`.

---

## Ce qui a été fait pendant cette session

1. **Audit complet** du portfolio, côté recruteur et côté technique : sécurité,
   responsive, performance, référencement.
2. **Vérification du site en ligne.** Deux constats de l'audit se sont révélés
   faux sur Netlify et ont été retirés, dont le lien du CV qui fonctionne.
3. **Intégration de l'avatar**, qui existait en pièces détachées sans être
   branché dans la page.
4. **Three.js remplacé** par sa version minifiée officielle : 700 Ko au lieu de
   1,9 Mo.
5. **Correctifs du serveur local** : le WebP était servi avec un mauvais type,
   ce qui empêchait son affichage.
6. **Responsive de l'avatar** corrigé sur mobile et tablette. Une règle tablette
   rétablissait deux colonnes sur téléphone.
7. **Révisions successives de l'avatar**, à ta demande :
   - vues illustration puis photo retirées, seule la 3D reste ;
   - chemise et cravate remplacées par une encolure simple ;
   - barbe refaite pour entourer tout le visage ;
   - sélection par zone entière avec teinte bleu-gris ;
   - pantalon et chaussures unifiés, sans vide entre les jambes ;
   - tête séparée du buste, poche rendue cliquable ;
   - cadrage calculé sur les dimensions réelles du personnage ;
   - rotation automatique par défaut et étiquette qui suit le pointeur.
8. **Documentation** mise à jour à chaque étape.
9. **Commit, push et fusion dans `main`**, puis vérification sur le site publié :
   aucune erreur console, aucune requête en échec, aucun débordement.

La refonte éditoriale elle-même avait été engagée avant cette session. Elle est
décrite dans `docs/REFONTE-EDITORIALE.md`.

---

## Où en est le projet

### Réglé depuis l'audit

- Bootstrap, jQuery, Paper Kit et Font Awesome ne sont plus chargés.
- Les balises canonical et Open Graph pointent vers `nizart.netlify.app`.
- Email, LinkedIn, GitHub et CV sont visibles en permanence.
- Les compétences sont recentrées sur onze technologies réellement utilisées.
- Le labo n8n est présenté comme projet personnel et non comme un emploi.
- Les scripts de contrôle fonctionnent à nouveau.

### Toujours ouvert

**Côté recruteur**

- La page d'accueil ne donne ni localisation, ni disponibilité, ni type de poste recherché.
- Aucune formation n'apparaît sur la page.
- Les projets n'ont pas de chiffres d'impact et DataHouse n'a ni employeur ni période.
- Les captures de projets sont masquées derrière un rendu ASCII jusqu'au survol.

**Côté technique**

- Les pages légales sont rédigées mais restent des brouillons : voir
  `docs/SECURITE-ET-CONFORMITE.md` pour la liste des informations à fournir.
- La validation anti-spam du formulaire reste entièrement côté navigateur.
- Aucune mesure d'audience, aucune sauvegarde automatisée du workflow n8n.

### Mesures sur le site publié

Écran de 1440 × 900, cache désactivé.

| Mesure | Valeur |
| ------ | ------ |
| Premier écran | 482 Ko, 16 requêtes |
| Page entière après défilement | 3,1 Mo, 34 requêtes |
| dont images | 2,7 Mo |
| dont polices | 207 Ko |
| dont scripts | 186 Ko |

Les sept vignettes de projets en PNG représentent à elles seules 2,6 Mo.
La plus lourde pèse 796 Ko.

Aucun score Lighthouse n'a été mesuré.

---

## Pièges connus

- **Netlify publie tout le dépôt.** `scripts/`, `docs/`, `AGENTS.md`, cette note
  et les anciennes librairies sont accessibles en ligne. L'éditeur local est
  visible sur `/scripts/project-editor.html`, sans pouvoir rien écrire.
- **Deux sources pour les projets.** Le contenu vit à la fois dans
  `projects-data.js` et dans les cartes de `home.html`. Modifier l'un sans l'autre
  crée des incohérences.
- **Three.js se charge dès le premier écran** sur un grand écran, car la section
  À propos est trop proche de l'en-tête pour la marge de déclenchement actuelle.
- **La racine du site affiche l'accueil** alors qu'aucun `index.html` n'existe.
  Le mécanisme n'est pas documenté. À vérifier dans Netlify avant de renommer
  `home.html`.
- **`gulpfile.js` est cassé.** Il compile un dossier `assets/scss` qui n'existe pas.
- **`.cache/` n'est pas suivi par Git.** Les sauvegardes qu'il contient
  n'existent que sur cette machine.
- **`scripts/restore-before-redesign.js` est dépassé.** Il dépend de `.cache/`.
  Pour revenir en arrière, utiliser Git.
- **Tests automatisés dans Chrome sans fenêtre** : l'option
  `captureBeyondViewport` fait disparaître les éléments superposés au canvas,
  et les animations peuvent sembler figées tant qu'aucune image n'est demandée.
- **sharp** transforme un tampon alpha à un canal en trois canaux lors d'un flou,
  ce qui corrompt silencieusement un masque.

---

## Prochaines étapes

### Traité le 27 septembre 2026

En-têtes de sécurité, `robots.txt`, plan du site, page 404, pages légales en
brouillon, jeu de favicons, image de partage, titre de la page, conversion des
images en WebP et des polices en WOFF2, tailles des cibles tactiles.

### Priorité 1 — décisions qui t'appartiennent

1. **Compléter les pages légales** et retirer leur bandeau de brouillon, ainsi
   que la balise `noindex`. Liste précise dans `docs/SECURITE-ET-CONFORMITE.md`.
2. **Choisir l'objectif principal du site** : emploi salarié, missions freelance,
   ou les deux. Les appels à l'action pourront ensuite être harmonisés.
3. **Décider d'une mesure d'audience**, ou acter qu'il n'y en aura pas.

### Priorité 2 — ce que voit un recruteur

4. Compléter l'accueil : localisation, disponibilité, années d'expérience.
5. Réintroduire la formation. L'ancienne section est dans `docs/archive/`.
6. Chiffrer les projets et préciser l'employeur et la période de DataHouse.
7. Montrer une capture lisible sans survol sur les projets principaux.

### Priorité 3 — robustesse

8. Renforcer le formulaire côté n8n : limitation du débit et validation serveur.
9. Sauvegarder le workflow n8n et les demandes reçues.
10. Déclarer le site dans la Search Console.
11. Relier `nizar-tajmouti.fr` à Netlify, ou abandonner ce domaine.

### Priorité 4 — nettoyage

12. Retirer les dix-huit fichiers CSS et JS hérités, désormais renvoyés en 404
    par `_redirects` mais toujours présents dans le dépôt.
13. Retirer les images non référencées.
14. Supprimer `gulpfile.js`.
15. Ne garder qu'une source pour les projets.

## Revenir en arrière

Tout est dans Git, c'est la méthode à privilégier.

```sh
git revert db73e8c    # annule la refonte sur main par un nouveau commit
```

Pour seulement consulter l'ancienne version sans rien modifier :

```sh
git switch --detach 28c0cda
```

Sauvegardes locales supplémentaires, hors Git :

| Dossier `.cache/` | Contenu |
| ----------------- | ------- |
| `redesign-baseline/` | Avant toute la refonte |
| `before-avatar-integration/` | Avant l'intégration de l'avatar |
| `before-avatar-revision/` | Avant la révision de la tête et de la sélection |
| `before-avatar-final/` | Avant le retrait de la photo et la rotation par défaut |
| `avatar-sources/` | Illustrations générées lors des essais, non utilisées |

---

## Documentation

| Fichier | Contenu |
| ------- | ------- |
| `NOTE-PROJET.md` | Cette note, point d'entrée |
| `SITE_NIZAR_PROJECT_STATE.md` | Objectifs et historique court |
| `AGENTS.md` | Règles pour les assistants de code |
| `docs/REFONTE-EDITORIALE.md` | Refonte éditoriale : direction, fichiers, vérifications |
| `docs/IMAGES-ET-AVATAR.md` | Avatar 3D, zones, poids, icônes |
| `docs/ESPACE-PROJETS-LOCAL.md` | Utilisation de l'éditeur de projets local |
| `docs/SECURITE-ET-CONFORMITE.md` | Sécurité, sauvegardes, anti-spam, audience, pages légales |
