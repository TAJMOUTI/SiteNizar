# Refonte éditoriale du portfolio

Branche : `redesign/portfolio-editorial-motion`.
Référence analysée le 15 septembre 2026 : https://www.aashishthakuri.com/.

## Prévisualiser

```sh
npm run dev
```

Ouvrir http://127.0.0.1:4173/home. Le serveur écoute uniquement en local.
XAMPP reste utilisable avec http://localhost/sitenizar/home.html.
La version publique reste inchangée tant qu'aucun déploiement n'est effectué.

## Direction retenue

- Fond sombre quadrillé, titres rouge brique, composition avec éléments flottants.
- Section de présentation façon carnet : papier crème, bleu, écriture manuscrite et portrait personnel.
- Compétences en orbite, sélection d'un outil pour afficher son utilisation concrète.
- Parcours professionnel et expérimentations personnelles identifiés séparément.
- Sept projets : aperçu ASCII calculé depuis les captures existantes, révélation au survol et fiche détaillée.
- Sur appareil tactile, captures immédiatement visibles et ouverture des fiches en un appui.
- Contact direct, GitHub, LinkedIn et CV visibles ; formulaire n8n conservé.
- Défilement naturel, indicateur de section, transitions d'apparition, pause des animations et prise en compte de la réduction des mouvements.

Adaptation de la direction visuelle, sans reprise des illustrations, photos, textes ou code applicatif de l'auteur. Le portrait et les captures appartiennent au portfolio existant. Les polices Montserrat et Caveat sont chargées localement avec leurs licences SIL OFL.

## Fichiers

- `home.html` : nouvelle composition, mêmes liens personnels, métadonnées Netlify et formulaire.
- `assets/css/editorial.css` : design, responsive, animations et styles des fiches.
- `assets/css/contact-form.css` : styles existants du formulaire et des notifications, isolés du thème historique.
- `assets/js/projects-data.js` : contenu intégral des sept études de cas, extrait de l'ancienne version.
- `assets/js/editorial.js` : menu, navigation, effets, orbites, ASCII et fenêtres projet.
- `assets/js/contact-automation.js` : ajout du confinement du focus clavier dans le formulaire. Les destinations et traitements n8n restent inchangés.
- `assets/fonts/` : Montserrat Extra Bold, Caveat Bold et licences.
- `scripts/check-html.js` : contrôle des sections actives, identifiants, ancres, chemins sensibles à la casse et descriptions d'images. Ce contrôle ciblé n'est pas un validateur HTML complet.
- `scripts/check-files.js` : vérifie les ressources de la refonte.
- `scripts/serve.js`, `package.json` : aperçu local sans installation de dépendances.
- `scripts/restore-before-redesign.js` : retour à la version précédente.

Les anciens fichiers CSS/JS et les images restent présents. Bootstrap, jQuery et Paper Kit ne sont plus chargés par la nouvelle page.
Les changements déjà présents dans `assets/js/realisations.js` viennent des corrections précédant la refonte ; ce fichier n'est plus chargé.

## Retour arrière

Une branche ne suffit pas à isoler des modifications non commitées. Une sauvegarde de l'état de travail exact, incluant les corrections précédentes, a été créée dans `.cache/redesign-baseline` (dossier ignoré par Git).
Une deuxième copie existe dans `C:/Users/dbasc/AppData/Local/Temp/sitenizar-before-redesign-20260915-035132`.

Voir d'abord les fichiers concernés :

```sh
node scripts/restore-before-redesign.js
```

Pour retrouver la page précédente :

```sh
node scripts/restore-before-redesign.js --apply
```

Le script sauvegarde au préalable les fichiers de la refonte dans `.cache/redesign-before-restore-<horodatage>`, puis restaure les six fichiers existants modifiés pour la refonte, y compris l'état du projet. Il ne supprime aucun asset et ne fait ni commit ni push. Les nouveaux fichiers deviennent simplement inutilisés par l'ancienne page.
Ne pas supprimer `.cache/redesign-baseline` avant d'avoir validé la refonte ou créé une sauvegarde durable. Ce mécanisme local n'est pas disponible dans un autre clone Git.

## Vérifications

- Contrôles de fichiers et de structure HTML, syntaxe JavaScript, `git diff --check`.
- Chrome automatisé : largeurs 320, 390, 768, 1024 et 1440 px, sans débordement horizontal.
- Menu mobile, sept études de cas, fermeture avec Échap, focus du formulaire, sélection des compétences.
- Formulaire avec réponses simulées : succès, refus métier et erreur HTTP. Aucune requête réelle au webhook.
- PDF vérifié par sa signature, sauvegarde inaccessible via le serveur de prévisualisation.
- Contenu principal disponible sans JavaScript ; fiches interactives et formulaire nécessitent JavaScript, liens email et CV disponibles directement.
- Rendu ASCII testé dans Chrome avec animations actives ; version sans mouvements testée également.
- Axe, règles WCAG 2 A/AA et 2.1 AA : aucune violation détectée dans la configuration mobile testée, sur la page, une fiche projet et le formulaire. Ce résultat automatisé ne constitue pas une certification d'accessibilité.
- Retour arrière testé sur des copies isolées : simulation sans écriture, restauration des six fichiers et conservation de la refonte avant restauration.

Le fonctionnement réel des emails, du CRM et des autres services n8n n'a pas été retesté. Les changements du workflow restent reportés à la demande de l'utilisateur. Aucun commit ni push n'a été effectué.

## Ajustements suivants

Les projets sont désormais alignés et précèdent le parcours. Les compétences continuent de tourner au survol et à la sélection. Les fiches proposent une navigation précédent/suivant, également disponible avec les flèches du clavier.

L'éditeur personnel est disponible uniquement avec le serveur local à /admin. Voir ESPACE-PROJETS-LOCAL.md.

## Avatar de la section À propos

L'avatar remplace le portrait fixe. C'est un personnage 3D unique, construit en
code, qui tourne de lui-même et dont six zones de vêtements mènent chacune à une
section. Le détail est dans IMAGES-ET-AVATAR.md.

Fichiers ajoutés : `assets/css/avatar.css`, `assets/js/avatar.js`,
`assets/js/avatar-model.js`, `assets/js/vendor/three.module.min.js`,
`assets/js/vendor/three.core.min.js`, `scripts/build-avatar-image.js`.

Fichiers modifiés : `home.html` (feuille de style, bloc avatar, script en
module), `scripts/serve.js` (type MIME WebP), `scripts/check-files.js`.

Three.js est la version minifiée officielle r180, chargée seulement quand la
carte approche de l'écran.

Points de retour : `.cache/before-avatar-integration/`, puis
`.cache/before-avatar-revision/`, puis `.cache/before-avatar-final/`.
