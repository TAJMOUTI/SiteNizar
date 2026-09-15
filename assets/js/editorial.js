/* Editorial portfolio: progressive enhancement, no runtime dependencies. */
(function () {
  "use strict";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var motionToggle = document.querySelector(".motion-toggle");
  var paused = reducedMotion.matches;
  function updateMotion() {
    document.documentElement.classList.toggle("motion-paused", paused);
    motionToggle.setAttribute("aria-pressed", String(paused));
    motionToggle.textContent = paused
      ? "Reprendre les animations"
      : "Mettre les animations en pause";
  }
  motionToggle.addEventListener("click", function () {
    paused = !paused;
    updateMotion();
  });
  reducedMotion.addEventListener("change", function (event) {
    paused = event.matches;
    updateMotion();
  });
  updateMotion();
  document.querySelector("[data-year]").textContent = new Date().getFullYear();

  var navigation = document.getElementById("navigation");
  var menu = document.querySelector(".menu-toggle");
  function closeMenu() {
    navigation.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
  }
  menu.addEventListener("click", function () {
    var isOpen = navigation.classList.toggle("is-open");
    menu.setAttribute("aria-expanded", String(isOpen));
  });
  navigation.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".site-header")) closeMenu();
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    document.querySelectorAll(".reveal").forEach(function (element) {
      revealObserver.observe(element);
    });
    document.documentElement.classList.add("js-motion");
    var progressLinks = Array.from(
      document.querySelectorAll(".section-progress a"),
    );
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            progressLinks.forEach(function (link) {
              if (link.hash === "#" + entry.target.id)
                link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          }
        });
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );
    document.querySelectorAll("main > section[id]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var tools = document.querySelectorAll("[data-tool]");
  tools.forEach(function (tool) {
    tool.setAttribute("aria-pressed", "false");
    tool.addEventListener("click", function () {
      tools.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === tool));
      });
      document.getElementById("tool-name").textContent = tool.dataset.tool;
      document.getElementById("tool-description").textContent =
        tool.dataset.description;
    });
  });

  // Render a low-resolution text interpretation of our own project screenshots.
  // Work is deferred until each card approaches the viewport, and done only once.
  function renderAscii(image) {
    if (window.matchMedia("(hover: none)").matches || reducedMotion.matches)
      return;
    var visual = image.parentElement;
    var canvas = visual.querySelector("canvas");
    try {
      var sample = document.createElement("canvas");
      var columns = 110;
      var rows = 46;
      sample.width = columns;
      sample.height = rows;
      var context = sample.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0, columns, rows);
      var pixels = context.getImageData(0, 0, columns, rows).data;
      canvas.width = 880;
      canvas.height = 550;
      var output = canvas.getContext("2d");
      output.fillStyle = "#101210";
      output.fillRect(0, 0, canvas.width, canvas.height);
      output.font = '10px "Courier New", monospace';
      output.textBaseline = "top";
      var symbols = " .,:;i+tfL#MW@";
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
          var index = (y * columns + x) * 4;
          var light =
            (pixels[index] * 0.299 +
              pixels[index + 1] * 0.587 +
              pixels[index + 2] * 0.114) /
            255;
          output.fillStyle = "rgba(238,233,221," + (0.2 + light * 0.8) + ")";
          output.fillText(
            symbols[
              Math.min(symbols.length - 1, Math.floor(light * symbols.length))
            ],
            x * 8,
            y * 12,
          );
        }
      }
      visual.classList.add("has-ascii");
    } catch (_) {
      /* A normal, fully usable image remains if canvas is unavailable. */
    }
  }
  var imageObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              var image = entry.target;
              if (image.complete && image.naturalWidth) renderAscii(image);
              else
                image.addEventListener(
                  "load",
                  function () {
                    renderAscii(image);
                  },
                  { once: true },
                );
              imageObserver.unobserve(image);
            });
          },
          { rootMargin: "250px" },
        )
      : null;
  document.querySelectorAll(".work-visual > img").forEach(function (image) {
    if (imageObserver) imageObserver.observe(image);
  });
  document.querySelectorAll(".work-open").forEach(function (button) {
    button.addEventListener("pointermove", function (event) {
      if (paused || reducedMotion.matches) return;
      var visual = button.querySelector(".work-visual");
      var bounds = visual.getBoundingClientRect();
      visual.style.setProperty(
        "--pointer-x",
        ((event.clientX - bounds.left) / bounds.width) * 100 + "%",
      );
      visual.style.setProperty(
        "--pointer-y",
        ((event.clientY - bounds.top) / bounds.height) * 100 + "%",
      );
    });
  });

  var dialog = document.querySelector(".project-dialog");
  var lastProjectTrigger;
  var projectIds = Array.from(
    document.querySelectorAll(".work-open[data-project]"),
    function (button) {
      return button.dataset.project;
    },
  );
  var currentProjectIndex = -1;
  var contactButton = document.querySelector("[data-smart-contact-open]");
  function openProject(id, trigger) {
    var project = window.portfolioProjects[id];
    if (!project) return;
    if (trigger) lastProjectTrigger = trigger;
    currentProjectIndex = projectIds.indexOf(id);
    document.getElementById("case-position").textContent =
      currentProjectIndex + 1 + " / " + projectIds.length;
    document.getElementById("case-previous").disabled =
      currentProjectIndex <= 0;
    document.getElementById("case-next").disabled =
      currentProjectIndex >= projectIds.length - 1;
    document.getElementById("case-title").textContent = project.title;
    document.getElementById("case-category").textContent = project.category;
    document.getElementById("case-summary").textContent = project.summary;
    var image = document.getElementById("case-image");
    image.src = project.fullImage;
    image.alt = "Capture du projet " + project.title;
    document.getElementById("case-image-link").href = project.fullImage;
    var sections = document.getElementById("case-sections");
    sections.replaceChildren();
    [
      ["context", "Le contexte"],
      ["problem", "Le besoin"],
      ["solution", "La solution"],
      ["role", "Mon rôle"],
      ["stack", "Les technologies"],
      ["impact", "Le résultat"],
    ].forEach(function (field) {
      if (!project[field[0]]) return;
      var section = document.createElement("section");
      var title = document.createElement("h3");
      var text = document.createElement("p");
      title.textContent = field[1];
      text.textContent = project[field[0]];
      section.append(title, text);
      sections.append(section);
    });
    var link = document.getElementById("case-link");
    link.hidden = !project.link;
    if (project.link) link.href = project.link;
    else link.removeAttribute("href");
    document.getElementById("case-contact").hidden =
      project.action !== "smart-contact";
    var wasOpen = dialog.open;
    if (!wasOpen) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("project-is-open");
    if (!wasOpen)
      dialog.querySelector(".case-close").focus({ preventScroll: true });
  }
  function navigateProject(offset) {
    var next = currentProjectIndex + offset;
    if (next < 0 || next >= projectIds.length) return;
    openProject(projectIds[next]);
    var currentButton = document.getElementById(
      offset > 0 ? "case-next" : "case-previous",
    );
    if (currentButton.disabled)
      document
        .getElementById(offset > 0 ? "case-previous" : "case-next")
        .focus({ preventScroll: true });
  }
  document
    .getElementById("case-previous")
    .addEventListener("click", function () {
      navigateProject(-1);
    });
  document.getElementById("case-next").addEventListener("click", function () {
    navigateProject(1);
  });
  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      navigateProject(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  document.querySelectorAll("[data-project]").forEach(function (button) {
    button.addEventListener("click", function () {
      openProject(button.dataset.project, button);
    });
  });
  dialog.querySelector(".case-close").addEventListener("click", function () {
    dialog.close();
  });
  dialog.addEventListener("click", function (event) {
    var rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  var launchContact = false;
  dialog.addEventListener("close", function () {
    document.body.classList.remove("project-is-open");
    if (launchContact) {
      launchContact = false;
      contactButton.click();
    } else if (lastProjectTrigger)
      lastProjectTrigger.focus({ preventScroll: true });
  });
  document
    .getElementById("case-contact")
    .addEventListener("click", function () {
      launchContact = true;
      dialog.close();
    });
})();
