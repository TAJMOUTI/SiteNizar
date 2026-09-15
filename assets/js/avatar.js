/* Optional avatar: a single 3D view, loaded on approach and never blocking. */
(function () {
  "use strict";
  const card = document.querySelector("[data-avatar]");
  if (!card) return;
  const stage = card.querySelector(".avatar-stage");
  const status = card.querySelector(".avatar-status");
  const controls = card.querySelector(".avatar-controls");
  const renderLabel = card.querySelector(".avatar-render-label");
  const fallback = card.querySelector(".avatar-fallback");
  const spin = card.querySelector("[data-avatar-spin]");
  let viewer = null;
  let loading = null;

  function syncSpin(active) {
    spin.setAttribute("aria-pressed", String(active));
    spin.textContent = active ? "Arrêter" : "Rotation auto";
  }

  function load() {
    if (loading) return loading;
    status.textContent = "Préparation de l’avatar 3D…";
    loading = import("./avatar-model.js")
      .then((module) => {
        viewer = module.createAvatar(stage, status);
        syncSpin(viewer.spinning());
        return viewer;
      })
      .catch(() => {
        // The links under the card reach the same sections without WebGL.
        loading = null;
        fallback.hidden = false;
        controls.hidden = true;
        renderLabel.hidden = true;
        status.textContent = "Le rendu 3D est indisponible sur cet appareil.";
      });
    return loading;
  }

  card.querySelectorAll("[data-avatar-turn]").forEach((button) =>
    button.addEventListener("click", () => {
      if (viewer) viewer.turn(Number(button.dataset.avatarTurn));
    }),
  );
  card.querySelector("[data-avatar-reset]").addEventListener("click", () => {
    if (viewer) viewer.reset();
  });
  spin.addEventListener("click", () => {
    if (viewer) syncSpin(viewer.toggleSpin());
  });

  // Three.js is only fetched once the card comes near the viewport, so it never
  // delays the rest of the page.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "350px" },
    );
    observer.observe(card);
  } else {
    load();
  }
})();
