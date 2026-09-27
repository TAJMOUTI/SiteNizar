# Avatar de la section À propos

## Ce qui est en place

La section À propos affiche un personnage 3D unique, construit entièrement en
code. Il n'y a plus de vue illustration ni de vue photo, donc plus de sélecteur.

Le personnage tourne tout seul dès son apparition. La rotation se met en pause
quand le pointeur se pose dessus, pour que la surface visée ne glisse pas sous
le curseur, et repart quand le pointeur ressort. Elle respecte aussi le réglage
système de réduction des animations et le bouton de pause général de la page.

Commandes disponibles sous le personnage : tourner à gauche, revenir de face,
arrêter ou relancer la rotation, tourner à droite. Au clavier, les flèches
gauche et droite tournent le personnage, la touche Origine le remet de face.

## Les six zones

Passer le pointeur sur un vêtement teinte toute la zone vers un bleu-gris et
affiche une étiquette collée au pointeur qui nomme la destination. Un clic
ouvre la section.

| Zone            | Destination |
| --------------- | ----------- |
| Tête et cou     | Accueil     |
| Veste et buste  | À propos    |
| Manches et mains| Compétences |
| Poche poitrine  | Projets     |
| Pantalon        | Parcours    |
| Chaussures      | Contact     |

Chaque zone regroupe toutes ses surfaces : viser une jambe éclaire le pantalon
entier, viser une chaussure éclaire la paire.

Le rapprochement entre la tête et l'accueil a été choisi faute d'indication :
c'était la seule section encore libre. À changer si une autre lecture convient
mieux.

Sur écran tactile il n'y a pas de survol, donc pas d'étiquette. Les liens texte
sous le personnage mènent aux mêmes sections, et servent aussi au clavier et
aux lecteurs d'écran.

## Fichiers

- `assets/css/avatar.css` : styles du composant, isolés du thème éditorial.
- `assets/js/avatar.js` : chargement et commandes, chargé comme module.
- `assets/js/avatar-model.js` : construction, rendu et interactions du personnage.
- `assets/js/vendor/three.module.min.js` et `three.core.min.js` : Three.js r180,
  version minifiée, licence MIT conservée à côté.

Le composant est retirable : supprimer le bloc `avatar-card` de `home.html`,
la feuille de style et les deux scripts suffit.

## Tête et ressemblance

La tête a été refaite d'après le portrait de l'en-tête (`assets/img/Nizar.jpg`),
en gardant le style du personnage.

- Crâne et visage forment une seule surface : une sphère déformée par des
  champs lisses (arcade, orbites, pommettes, menton, mâchoire). Il n'y a plus de
  sphères empilées qui créaient des bosses pendant la rotation.
- Barbe et cheveux sont deux couches de cette même surface. Leurs bords
  s'estompent par transparence, donc ils restent collés au visage sous tous les
  angles. La barbe, taillée comme sur les photos, suit une ligne de joue droite
  du favori à la moustache ; les favoris s'éclaircissent vers le dégradé, et le
  menton pointe un peu vers l'avant. La moustache repose sur la lèvre et rejoint
  la barbe. La nuque reste nue ; les tempes sont dégarnies, les côtés et
  l'arrière portent un dégradé court.
- Des boucles serrées sur le dessus, des yeux bruns plissés par le sourire avec
  paupières, des sourcils épais, un nez droit et un sourire qui montre les dents.
- La veste a un col polaire montant, ouvert devant, et un relief polaire
  uniforme, dessiné une fois sur un canvas, à la place des touffes qui
  s'enfonçaient dans le tissu. Une ombre douce pose les pieds sur le socle.

Le portrait ne montre ni les côtés ni l'arrière de la tête : ces zones restent
volontairement sobres. Une photo de profil permettrait de les affiner.

La version précédente du modèle reste dans l'historique Git (`main`, commit
`6d466f4`) et, hors suivi, dans `.cache/before-avatar-likeness/`.

## Poids et repli

Three.js n'est téléchargé que lorsque la carte approche de l'écran, avec une
marge de 350 pixels. Cela représente environ 700 Ko avant compression et 175 Ko
une fois compressés par l'hébergeur. Rien n'est chargé si le visiteur ne
descend jamais jusqu'à la section.

Quand le navigateur le permet (extension `KHR_parallel_shader_compile`), les
shaders se compilent en parallèle : la construction du personnage ne fige pas
le défilement, et sa première image s'affiche une fois la compilation finie.
Sinon, la compilation reste synchrone, comme avant.

Si WebGL n'est pas disponible, un message remplace le personnage et les liens
texte restent utilisables.

## Images

Le portfolio n'utilise plus d'image pour l'avatar. Le relief polaire de la
veste est généré dans le navigateur, sans fichier. Le portrait photographique
reste présent ailleurs sur la page, dans l'en-tête.

Les images générées lors des essais, l'illustration détourée et ses sources,
sont conservées hors suivi Git dans `.cache/avatar-sources/`. À sauvegarder
ailleurs avant tout nettoyage, sinon elles seront perdues.
Le script `scripts/build-avatar-image.js` regénère l'illustration détourée, si
elle devait resservir :

```sh
npm install --no-save sharp
node scripts/build-avatar-image.js
```

Le fichier `nizar-avatar-concept.png` contient un damier peint et non une vraie
transparence : il n'est pas exploitable tel quel.

## Icônes des orbites

Les onze logos sont installés dans `assets/img/skills/` au format SVG :
React, Next.js, TypeScript, JavaScript, Node.js, PHP, MongoDB, MySQL, n8n, Git
et Figma.
