# Sécurité, sauvegardes et conformité

État au 27 septembre 2026. Ce document complète `NOTE-PROJET.md` sur les points
qui dépendent d'accès extérieurs au dépôt, ou qui appellent une décision.

---

## 1. Transport et en-têtes

| Point | État |
| ----- | ---- |
| HTTPS | Actif. `http://` renvoie une redirection 301 vers `https://`. Vérifié. |
| HSTS | Déjà envoyé par Netlify sur `netlify.app`, avec `includeSubDomains; preload`. Non redéfini dans le dépôt. |
| Ressources en clair | Aucune. La page ne charge rien depuis un autre domaine. |
| Cookies | Aucun cookie n'est déposé, donc aucun attribut de sécurité à régler. |

Le fichier `_headers` ajoute les en-têtes manquants : politique de sécurité du
contenu, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` et `Cross-Origin-Opener-Policy`.

La politique de sécurité du contenu autorise les styles en ligne, parce que la
page pose des variables CSS directement sur certains éléments. Les scripts, eux,
sont tous dans des fichiers : `script-src` reste donc strict, sans `unsafe-inline`
ni `unsafe-eval`. La politique a été simulée dans un navigateur sur la page
d'accueil, les mentions légales et la page 404 : aucune violation, polices,
styles et rendu 3D compris.

**À vérifier au branchement d'un domaine personnalisé** : la portée de HSTS avec
`includeSubDomains`, qui engage aussi les sous-domaines du domaine concerné.

---

## 2. Clés et secrets

Recherche menée sur tout le dépôt, y compris les fichiers publiés par
l'hébergeur. **Aucune clé privée, aucun jeton et aucun mot de passe n'y figure.**

- Le jeton de l'éditeur local est tiré aléatoirement au démarrage du serveur et
  n'existe qu'en mémoire.
- `.gitignore` couvre déjà les fichiers `.env`.
- Aucun fichier d'environnement n'est suivi par Git.

Restent deux adresses publiques dans le code, qui ne sont pas des secrets mais
des points d'entrée :

- l'adresse du webhook n8n de production, nécessaire au fonctionnement du
  formulaire côté navigateur. Elle ne peut pas être masquée sur un site statique ;
- l'adresse du webhook de test, qui a été **retirée** de la page publiée. En
  local, elle est maintenant déduite de celle de production.

Aucune rotation de secret n'est nécessaire, puisque rien n'a été exposé.

---

## 3. Formulaire de contact et anti-spam

Contrairement à ce qui était supposé, **le site contient bien un formulaire** :
neuf champs, envoyés en arrière-plan vers un workflow n8n.

Protections en place :

- champ piège invisible, ignoré silencieusement s'il est rempli ;
- champs obligatoires et format d'adresse électronique vérifiés avant envoi ;
- longueur du message limitée à deux mille caractères ;
- délai d'expiration de vingt-cinq secondes sur la requête.

Ces protections sont toutes **côté navigateur** : elles écartent les robots
simples, pas un envoi fabriqué à la main vers le webhook.

À prévoir côté n8n, là où le contrôle est réel :

1. **Limitation du débit** par adresse IP et par adresse électronique.
2. **Validation serveur** des champs, indépendamment du navigateur : présence,
   format, longueur maximale, type de demande parmi une liste fermée.
3. **Rejet des origines inattendues**, en vérifiant l'en-tête `Origin`.
4. **Vérification anti-robot** si le volume de spam le justifie, avec un service
   sans cookie. À n'ajouter qu'en cas de besoin réel : cela ajoute une
   dépendance tierce et une mention supplémentaire dans la politique de
   confidentialité.

Ces points n'ont pas pu être mis en place : ils vivent dans le workflow n8n, hors
du dépôt.

---

## 4. Sauvegardes

Git n'est pas une sauvegarde complète du site : il contient le code et les
ressources, pas la configuration de l'hébergement ni les données reçues.

### Ce qui est déjà couvert

| Élément | Couverture |
| ------- | ---------- |
| Code, styles, images, polices, CV | Dépôt Git, distant GitHub. |
| Site tel que publié | Historique de déploiements Netlify, avec retour à une version antérieure en un clic. |

### Ce qui n'est pas couvert

| Élément | Risque | Où agir |
| ------- | ------ | ------- |
| Workflow n8n du formulaire | Perte du traitement des demandes | Exporter le workflow au format JSON et le versionner ou l'archiver hors ligne. |
| Données reçues par le formulaire | Perte de l'historique des contacts | Export périodique depuis l'outil qui les stocke. |
| Configuration Netlify | Reconfiguration manuelle | Noter le domaine, les variables et les réglages de build. |
| Serveur qui héberge n8n | Perte de l'instance | Sauvegarde ou instantané proposé par l'hébergeur du serveur. |

### Procédure de restauration du site

1. Cloner le dépôt depuis GitHub.
2. Reconnecter le dépôt à un site Netlify, dossier publié : la racine.
3. Vérifier que `_headers` et `_redirects` sont bien pris en compte.
4. Recréer le workflow n8n à partir de son export.

**Rien n'a été souscrit ni configuré côté hébergeur.** La mise en place d'une
sauvegarde automatique du workflow et des données demande un accès à n8n et à
l'hébergeur du serveur, et éventuellement une offre payante : à décider.

---

## 5. Mesure d'audience

Aucun outil n'est installé, et aucune donnée de fréquentation n'est collectée.
C'est aussi pour cette raison qu'aucun bandeau de consentement n'est nécessaire.

Si un suivi devient utile, trois directions, par ordre de simplicité :

| Solution | Cookies | Consentement | Coût | Remarque |
| -------- | ------- | ------------ | ---- | -------- |
| Netlify Analytics | Aucun, mesure côté serveur | Non requis | Payant, par site | Rien à ajouter dans la page, aucun script. |
| Service tiers sans cookie | Aucun | Non requis dans la plupart des cas | Payant ou auto-hébergé | Ajoute un script tiers, donc une entrée dans la politique de confidentialité et dans la politique de sécurité du contenu. |
| Outil auto-hébergé | Aucun par défaut | Selon la configuration | Coût d'hébergement | Demande de l'exploitation. |

**Aucun service n'a été activé.** Le choix revient à Nizar, et la politique de
confidentialité devra être complétée en conséquence.

---

## 6. Google Search Console

Déclaration volontairement non effectuée. Étapes prévues :

1. Ouvrir la Search Console et ajouter une propriété de type **préfixe d'URL**,
   avec `https://nizart.netlify.app/`. Si un domaine personnalisé est branché
   plus tard, créer plutôt une propriété de type **domaine**.
