const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "home.html",
  "assets/css/portfoliostyle.css",
  "assets/js/realisations.js",
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
