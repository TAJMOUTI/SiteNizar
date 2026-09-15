// Restores pre-redesign working files, including uncommitted fixes.
// Does not delete new assets or alter Git history.
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const backup = path.join(root, ".cache", "redesign-baseline");
const files = [
  "home.html",
  "assets/js/contact-automation.js",
  "scripts/check-files.js",
  "scripts/check-html.js",
  "package.json",
  "SITE_NIZAR_PROJECT_STATE.md",
];
for (const file of files) {
  if (!fs.existsSync(path.join(backup, file)))
    throw new Error(`Backup missing: ${file}`);
}
if (!process.argv.includes("--apply")) {
  console.log("Preview only. Files restored from .cache/redesign-baseline:");
  files.forEach((file) => console.log(file));
  console.log(
    "Run with --apply to restore. Current changes to these files will be overwritten.",
  );
} else {
  const archive = path.join(
    root,
    ".cache",
    "redesign-before-restore-" + Date.now(),
  );
  for (const file of files) {
    const saved = path.join(archive, file);
    fs.mkdirSync(path.dirname(saved), { recursive: true });
    fs.copyFileSync(path.join(root, file), saved);
    fs.copyFileSync(path.join(backup, file), path.join(root, file));
  }
  console.log(
    "Previous portfolio restored. Redesign files saved to " + archive,
  );
}
