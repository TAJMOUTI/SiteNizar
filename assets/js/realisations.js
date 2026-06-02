(function () {
  var projects = {
    webmarket: {
      title: "Webmarket",
      category: "Outils internes",
      summary: "Store interne centralisant les applications métier Renault pour simplifier l'accès et analyser leur usage.",
      context: "Application interne Renault utilisée comme store d'applications métier accessible sur desktop, tablette et mobile.",
      problem: "Les utilisateurs perdaient du temps à retrouver leurs outils et aucune donnée ne permettait d'identifier les applications réellement utilisées.",
      solution: "Ajout d'un dashboard administrateur permettant de suivre les clics sur chaque application, filtrer les données par période et exporter les résultats.",
      role: "Développement fullstack en autonomie complète : création d'une page admin, implémentation du tracking des clics, ajout de filtres temporels, export Excel des données et amélioration UX.",
      stack: "HTML / CSS / PHP / MySQL / API REST",
      impact: "Meilleure visibilité sur l'usage des applications, aide à la prise de décision pour trier les outils et gain de temps pour les utilisateurs.",
      tags: ["Application interne", "Dashboard admin", "Tracking", "Excel"]
    },
    "datahouse": {
      title: "DataHouse",
      category: "Outil SaaS",
      summary: "Plateforme SaaS de gestion de données métier basée sur des schémas dynamiques, permettant de générer des interfaces, dashboards et documents à partir des données.",
      context: "DataHouse est une plateforme SaaS utilisée pour construire des outils métier sur mesure à partir de schémas de données dynamiques, sans repartir de zéro à chaque besoin client.",
      problem: "Les équipes métier ont souvent besoin d’outils spécifiques pour gérer des entités complexes, générer des documents, suivre des dossiers ou produire des dashboards, mais le développement d’une application dédiée pour chaque cas est long, coûteux et difficile à maintenir.",
      solution: "Mise en place de schémas dynamiques JSON pour modéliser les données métier, générer automatiquement des formulaires, vues, dashboards, relations entre entités et documents PDF à partir des données.",
      role: "Développement fullstack sur la plateforme : implémentation de vues dynamiques, logique d’autosave, gestion des états readonly/anonymisation, personnalisation de composants React, création de pipelines MongoDB et génération de documents.",
      stack: "Next.js / React / TypeScript / MongoDB aggregation pipelines / SWR / Valtio / @react-pdf / Infrastructure as Code",
      impact: "Accélération du développement d’applications métier, réduction des erreurs humaines, meilleure fiabilité des données et automatisation de processus complexes comme la génération de documents, les calculs métier et les dashboards.",
      tags: ["SaaS", "Fullstack", "MongoDB", "Next.js", "TypeScript", "IaC"]
    },
    "assistant-mail-n8n": {
      title: "Assistant Mail n8n",
      category: "Automatisation IA",
      summary: "Workflow automatisé pour gérer les emails : lecture, extraction d'informations et actions automatiques.",
      context: "Automatisation du traitement des emails entrants pour réduire les tâches manuelles répétitives.",
      problem: "Les emails nécessitent des actions manuelles fréquentes (lecture, extraction de données, suppression, récupération d'informations).",
      solution: "Création d'un workflow n8n capable de récupérer le dernier email, extraire des informations (code, contenu, données utiles), supprimer ou archiver des emails et automatiser certaines réponses ou traitements.",
      role: "Conception et implémentation complète du workflow n8n, définition de la logique métier, intégration API et automatisation des actions.",
      stack: "n8n / API Email / Webhooks / automatisation",
      impact: "Réduction des tâches répétitives, gain de temps et fiabilisation du traitement des emails.",
      tags: ["n8n", "Automatisation IA", "Email", "API"]
    },
    "crm-portfolio-ia": {
      title: "CRM intelligent du portfolio",
      category: "Automatisation IA",
      summary: "Workflow n8n connecté au formulaire du portfolio pour qualifier, centraliser et suivre automatiquement les demandes entrantes.",
      context: "Le portfolio ne se limite pas à présenter des projets : il intègre son propre système automatisé de gestion des contacts.",
      problem: "Un formulaire classique envoie une demande brute, difficile à qualifier, prioriser et suivre.",
      solution: "Mise en place d'un workflow n8n connecté au formulaire du portfolio. Chaque demande est normalisée, validée, qualifiée par IA, enregistrée dans un CRM Google Sheets, envoyée en notification Telegram et confirmée automatiquement par email.",
      role: "Conception du workflow, intégration frontend, structuration CRM, qualification IA, routage, notifications et logique de validation.",
      stack: "HTML / CSS / JavaScript vanilla / n8n / Webhook / Google Sheets / Telegram / Gmail / OpenAI",
      impact: "Centralisation des demandes, qualification automatique, suivi plus propre des opportunités et démonstration concrète d'automatisation intégrée à un portfolio professionnel.",
      tags: ["n8n", "IA", "CRM", "Google Sheets", "Telegram", "Gmail"],
      action: "smart-contact",
      actionLabel: "Tester le formulaire"
    },
    "messagerie-dect": {
      title: "Messagerie DECT",
      category: "Communication",
      summary: "Application web remplaçant un outil obsolète pour améliorer la communication terrain en usine.",
      context: "Projet initié pour remplacer un système d'envoi de messages DECT non maintenu depuis 2007.",
      problem: "Communication interne lente et outil non adapté aux besoins actuels.",
      solution: "Création d'une application web permettant d'envoyer des messages depuis un poste informatique vers des téléphones DECT.",
      role: "Responsable complet du projet : mise en place des sprints, structuration du backlog, développement des premières fonctionnalités, coordination avec un autre alternant développeur sur la suite du projet et passage en rôle chef de projet.",
      stack: "React / API REST / intégration API interne Renault / génération Excel et PDF",
      impact: "Communication plus rapide entre équipes, outil validé en phase de test et potentiel de déploiement sur plusieurs sites Renault.",
      tags: ["Communication", "React", "API interne", "Gestion projet"]
    },
    "portail-point-fab": {
      title: "Portail Point Fabrication",
      category: "Dashboard",
      summary: "Dashboard industriel utilisé par le comité de direction pour piloter les priorités de production.",
      context: "Outil central de pilotage utilisé par toute l'usine, incluant chefs d'atelier et comité de direction.",
      problem: "Manque de visibilité claire sur les priorités et décisions opérationnelles.",
      solution: "Amélioration du dashboard avec nouvelles fonctionnalités UX, gestion des données et meilleure lisibilité des informations.",
      role: "Développement fullstack en autonomie : conception UX sur Figma, développement front et back, ajout de fonctionnalités comme l'autocomplétion, le suivi et la gestion des mails, interaction directe avec les clients métier et optimisation performance.",
      stack: "HTML / CSS / PHP / MySQL / API REST",
      impact: "Outil utilisé par le comité de direction, meilleure visibilité décisionnelle et amélioration du pilotage opérationnel.",
      tags: ["Dashboard", "Production", "Figma", "Pilotage"]
    },
    "andre-bach": {
      title: "L'Histoire d'André Bach",
      category: "Projet web",
      summary: "Site web public permettant de transmettre un témoignage historique de manière durable.",
      context: "Projet personnel visant à rendre accessible un livre historique familial.",
      problem: "Contenu non accessible facilement et non diffusé en ligne.",
      solution: "Création d'un site web simple, lisible et accessible publiquement.",
      role: "Développement complet du projet en autonomie : conception, développement et mise en ligne.",
      stack: "HTML / CSS / JavaScript / Netlify",
      impact: "Transmission numérique d'un témoignage historique et accessibilité publique du contenu.",
      tags: ["Site public", "Statique", "Netlify", "Transmission"],
      link: "https://andrebachbiographie1888-1945.netlify.app/"
    }
  };

  var PROJECTS_PER_PAGE = 4;
  var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".project-filter"));
  var projectsGrid = document.querySelector(".projects-grid");
  var paginationElement = document.querySelector(".project-pagination");
  var carouselPrevious = document.querySelector(".project-carousel-prev");
  var carouselNext = document.querySelector(".project-carousel-next");
  var detailElement = document.querySelector(".project-detail");
  var detailGrid = document.querySelector(".project-detail-grid");
  var detailToggle = document.getElementById("project-detail-toggle");
  var realisationsSection = document.getElementById("realisations");
  var lightbox = null;
  var lightboxImage = null;
  var lightboxClose = null;
  var lastLightboxTrigger = null;
  var detailAnimationTimeout = null;
  var activeFilter = "Tous";
  var currentPage = 1;

  if (!cards.length || !filters.length || !detailElement) {
    return;
  }

  var detail = {
    category: document.getElementById("project-detail-category"),
    title: document.getElementById("project-detail-title"),
    summary: document.getElementById("project-detail-summary"),
    context: document.getElementById("project-detail-context"),
    problem: document.getElementById("project-detail-problem"),
    solution: document.getElementById("project-detail-solution"),
    role: document.getElementById("project-detail-role"),
    stack: document.getElementById("project-detail-stack"),
    impact: document.getElementById("project-detail-impact"),
    tags: document.getElementById("project-detail-tags"),
    link: document.getElementById("project-detail-link")
  };

  function animateDetail() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      detailElement.classList.remove("is-animating");
      return;
    }

    if (detailAnimationTimeout) {
      window.clearTimeout(detailAnimationTimeout);
    }

    detailElement.classList.remove("is-animating");
    void detailElement.offsetWidth;
    detailElement.classList.add("is-animating");

    detailAnimationTimeout = window.setTimeout(function () {
      detailElement.classList.remove("is-animating");
      detailAnimationTimeout = null;
    }, 420);
  }

  detailElement.addEventListener("animationend", function (event) {
    if (event.animationName !== "projectDetailEnter") {
      return;
    }

    if (detailAnimationTimeout) {
      window.clearTimeout(detailAnimationTimeout);
      detailAnimationTimeout = null;
    }

    detailElement.classList.remove("is-animating");
  });

  function scrollToDetailOnMobile() {
    if (window.innerWidth > 991) {
      return;
    }

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    detailElement.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }

  function isDesktopProjectsLayout() {
    return window.innerWidth > 991;
  }

  function syncProjectDetailHeight() {
    if (!projectsGrid || !detailElement) {
      return;
    }

    if (!isDesktopProjectsLayout()) {
      detailElement.style.height = "";
      return;
    }

    var visibleGridHeight = getVisibleGridCardsHeight();
    detailElement.style.height = visibleGridHeight ? visibleGridHeight + "px" : "";
  }

  function getVisibleGridCardsHeight() {
    var visibleCards = cards.filter(function (card) {
      return !card.hidden;
    });

    if (!visibleCards.length) {
      return 0;
    }

    var gridStyles = window.getComputedStyle(projectsGrid);
    var rowGap = parseFloat(gridStyles.rowGap || gridStyles.gap || "0") || 0;
    var firstCardHeight = visibleCards[0].getBoundingClientRect().height;

    return firstCardHeight * 2 + rowGap;
  }

  function refreshProjectDetailOverflow() {
    if (!detailElement || !detailGrid || !detailToggle) {
      return;
    }

    if (!isDesktopProjectsLayout()) {
      detailElement.classList.remove("has-overflow");
      detailElement.classList.remove("is-expanded");
      detailGrid.scrollTop = 0;
      detailToggle.hidden = true;
      detailToggle.textContent = "Voir plus";
      detailToggle.setAttribute("aria-expanded", "false");
      return;
    }

    detailElement.classList.remove("has-overflow");
    detailElement.classList.remove("is-expanded");
    detailGrid.scrollTop = 0;
    detailToggle.hidden = true;
    detailToggle.textContent = "Voir plus";
    detailToggle.setAttribute("aria-expanded", "false");

    window.requestAnimationFrame(function () {
      var hasOverflow = detailGrid.scrollHeight > detailGrid.clientHeight + 1;
      detailElement.classList.toggle("has-overflow", hasOverflow);
      detailToggle.hidden = !hasOverflow;
    });
  }

  function refreshProjectDetailLayout() {
    syncProjectDetailHeight();
    refreshProjectDetailOverflow();
  }

  function getFilteredCards() {
    return cards.filter(function (card) {
      return activeFilter === "Tous" || card.getAttribute("data-category") === activeFilter;
    });
  }

  function getTotalPages(filteredCards) {
    return Math.max(1, Math.ceil(filteredCards.length / PROJECTS_PER_PAGE));
  }

  function getPageCards(filteredCards) {
    var startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredCards.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }

  function updateCarouselControls(totalPages) {
    if (carouselPrevious) {
      carouselPrevious.disabled = currentPage <= 1;
      carouselPrevious.hidden = totalPages <= 1;
    }

    if (carouselNext) {
      carouselNext.disabled = currentPage >= totalPages;
      carouselNext.hidden = totalPages <= 1;
    }
  }

  function renderPagination(totalPages) {
    if (!paginationElement) {
      updateCarouselControls(totalPages);
      return;
    }

    paginationElement.innerHTML = "";
    updateCarouselControls(totalPages);

    if (totalPages <= 1) {
      paginationElement.hidden = true;
      return;
    }

    paginationElement.hidden = false;

    var pageStatus = document.createElement("span");
    pageStatus.className = "project-page-status";
    pageStatus.textContent = currentPage + " / " + totalPages;
    paginationElement.appendChild(pageStatus);
  }

  function goToProjectPage(direction) {
    var totalPages = getTotalPages(getFilteredCards());
    var nextPage = currentPage + direction;

    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    currentPage = nextPage;
    updateProjectPage({ scrollOnMobile: true });
  }

  function updateProjectPage(options) {
    var settings = options || {};
    var filteredCards = getFilteredCards();
    var totalPages = getTotalPages(filteredCards);
    var pageCards = null;
    var firstPageCard = null;

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    pageCards = getPageCards(filteredCards);

    cards.forEach(function (card) {
      card.hidden = pageCards.indexOf(card) === -1;
    });

    renderPagination(totalPages);

    if (pageCards.length) {
      firstPageCard = pageCards[0];
      setSelectedProject(firstPageCard.getAttribute("data-project"), {
        animate: settings.animate,
        scrollOnMobile: settings.scrollOnMobile === true
      });
    }

    window.requestAnimationFrame(function () {
      refreshProjectDetailLayout();
    });
  }

  function createLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "project-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Capture du projet en grand");
    lightbox.hidden = true;

    var panel = document.createElement("div");
    panel.className = "project-lightbox-panel";

    lightboxClose = document.createElement("button");
    lightboxClose.className = "project-lightbox-close";
    lightboxClose.type = "button";
    lightboxClose.setAttribute("aria-label", "Fermer la capture");
    lightboxClose.textContent = "x";

    lightboxImage = document.createElement("img");
    lightboxImage.className = "project-lightbox-image";
    lightboxImage.alt = "";

    panel.appendChild(lightboxClose);
    panel.appendChild(lightboxImage);
    lightbox.appendChild(panel);
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightboxClose.addEventListener("click", closeLightbox);
  }

  function openLightbox(card, trigger) {
    var fullImage = card.getAttribute("data-full-image");

    if (!fullImage) {
      return;
    }

    if (!lightbox) {
      createLightbox();
    }

    lastLightboxTrigger = trigger;
    lightboxImage.src = fullImage;
    lightboxImage.alt = card.getAttribute("data-image-alt") || "Capture du projet";
    lightbox.hidden = false;
    document.body.classList.add("project-lightbox-open");
    window.requestAnimationFrame(function () {
      lightbox.classList.add("is-visible");
      lightboxClose.focus();
    });
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) {
      return;
    }

    lightbox.classList.remove("is-visible");
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("project-lightbox-open");

    if (lastLightboxTrigger) {
      lastLightboxTrigger.focus();
      lastLightboxTrigger = null;
    }
  }

  function setupCardZooms() {
    cards.forEach(function (card) {
      var fullImage = card.getAttribute("data-full-image");
      var image = card.querySelector(".project-card-image");

      if (!fullImage || !image || card.querySelector(".project-card-zoom")) {
        return;
      }

      var zoom = document.createElement("span");

      zoom.className = "project-card-zoom";
      zoom.setAttribute("role", "button");
      zoom.setAttribute("tabindex", "0");
      zoom.setAttribute("aria-label", "Voir la capture du projet en grand");
      zoom.textContent = "\u2315";
      image.insertAdjacentElement("afterend", zoom);

      function zoomProject(event) {
        event.preventDefault();
        event.stopPropagation();
        openLightbox(card, zoom);
      }

      zoom.addEventListener("click", zoomProject);
      zoom.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        zoomProject(event);
      });
    });
  }

  function setSelectedProject(projectId, options) {
    var project = projects[projectId];
    var settings = options || {};

    if (!project) {
      return;
    }

    cards.forEach(function (card) {
      var isSelected = card.getAttribute("data-project") === projectId;
      card.classList.toggle("is-active", isSelected);
      card.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    detail.category.textContent = project.category;
    detail.title.textContent = project.title;
    detail.summary.textContent = project.summary;
    detail.context.textContent = project.context;
    detail.problem.textContent = project.problem;
    detail.solution.textContent = project.solution;
    detail.role.textContent = project.role;
    detail.stack.textContent = project.stack;
    detail.impact.textContent = project.impact;

    detail.tags.innerHTML = "";
    project.tags.forEach(function (tag) {
      var tagElement = document.createElement("span");
      tagElement.textContent = tag;
      detail.tags.appendChild(tagElement);
    });

    detail.link.removeAttribute("data-project-smart-contact-open");
    detail.link.removeAttribute("role");
    detail.link.removeAttribute("tabindex");

    if (project.link) {
      detail.link.href = project.link;
      detail.link.textContent = "Voir le projet";
      detail.link.hidden = false;
      detail.link.classList.add("is-visible");
    } else if (project.action === "smart-contact") {
      detail.link.removeAttribute("href");
      detail.link.textContent = project.actionLabel || "Tester le formulaire";
      detail.link.setAttribute("data-project-smart-contact-open", "true");
      detail.link.setAttribute("role", "button");
      detail.link.setAttribute("tabindex", "0");
      detail.link.hidden = false;
      detail.link.classList.add("is-visible");
    } else {
      detail.link.removeAttribute("href");
      detail.link.textContent = "Voir le projet";
      detail.link.hidden = true;
      detail.link.classList.remove("is-visible");
    }

    if (settings.animate !== false) {
      animateDetail();
    }

    refreshProjectDetailLayout();

    if (settings.scrollOnMobile === true) {
      scrollToDetailOnMobile();
    }
  }

  function setFilter(filterName, options) {
    var settings = options || {};
    activeFilter = filterName;
    currentPage = 1;

    filters.forEach(function (filter) {
      var isSelected = filter.getAttribute("data-filter") === filterName;
      filter.classList.toggle("is-active", isSelected);
      filter.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    updateProjectPage({
      scrollOnMobile: settings.scrollOnMobile === true
    });
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      setSelectedProject(card.getAttribute("data-project"), {
        scrollOnMobile: true
      });
    });
  });

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      setFilter(filter.getAttribute("data-filter"), {
        scrollOnMobile: true
      });
    });
  });

  if (detail.link) {
    detail.link.addEventListener("click", function (event) {
      var smartContactButton = null;

      if (detail.link.getAttribute("data-project-smart-contact-open") !== "true") {
        return;
      }

      event.preventDefault();
      smartContactButton = document.querySelector("[data-smart-contact-open]");

      if (smartContactButton) {
        smartContactButton.click();
      }
    });
  }

  if (detailToggle) {
    detailToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      var isExpanded = detailElement.classList.toggle("is-expanded");
      detailToggle.textContent = isExpanded ? "Réduire" : "Voir plus";
      detailToggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      detailGrid.scrollTop = 0;
    });
  }

  if (carouselPrevious) {
    carouselPrevious.addEventListener("click", function () {
      goToProjectPage(-1);
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener("click", function () {
      goToProjectPage(1);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  setupCardZooms();
  window.addEventListener("resize", function () {
    refreshProjectDetailLayout();
  });

  if (realisationsSection && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        animateDetail();
        observer.unobserve(realisationsSection);
      });
    }, {
      threshold: 0.35
    });

    sectionObserver.observe(realisationsSection);
  }

  updateProjectPage({
    animate: false,
    scrollOnMobile: false
  });
})();
