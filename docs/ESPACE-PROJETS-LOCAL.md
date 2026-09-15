# Ajouter un projet depuis son ordinateur

1. Dans le dossier du portfolio, lancer la commande npm run dev.
2. Ouvrir http://127.0.0.1:4173/admin.
3. Remplir le titre, la catégorie et la présentation.
4. Choisir une image PNG, JPEG ou WebP (maximum 5 Mo).
5. Facultativement, ajouter le lien public, les mots-clés, une capture détaillée et les textes de l'étude de cas.
6. Cliquer sur « Ajouter à mon portfolio local », puis recharger le portfolio.

Cette interface est servie uniquement par le serveur local Node, lié à l'adresse de boucle locale. Elle n'est pas une interface administrateur Netlify et ne nécessite pas de mot de passe. Elle suppose que l'accès à la session de cet ordinateur est réservé à son propriétaire.

Les écritures exigent une origine locale concordante et un jeton temporaire. Aucun jeton n'est enregistré dans le dépôt. L'API locale n'autorise pas les requêtes d'un site tiers. Aucun accès SSH, n8n, email ou compte externe n'est utilisé.

L'ajout modifie assets/js/projects-data.js, les cartes statiques de home.html et ajoute les images dans assets/img/realisations/custom/. Les versions précédentes du HTML et des données sont sauvegardées dans .cache/project-editor-backups/ avant l'écriture.

Le projet ajouté apparaît à la suite des autres et participe à la navigation précédent/suivant. Les rubriques facultatives laissées vides ne sont pas affichées dans sa fiche.

Rien n'est publié automatiquement : le commit, le push et le déploiement restent des étapes séparées à valider.
Une interface administrateur utilisable sur Internet nécessiterait une authentification et un stockage adaptés ; elle n'est pas activée ici.

## Point de retour de ces ajustements

Avant ces changements, les cinq fichiers existants concernés ont été copiés dans .cache/before-portfolio-adjustments/ : HTML, CSS éditorial, JavaScript éditorial, données projets et serveur local. Cette sauvegarde est distincte de celle d'avant la refonte.
Les nouveaux scripts de l'éditeur peuvent rester sur disque si l'interface est retirée : l'ancien serveur et l'ancienne page ne les utiliseront pas.

## Vérifications effectuées

Ajout complet testé dans une copie temporaire avec téléversement d'image, persistance dans le HTML et les données, sauvegarde automatique et navigation jusqu'au nouveau projet. La vraie galerie reste à sept projets.

Requêtes provenant d'une autre origine, jeton manquant et lien non HTTPS refusés sans modifier les fichiers. Ordre des sections, alignement des cartes, orbites toujours animées au survol, sélection d'un outil et navigation mobile des fiches vérifiés dans Chrome.
