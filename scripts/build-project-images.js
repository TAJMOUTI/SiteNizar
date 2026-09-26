// Convertit les captures de projets en WebP, en deux largeurs pour les
// vignettes. Les fichiers PNG d'origine restent sur disque comme sources.
// Necessite sharp, volontairement absent des dependances du projet :
//   npm install --no-save sharp && node scripts/build-project-images.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const racine = path.resolve(__dirname, "..");
const vignettes = path.join(racine, "assets/img/realisations/cards");
const pleines = path.join(racine, "assets/img/realisations/full");

const ko = (n) => Math.round(n / 1024);

async function convertir(dossier, largeurs, qualite) {
  const fichiers = fs.readdirSync(dossier).filter((f) => f.endsWith(".png"));
  let avant = 0;
  let apres = 0;
  for (const fichier of fichiers) {
    const source = path.join(dossier, fichier);
    avant += fs.statSync(source).size;
    const base = fichier.replace(/\.png$/, "");
    for (const largeur of largeurs) {
      const suffixe = largeurs.length > 1 ? `-${largeur}` : "";
      const cible = path.join(dossier, `${base}${suffixe}.webp`);
      const info = await sharp(source)
        .resize({ width: largeur, withoutEnlargement: true })
        .webp({ quality: qualite, effort: 6 })
        .toFile(cible);
      apres += info.size;
      console.log(
        `  ${path.basename(cible).padEnd(36)} ${String(info.width).padStart(4)}px  ${String(ko(info.size)).padStart(4)} Ko`,
      );
    }
  }
  return { avant, apres, n: fichiers.length };
}

(async () => {
  console.log("Vignettes des cartes :");
  const v = await convertir(vignettes, [760, 1200], 78);
  console.log("\nCaptures pleine taille :");
  const p = await convertir(pleines, [1600], 80);
  console.log(
    `\n${v.n + p.n} PNG : ${ko(v.avant + p.avant)} Ko  ->  ${ko(v.apres + p.apres)} Ko en WebP`,
  );
})().catch((e) => {
  console.error("Echec :", e.message);
  process.exit(1);
});
