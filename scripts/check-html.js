const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const html = fs
  .readFileSync(path.join(root, "home.html"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "");
const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
let failed = false;
function check(label, valid) {
  console[valid ? "log" : "error"](`${valid ? "OK" : "FAIL"} ${label}`);
  if (!valid) failed = true;
}
[
  "accueil",
  "propos",
  "experience",
  "skills",
  "realisations",
  "contact",
].forEach((id) => check(`section ${id}`, ids.includes(id)));
check("identifiants uniques", new Set(ids).size === ids.length);
check("un titre principal", (html.match(/<h1\b/g) || []).length === 1);
for (const match of html.matchAll(/\b(?:href|aria-controls)="(#?[^"\s]+)"/g)) {
  if (match[0].startsWith("aria-controls") || match[1].startsWith("#")) {
    check(`cible ${match[1]}`, ids.includes(match[1].replace(/^#/, "")));
  }
}
// Check exact casing even on Windows.
for (const reference of new Set(
  Array.from(
    html.matchAll(/\b(?:src|href)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g),
    (match) => match[1],
  ),
)) {
  let current = root;
  let exists = true;
  for (const segment of decodeURIComponent(reference)
    .split("/")
    .filter((part) => part && part !== ".")) {
    if (
      segment === ".." ||
      !fs.existsSync(current) ||
      !fs.statSync(current).isDirectory() ||
      !fs.readdirSync(current).includes(segment)
    ) {
      exists = false;
      break;
    }
    current = path.join(current, segment);
  }
  check(`ressource ${reference}`, exists);
}
check(
  "images décrites",
  Array.from(html.matchAll(/<img\b[^>]*>/g)).every((match) =>
    /\balt="[^"]*"/.test(match[0]),
  ),
);
check("formulaire n8n présent", html.includes("data-webhook-url-prod="));
process.exitCode = failed ? 1 : 0;
