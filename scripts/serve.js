// Local preview only. Exposes portfolio files, never repository metadata/backups.
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { createStore } = require("./project-editor-store");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};
// Comme en production, une adresse inconnue renvoie la page 404 du site
// avec le bon statut HTTP.
function servirIntrouvable(res, req, root) {
  const page = path.join(root, "404.html");
  if (fs.existsSync(page)) {
    const corps = fs.readFileSync(page);
    res.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": corps.length,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : corps);
    return;
  }
  res.writeHead(404);
  res.end("Not found");
}

function createPreviewServer(root = path.resolve(__dirname, "..")) {
  const store = createStore(root);
  const token = crypto.randomBytes(32).toString("hex");
  const server = http.createServer((req, res) => {
    const host = req.headers.host;
    const validHosts = [
      "127.0.0.1:" + req.socket.localPort,
      "localhost:" + req.socket.localPort,
    ];
    if (!validHosts.includes(host)) {
      res.writeHead(403);
      res.end("Local access only");
      return;
    }
    function json(status, data) {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(JSON.stringify(data));
    }
    let requested;
    try {
      requested = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400);
      res.end("Invalid URL");
      return;
    }
    if (requested === "/admin" || requested.startsWith("/api/editor/")) {
      if (
        (req.headers.origin && req.headers.origin !== "http://" + host) ||
        req.headers["sec-fetch-site"] === "cross-site"
      ) {
        json(403, { error: "Accès local uniquement." });
        return;
      }
      if (requested === "/admin" && req.method === "GET") {
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Frame-Options": "DENY",
          "Content-Security-Policy":
            "frame-ancestors 'none'; form-action 'self'; connect-src 'self'; base-uri 'none'",
          "X-Content-Type-Options": "nosniff",
        });
        res.end(fs.readFileSync(path.join(__dirname, "project-editor.html")));
        return;
      }
      if (requested === "/api/editor/session" && req.method === "GET") {
        json(200, { token });
        return;
      }
      if (requested === "/api/editor/projects" && req.method === "POST") {
        if (
          req.headers.origin !== "http://" + host ||
          req.headers["x-editor-token"] !== token
        ) {
          json(403, { error: "Session locale invalide. Recharge cette page." });
          return;
        }
        if (
          !/^application\/json(?:;|$)/i.test(req.headers["content-type"] || "")
        ) {
          json(415, { error: "JSON attendu." });
          return;
        }
        let size = 0,
          tooLarge = false;
        const chunks = [];
        req.on("data", (chunk) => {
          size += chunk.length;
          if (size > 15 * 1024 * 1024) {
            if (!tooLarge) {
              tooLarge = true;
              chunks.length = 0;
              json(413, { error: "Fichiers trop volumineux." });
            }
            return;
          }
          if (!tooLarge) chunks.push(chunk);
        });
        req.on("end", () => {
          if (tooLarge) return;
          try {
            json(
              201,
              store.add(JSON.parse(Buffer.concat(chunks).toString("utf8"))),
            );
          } catch (error) {
            json(400, { error: error.message });
          }
        });
        req.on("error", () => {
          if (!res.writableEnded) json(400, { error: "Requête interrompue." });
        });
        return;
      }
      json(404, { error: "Page introuvable." });
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405);
      res.end();
      return;
    }
    // Memes adresses qu'en production : Netlify sert « /page » depuis
    // « page.html » et redirige la racine vers /home.
    if (["/", "/home", "/home.html"].includes(requested))
      requested = "/home.html";
    const PAGES = ["mentions-legales", "confidentialite", "404"];
    for (const page of PAGES) {
      if (requested === "/" + page) requested = "/" + page + ".html";
    }
    // Fichiers autorises : la page, les pages secondaires, les ressources,
    // et les fichiers de racine attendus par les navigateurs et les robots.
    const RACINE = [
      "/favicon.svg",
      "/favicon.ico",
      "/apple-touch-icon.png",
      "/robots.txt",
      "/sitemap.xml",
    ];
    const autorise =
      /^\/(?:home\.html$|assets\/|files\/)/.test(requested) ||
      PAGES.some((page) => requested === "/" + page + ".html") ||
      RACINE.includes(requested);
    if (
      !autorise ||
      requested.includes("..") ||
      requested.includes("\\")
    ) {
      servirIntrouvable(res, req, root);
      return;
    }
    const file = path.resolve(root, "." + requested);
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(404);
      res.end();
      return;
    }
    fs.stat(file, (error, stats) => {
      if (error || !stats.isFile()) {
        servirIntrouvable(res, req, root);
        return;
      }
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Content-Length": stats.size,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      if (req.method === "HEAD") res.end();
      else
        fs.createReadStream(file)
          .on("error", () => res.destroy())
          .pipe(res);
    });
  });
  return server;
}
if (require.main === module) {
  const server = createPreviewServer();
  server.listen(4173, "127.0.0.1", () => {
    console.log("Portfolio: http://127.0.0.1:4173/home");
    console.log("Mes projets (local uniquement): http://127.0.0.1:4173/admin");
  });
  server.on("error", (error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
module.exports = { createPreviewServer };
