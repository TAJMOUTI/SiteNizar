(function () {
  var projects = {
    webmarket: {
      title: "Webmarket",
      category: "Outils internes",
      summary: "Store applicatif interne Renault centralisant les applications métier.",
      context: "Application interne de type store applicatif déployée dans un environnement industriel Renault.",
      need: "Centraliser les applications métier utilisées par les collaborateurs et simplifier leur accès aux outils du quotidien.",
      role: "Maintenance évolutive, suivi du bon fonctionnement de l’application et amélioration continue des fonctionnalités.",
      impact: "Meilleure accessibilité aux outils internes, gain de temps pour les utilisateurs et fluidification des usages en usine.",
      tags: ["Application interne", "UX métier", "Renault", "Workflow"]
    },
    "messagerie-dect": {
      title: "Messagerie DECT",
      category: "Communication",
      summary: "Solution web permettant d’envoyer des messages vers des téléphones DECT en usine.",
      context: "Solution web de messagerie interne permettant d’envoyer des messages depuis un poste informatique vers des téléphones DECT utilisés en usine Renault.",
      need: "Améliorer la communication opérationnelle et la réactivité des équipes terrain.",
      role: "Participation à la mise en place d’une application ergonomique adaptée à un usage rapide en environnement industriel.",
      impact: "Transmission plus rapide des informations et meilleure coordination entre les équipes.",
      tags: ["Communication", "Industrie", "Web app", "Réactivité"]
    },
    "portail-point-fab": {
      title: "Portail Point Fab",
      category: "Dashboard",
      summary: "Tableau de bord industriel pour suivre les priorités de production.",
      context: "Tableau de bord industriel dédié au suivi quotidien des priorités de production à l’échelle de l’usine, des départements et des ateliers.",
      need: "Centraliser les priorités de production et offrir une meilleure visibilité aux équipes et décideurs.",
      role: "Évolution fonctionnelle, exploitation des données et refonte graphique de plusieurs interfaces durant mon alternance.",
      impact: "Outil utilisé par des interlocuteurs du Comité de Direction de l’usine pour soutenir le pilotage opérationnel et la prise de décision.",
      tags: ["Dashboard", "Data", "Production", "Décision"]
    },
    "andre-bach": {
      title: "L’Histoire d’André Bach",
      category: "Projet web",
      summary: "Site mémoriel permettant de consulter et transmettre un témoignage historique.",
      context: "Projet mémoriel autour du livre L’Histoire d’André Bach, retraçant l’histoire d’un déporté juif durant la Seconde Guerre mondiale.",
      need: "Rendre accessible en ligne un travail de recherche familial et historique.",
      role: "Création d’un site web simple, lisible et durable permettant la consultation du livre.",
      impact: "Préservation et transmission numérique d’un témoignage historique auprès des générations futures.",
      tags: ["Site web", "Mémoire", "Accessibilité", "Transmission"],
      link: "https://andrebachbiographie1888-1945.netlify.app/"
    }
  };

  var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".project-filter"));

  if (!cards.length || !filters.length) {
    return;
  }

  var detail = {
    category: document.getElementById("project-detail-category"),
    title: document.getElementById("project-detail-title"),
    summary: document.getElementById("project-detail-summary"),
    context: document.getElementById("project-detail-context"),
    need: document.getElementById("project-detail-need"),
    role: document.getElementById("project-detail-role"),
    impact: document.getElementById("project-detail-impact"),
    tags: document.getElementById("project-detail-tags"),
    link: document.getElementById("project-detail-link")
  };

  function setSelectedProject(projectId) {
    var project = projects[projectId];

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
    detail.need.textContent = project.need;
    detail.role.textContent = project.role;
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
  }

  function setFilter(filterName) {
    var firstVisibleCard = null;

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
      setSelectedProject(firstVisibleCard.getAttribute("data-project"));
    }
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      setSelectedProject(card.getAttribute("data-project"));
    });
  });

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      setFilter(filter.getAttribute("data-filter"));
    });
  });

  setSelectedProject("webmarket");
})();
