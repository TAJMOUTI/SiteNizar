const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "home.html",
  "assets/css/editorial.css",
  "assets/css/contact-form.css",
  "assets/js/editorial.js",
  "assets/js/projects-data.js",
  "assets/js/contact-automation.js",
  "assets/css/avatar.css",
  "assets/js/avatar.js",
  "assets/js/avatar-model.js",
  "assets/js/vendor/three.module.min.js",
  "assets/js/vendor/three.core.min.js",
  "files/CV NIZAR TAJMOUTI.pdf",
];

let hasError = false;

for (const file of requiredFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`OK ${file}`);
  } else {
    console.error(`Missing ${file}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}
