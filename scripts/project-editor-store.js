// Local authoring only. The public portfolio never executes this module.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
function createStore(root) {
  const dataPath = path.join(root, "assets/js/projects-data.js");
  const htmlPath = path.join(root, "home.html");
  function read() {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(dataPath, "utf8"), sandbox, {
      timeout: 1000,
    });
    return JSON.parse(JSON.stringify(sandbox.window.portfolioProjects));
  }
  function escape(value) {
    return String(value || "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function card(id, p, index) {
    return (
      '<article class="work-card reveal"><button class="work-open" type="button" data-project="' +
      escape(id) +
      '" aria-haspopup="dialog" aria-label="Découvrir ' +
      escape(p.title) +
      '"><span class="work-visual"><img src="' +
      escape(p.image) +
      '" alt="Aperçu de ' +
      escape(p.title) +
      '" width="1200" height="750" loading="lazy" decoding="async"><canvas class="ascii-preview" aria-hidden="true"></canvas><span class="work-view" aria-hidden="true">EXPLORER ↗</span></span><span class="work-meta"><span>' +
      String(index + 1).padStart(2, "0") +
      " / " +
      escape(p.category) +
      '</span><span>ÉTUDE DE CAS ↗</span></span><span class="work-title">' +
      escape(p.title) +
      '</span><span class="work-stack">' +
      escape(p.tags.slice(0, 4).join(" · ")) +
      "</span></button></article>"
    );
  }
  function text(input, name, limit, required = false) {
    if (typeof input[name] !== "string") {
      if (required) throw Error("Champ requis : " + name);
      return "";
    }
    const value = input[name].trim();
    if ((required && !value) || value.length > limit)
      throw Error("Champ invalide ou trop long : " + name);
    return value;
  }
  function decodeImage(value, required) {
    if (!value && !required) return null;
    if (typeof value !== "string") throw Error("Une image est nécessaire.");
    const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(
      value,
    );
    if (!match) throw Error("Image attendue : PNG, JPEG ou WebP.");
    const bytes = Buffer.from(match[2], "base64");
    if (!bytes.length || bytes.length > 5 * 1024 * 1024)
      throw Error("Chaque image doit peser moins de 5 Mo.");
    const type = match[1];
    const valid =
      type === "png"
        ? bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : type === "jpeg"
          ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          : bytes.subarray(0, 4).toString() === "RIFF" &&
            bytes.subarray(8, 12).toString() === "WEBP";
    if (!valid)
      throw Error("Le contenu du fichier ne correspond pas au format annoncé.");
    return { bytes, ext: type === "jpeg" ? "jpg" : type };
  }
  function add(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw Error("Formulaire invalide.");
    const project = {};
    for (const key of [
      "title",
      "category",
      "summary",
      "context",
      "problem",
      "solution",
      "role",
      "stack",
      "impact",
    ])
      project[key] = text(
        input,
        key,
        ["title", "category"].includes(key) ? 150 : 4000,
        ["title", "category", "summary"].includes(key),
      );
    project.tags = text(input, "tags", 500)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12);
    const link = text(input, "link", 1000);
    if (link) {
      let url;
      try {
        url = new URL(link);
      } catch {
        throw Error("Le lien doit être une URL HTTPS complète.");
      }
      if (url.protocol !== "https:" || url.username || url.password)
        throw Error("Le lien doit être une URL HTTPS sans identifiants.");
      project.link = url.href;
    }
    const thumbnail = decodeImage(input.thumbnail, true),
      full = decodeImage(input.full, false);
    const id =
      project.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 65) +
      "-" +
      crypto.randomBytes(4).toString("hex");
    project.image =
      "./assets/img/realisations/custom/" + id + "-card." + thumbnail.ext;
    project.fullImage = full
      ? "./assets/img/realisations/custom/" + id + "-full." + full.ext
      : project.image;
    const projects = read();
    projects[id] = project;
    const html = fs.readFileSync(htmlPath, "utf8");
    const start = "<!-- project-cards:start -->",
      end = "<!-- project-cards:end -->";
    if (!html.includes(start) || !html.includes(end))
      throw Error(
        "Repères de galerie introuvables : aucune modification effectuée.",
      );
    const nextHtml = (
      html.slice(0, html.indexOf(start) + start.length) +
      "\n" +
      Object.entries(projects)
        .map(([key, p], i) => card(key, p, i))
        .join("\n") +
      "\n" +
      html.slice(html.indexOf(end))
    ).replace(
      /\d+ PROJETS \/ DU BESOIN À LA SOLUTION/,
      String(Object.keys(projects).length).padStart(2, "0") +
        " PROJETS / DU BESOIN À LA SOLUTION",
    );
    const archive = path.join(
      root,
      ".cache",
      "project-editor-backups",
      Date.now() + "-" + id,
    );
    fs.mkdirSync(archive, { recursive: true });
    fs.copyFileSync(dataPath, path.join(archive, "projects-data.js"));
    fs.copyFileSync(htmlPath, path.join(archive, "home.html"));
    fs.mkdirSync(path.join(root, "assets/img/realisations/custom"), {
      recursive: true,
    });
    fs.writeFileSync(path.join(root, project.image), thumbnail.bytes, {
      flag: "wx",
    });
    if (full)
      fs.writeFileSync(path.join(root, project.fullImage), full.bytes, {
        flag: "wx",
      });
    const nextData =
      "/* Portfolio projects. Edited locally; publication is a separate action. */\nwindow.portfolioProjects = " +
      JSON.stringify(projects, null, 2).replace(/</g, "\\u003c") +
      ";\n";
    try {
      fs.writeFileSync(dataPath, nextData);
      fs.writeFileSync(htmlPath, nextHtml);
    } catch (error) {
      fs.copyFileSync(path.join(archive, "projects-data.js"), dataPath);
      fs.copyFileSync(path.join(archive, "home.html"), htmlPath);
      throw error;
    }
    return { id, title: project.title, count: Object.keys(projects).length };
  }
  return { read, add };
}
module.exports = { createStore };
