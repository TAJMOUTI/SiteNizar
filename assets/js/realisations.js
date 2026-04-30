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

  var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".project-filter"));
  var detailElement = document.querySelector(".project-detail");
  var realisationsSection = document.getElementById("realisations");
  var detailAnimationTimeout = null;

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

    if (project.link) {
      detail.link.href = project.link;
      detail.link.classList.add("is-visible");
    } else {
      detail.link.removeAttribute("href");
      detail.link.classList.remove("is-visible");
    }

    if (settings.animate !== false) {
      animateDetail();
    }

    if (settings.scrollOnMobile === true) {
      scrollToDetailOnMobile();
    }
  }

  function setFilter(filterName, options) {
    var firstVisibleCard = null;
    var settings = options || {};

    filters.forEach(function (filter) {
      var isSelected = filter.getAttribute("data-filter") === filterName;
      filter.classList.toggle("is-active", isSelected);
      filter.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    cards.forEach(function (card) {
      var matchesFilter = filterName === "Tous" || card.getAttribute("data-category") === filterName;
      card.hidden = !matchesFilter;

      if (matchesFilter && !firstVisibleCard) {
        firstVisibleCard = card;
      }
    });

    if (firstVisibleCard) {
      setSelectedProject(firstVisibleCard.getAttribute("data-project"), {
        scrollOnMobile: settings.scrollOnMobile === true
      });
    }
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

  setSelectedProject("webmarket", {
    animate: false,
    scrollOnMobile: false
  });
})();
