/* Portfolio content preserved from the previous version. */
window.portfolioProjects = {
  webmarket: {
    title: "Webmarket",
    category: "Outils internes",
    summary:
      "Store interne centralisant les applications métier Renault pour simplifier l'accès et analyser leur usage.",
    context:
      "Application interne Renault utilisée comme store d'applications métier accessible sur desktop, tablette et mobile.",
    problem:
      "Les utilisateurs perdaient du temps à retrouver leurs outils et aucune donnée ne permettait d'identifier les applications réellement utilisées.",
    solution:
      "Ajout d'un dashboard administrateur permettant de suivre les clics sur chaque application, filtrer les données par période et exporter les résultats.",
    role: "Développement fullstack en autonomie complète : création d'une page admin, implémentation du tracking des clics, ajout de filtres temporels, export Excel des données et amélioration UX.",
    stack: "HTML / CSS / PHP / MySQL / API REST",
    impact:
      "Meilleure visibilité sur l'usage des applications, aide à la prise de décision pour trier les outils et gain de temps pour les utilisateurs.",
    tags: ["Application interne", "Dashboard admin", "Tracking", "Excel"],
    image: "./assets/img/realisations/cards/webmarket-card.png",
    fullImage: "./assets/img/realisations/full/webmarket-full.png",
  },
  datahouse: {
    title: "DataHouse",
    category: "Outil SaaS",
    summary:
      "Plateforme SaaS de gestion de données métier basée sur des schémas dynamiques, permettant de générer des interfaces, dashboards et documents à partir des données.",
    context:
      "DataHouse est une plateforme SaaS utilisée pour construire des outils métier sur mesure à partir de schémas de données dynamiques, sans repartir de zéro à chaque besoin client.",
    problem:
      "Les équipes métier ont souvent besoin d’outils spécifiques pour gérer des entités complexes, générer des documents, suivre des dossiers ou produire des dashboards, mais le développement d’une application dédiée pour chaque cas est long, coûteux et difficile à maintenir.",
    solution:
      "Mise en place de schémas dynamiques JSON pour modéliser les données métier, générer automatiquement des formulaires, vues, dashboards, relations entre entités et documents PDF à partir des données.",
    role: "Développement fullstack sur la plateforme : implémentation de vues dynamiques, logique d’autosave, gestion des états readonly/anonymisation, personnalisation de composants React, création de pipelines MongoDB et génération de documents.",
    stack:
      "Next.js / React / TypeScript / MongoDB aggregation pipelines / SWR / Valtio / @react-pdf / Infrastructure as Code",
    impact:
      "Accélération du développement d’applications métier, réduction des erreurs humaines, meilleure fiabilité des données et automatisation de processus complexes comme la génération de documents, les calculs métier et les dashboards.",
    tags: ["SaaS", "Fullstack", "MongoDB", "Next.js", "TypeScript", "IaC"],
    image: "./assets/img/realisations/cards/datahouse-card.png",
    fullImage: "./assets/img/realisations/full/datahouse-full.png",
  },
  "assistant-mail-n8n": {
    title: "Assistant Mail n8n",
    category: "Automatisation IA",
    summary:
      "Workflow automatisé pour gérer les emails : lecture, extraction d'informations et actions automatiques.",
    context:
      "Automatisation du traitement des emails entrants pour réduire les tâches manuelles répétitives.",
    problem:
      "Les emails nécessitent des actions manuelles fréquentes (lecture, extraction de données, suppression, récupération d'informations).",
    solution:
      "Création d'un workflow n8n capable de récupérer le dernier email, extraire des informations (code, contenu, données utiles), supprimer ou archiver des emails et automatiser certaines réponses ou traitements.",
    role: "Conception et implémentation complète du workflow n8n, définition de la logique métier, intégration API et automatisation des actions.",
    stack: "n8n / API Email / Webhooks / automatisation",
    impact:
      "Réduction des tâches répétitives, gain de temps et fiabilisation du traitement des emails.",
    tags: ["n8n", "Automatisation IA", "Email", "API"],
    image: "./assets/img/realisations/cards/assistant-email-card.png",
    fullImage: "./assets/img/realisations/full/assistant-email-full.png",
  },
  "crm-portfolio-ia": {
    title: "CRM intelligent du portfolio",
    category: "Automatisation IA",
    summary:
      "Workflow n8n connecté au formulaire du portfolio pour qualifier, centraliser et suivre automatiquement les demandes entrantes.",
    context:
      "Le portfolio ne se limite pas à présenter des projets : il intègre son propre système automatisé de gestion des contacts.",
    problem:
      "Un formulaire classique envoie une demande brute, difficile à qualifier, prioriser et suivre.",
    solution:
      "Mise en place d'un workflow n8n connecté au formulaire du portfolio. Chaque demande est normalisée, validée, qualifiée par IA, enregistrée dans un CRM Google Sheets, envoyée en notification Telegram et confirmée automatiquement par email.",
    role: "Conception du workflow, intégration frontend, structuration CRM, qualification IA, routage, notifications et logique de validation.",
    stack:
      "HTML / CSS / JavaScript vanilla / n8n / Webhook / Google Sheets / Telegram / Gmail / OpenAI",
    impact:
      "Centralisation des demandes, qualification automatique, suivi plus propre des opportunités et démonstration concrète d'automatisation intégrée à un portfolio professionnel.",
    tags: ["n8n", "IA", "CRM", "Google Sheets", "Telegram", "Gmail"],
    action: "smart-contact",
    actionLabel: "Tester le formulaire",
    image: "./assets/img/realisations/cards/crm-portfolio-card.png",
    fullImage: "./assets/img/realisations/full/crm-portfolio-full.png",
  },
  "messagerie-dect": {
    title: "Messagerie DECT",
    category: "Communication",
    summary:
      "Application web remplaçant un outil obsolète pour améliorer la communication terrain en usine.",
    context:
      "Projet initié pour remplacer un système d'envoi de messages DECT non maintenu depuis 2007.",
    problem:
      "Communication interne lente et outil non adapté aux besoins actuels.",
    solution:
      "Création d'une application web permettant d'envoyer des messages depuis un poste informatique vers des téléphones DECT.",
    role: "Responsable complet du projet : mise en place des sprints, structuration du backlog, développement des premières fonctionnalités, coordination avec un autre alternant développeur sur la suite du projet et passage en rôle chef de projet.",
    stack:
      "React / API REST / intégration API interne Renault / génération Excel et PDF",
    impact:
      "Communication plus rapide entre équipes, outil validé en phase de test et potentiel de déploiement sur plusieurs sites Renault.",
    tags: ["Communication", "React", "API interne", "Gestion projet"],
    image: "./assets/img/realisations/cards/messagerie-dect-card.png",
    fullImage: "./assets/img/realisations/full/messagerie-dect-full.png",
  },
  "portail-point-fab": {
    title: "Portail Point Fabrication",
    category: "Dashboard",
    summary:
      "Dashboard industriel utilisé par le comité de direction pour piloter les priorités de production.",
    context:
      "Outil central de pilotage utilisé par toute l'usine, incluant chefs d'atelier et comité de direction.",
    problem:
      "Manque de visibilité claire sur les priorités et décisions opérationnelles.",
    solution:
      "Amélioration du dashboard avec nouvelles fonctionnalités UX, gestion des données et meilleure lisibilité des informations.",
    role: "Développement fullstack en autonomie : conception UX sur Figma, développement front et back, ajout de fonctionnalités comme l'autocomplétion, le suivi et la gestion des mails, interaction directe avec les clients métier et optimisation performance.",
    stack: "HTML / CSS / PHP / MySQL / API REST",
    impact:
      "Outil utilisé par le comité de direction, meilleure visibilité décisionnelle et amélioration du pilotage opérationnel.",
    tags: ["Dashboard", "Production", "Figma", "Pilotage"],
    image: "./assets/img/realisations/cards/portail-point-fab-card.png",
    fullImage: "./assets/img/realisations/full/portail-point-fab-full.png",
  },
  "andre-bach": {
    title: "L'Histoire d'André Bach",
    category: "Projet web",
    summary:
      "Site web public permettant de transmettre un témoignage historique de manière durable.",
    context:
      "Projet personnel visant à rendre accessible un livre historique familial.",
    problem: "Contenu non accessible facilement et non diffusé en ligne.",
    solution:
      "Création d'un site web simple, lisible et accessible publiquement.",
    role: "Développement complet du projet en autonomie : conception, développement et mise en ligne.",
    stack: "HTML / CSS / JavaScript / Netlify",
    impact:
      "Transmission numérique d'un témoignage historique et accessibilité publique du contenu.",
    tags: ["Site public", "Statique", "Netlify", "Transmission"],
    link: "https://andrebachbiographie1888-1945.netlify.app/",
    image: "./assets/img/realisations/cards/andre-bach-card.png",
    fullImage: "./assets/img/realisations/full/andre-bach-full.png",
  },
};
