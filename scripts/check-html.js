const fs = require("fs");
const path = require("path");

const htmlPath = path.join(process.cwd(), "home.html");
const html = fs.readFileSync(htmlPath, "utf8");

const requiredSnippets = [
  { label: "hero", value: 'class="page-header"' },
  { label: "a propos", value: 'id="propos"' },
  { label: "formation", value: 'id="formation"' },
  { label: "experience", value: 'id="experience"' },
  { label: "competences", value: 'id="skills"' },
  { label: "realisations", value: 'id="realisations"' },
  { label: "centres d'interet", value: 'id="interest"' },
  { label: "contact", value: 'id="contact"' },
  { label: "cta realisations", value: 'href="#realisations"' },
  { label: "cta contact", value: 'href="#contact"' },
  { label: "lien cv", value: "CV Nizar Tajmouti.pdf" },
];

let hasError = false;

for (const snippet of requiredSnippets) {
  if (html.includes(snippet.value)) {
    console.log(`OK ${snippet.label}`);
  } else {
    console.error(`Missing ${snippet.label}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}
