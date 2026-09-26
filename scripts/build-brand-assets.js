// Genere le jeu d'icones du site et l'image de partage sur les reseaux.
// Necessite sharp, volontairement absent des dependances du projet :
//   npm install --no-save sharp && node scripts/build-brand-assets.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const racine = path.resolve(__dirname, "..");
const ENCRE = "#101210";
const PAPIER = "#eee9dd";
const ROUGE = "#cf5945";
const POLICE = path.join(racine, "assets/fonts/montserrat-extra-bold.ttf");

// Le « n » de la signature du site, trace en chemin pour ne dependre
// d'aucune police installee sur la machine qui affiche l'icone.
const marque = (taille, fond) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${taille}" height="${taille}">
  ${fond ? `<rect width="64" height="64" fill="${ENCRE}"/>` : ""}
  <path d="M17 47V21.5h7.2v3.9c2-2.9 5-4.4 8.7-4.4 6.4 0 10.3 4.2 10.3 11V47h-7.2V33.4c0-3.9-2-6-5.4-6-3.5 0-6.1 2.4-6.1 6.5V47z" fill="${PAPIER}"/>
  <circle cx="46.4" cy="44" r="3.8" fill="${ROUGE}"/>
</svg>`;

// Un fichier ICO peut encapsuler une image PNG : en-tete de 22 octets, puis
// les octets du PNG tels quels.
function versIco(pngBuffer, cote) {
  const entete = Buffer.alloc(22);
  entete.writeUInt16LE(0, 0); // reserve
  entete.writeUInt16LE(1, 2); // type icone
  entete.writeUInt16LE(1, 4); // une seule image
  entete.writeUInt8(cote === 256 ? 0 : cote, 6);
  entete.writeUInt8(cote === 256 ? 0 : cote, 7);
  entete.writeUInt8(0, 8); // palette
  entete.writeUInt8(0, 9); // reserve
  entete.writeUInt16LE(1, 10); // plans
  entete.writeUInt16LE(32, 12); // bits par pixel
  entete.writeUInt32LE(pngBuffer.length, 14);
  entete.writeUInt32LE(22, 18);
  return Buffer.concat([entete, pngBuffer]);
}

// La famille declaree dans le fichier est « Montserrat ExtraBold », pas
// « Montserrat » : avec le mauvais nom, Pango retombe sur une police par defaut.
// dpi 72 rend la taille en points equivalente a des pixels.
async function texte(contenu, taillePx, couleur, chasse) {
  return sharp({
    text: {
      text: `<span foreground="${couleur}"${chasse ? ` letter_spacing="${chasse}"` : ""}>${contenu}</span>`,
      font: `Montserrat ExtraBold ${taillePx}`,
      fontfile: POLICE,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

(async () => {
  fs.writeFileSync(path.join(racine, "favicon.svg"), marque(64, true));

  const ico = await sharp(Buffer.from(marque(32, true))).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(racine, "favicon.ico"), versIco(ico, 32));

  // iOS rogne l'icone en carre arrondi : on garde une marge interieure.
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: ENCRE },
  })
    .composite([{ input: Buffer.from(marque(132, false)), top: 24, left: 24 }])
    .png()
    .toFile(path.join(racine, "apple-touch-icon.png"));

  // Image de partage : format 1200 x 630 attendu par LinkedIn et les cartes
  // Twitter en grand format.
  const L = 1200;
  const H = 630;
  let lignes = "";
  for (let x = 0; x <= L; x += 40) lignes += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${PAPIER}" stroke-opacity=".05"/>`;
  for (let y = 0; y <= H; y += 40) lignes += `<line x1="0" y1="${y}" x2="${L}" y2="${y}" stroke="${PAPIER}" stroke-opacity=".05"/>`;
  const fond = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}">
    <rect width="${L}" height="${H}" fill="${ENCRE}"/>
    ${lignes}
    <rect x="0" y="0" width="14" height="${H}" fill="${ROUGE}"/>
    <circle cx="1060" cy="150" r="104" fill="none" stroke="#3457cf" stroke-opacity=".55"/>
    <circle cx="1060" cy="150" r="150" fill="none" stroke="#3457cf" stroke-opacity=".25"/>
  </svg>`;

  const nom = await texte("NIZAR", 94, PAPIER, -2400);
  const nom2 = await texte("TAJMOUTI.", 94, PAPIER, -2400);
  const role = await texte("Ingénieur fullstack &amp; Product Owner", 32, PAPIER);
  const pied = await texte("nizart.netlify.app", 22, "#bab9ab");
  const marge = 86;
  const hautNom = 148;
  const basNom2 = hautNom + nom.info.height + nom2.info.height;
  const filet = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="6"><rect width="96" height="6" fill="${ROUGE}"/></svg>`;

  await sharp(Buffer.from(fond))
    .composite([
      { input: nom.data, top: hautNom, left: marge },
      { input: nom2.data, top: hautNom + nom.info.height, left: marge },
      { input: Buffer.from(filet), top: basNom2 + 44, left: marge + 4 },
      { input: role.data, top: basNom2 + 74, left: marge },
      { input: pied.data, top: H - 84, left: marge },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(racine, "assets/img/og-image.png"));

  for (const f of ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "assets/img/og-image.png"]) {
    const p = path.join(racine, f);
    console.log(`${f.padEnd(28)} ${Math.round(fs.statSync(p).size / 1024)} Ko`);
  }
})().catch((e) => {
  console.error("Echec :", e.message);
  process.exit(1);
});