2. Valider la propriété. Deux méthodes possibles :
   - déposer le fichier HTML fourni à la racine du dépôt, ce qui fonctionne
     puisque l'hébergeur publie la racine ;
   - ou ajouter la balise `meta` de vérification dans l'en-tête de `home.html`.
3. Soumettre le plan du site : `https://nizart.netlify.app/sitemap.xml`.
4. Demander l'indexation de la page d'accueil.
5. Vérifier au bout de quelques jours la couverture et l'absence d'erreur.

Information à préparer : l'accès au compte Google qui portera la propriété.

---

## 7. Pages légales : ce qui manque

Les deux pages sont rédigées mais **marquées comme brouillons** et exclues de
l'indexation. Informations à fournir avant publication :

1. Statut : particulier éditant à titre non professionnel, ou micro-entrepreneur.
2. Adresse postale et numéro de téléphone, obligatoires pour un éditeur
   professionnel.
3. Numéro SIREN ou SIRET, et numéro de TVA le cas échéant.
4. Hébergeur du serveur n8n : dénomination, adresse et pays.
5. Liste exacte des services traversés par le formulaire, et transferts éventuels
   hors Union européenne.
6. Durées de conservation retenues.

Des conditions générales d'utilisation **ne sont pas obligatoires** ici : le site
ne vend rien, ne crée aucun compte et ne propose aucun service interactif soumis
à des règles particulières. Elles pourront être ajoutées si le site évolue.
