// Regenerates the About-section avatar from the generated illustration.
// Needs sharp, which is deliberately not a project dependency:
//   npm install --no-save sharp && node scripts/build-avatar-image.js
const sharp = require("sharp");
const SRC = ".cache/avatar-sources/nizar-avatar-illustration.png";
const BG = [0xec, 0xe8, 0xdc];
const TOL = 5;

// Separable box blur, run twice to approximate a small gaussian.
// Sharp's own blur() promotes a 1-channel raw buffer to 3 channels, which
// silently corrupts an alpha mask, so the mask is smoothed here instead.
function smooth(mask, W, H, radius, passes) {
  let src = mask;
  for (let pass = 0; pass < passes; pass++) {
    const horizontal = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let sum = 0, count = 0;
        for (let d = -radius; d <= radius; d++) {
          const nx = x + d;
          if (nx < 0 || nx >= W) continue;
          sum += src[y * W + nx]; count++;
        }
        horizontal[y * W + x] = sum / count;
      }
    }
    const vertical = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let sum = 0, count = 0;
        for (let d = -radius; d <= radius; d++) {
          const ny = y + d;
          if (ny < 0 || ny >= H) continue;
          sum += horizontal[ny * W + x]; count++;
        }
        vertical[y * W + x] = sum / count;
      }
    }
    src = vertical;
  }
  return src;
}

(async () => {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const near = (i) =>
    Math.abs(data[i] - BG[0]) <= TOL &&
    Math.abs(data[i + 1] - BG[1]) <= TOL &&
    Math.abs(data[i + 2] - BG[2]) <= TOL;

  const isBg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    const p = y * W + x;
    if (isBg[p] || !near(p * C)) return;
    isBg[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const p = stack.pop(), x = p % W, y = (p / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }

  let minX = W, minY = H, maxX = -1, maxY = -1, kept = 0;
  const hard = new Uint8Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (isBg[p]) continue;
      hard[p] = 255; kept++;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  console.log("foreground", ((kept / (W * H)) * 100).toFixed(1) + "%", "bbox", `${maxX - minX + 1}x${maxY - minY + 1}`);

  const soft = smooth(hard, W, H, 1, 2);
  let opaque = 0, clear = 0, edge = 0;
  for (let p = 0; p < W * H; p++) soft[p] === 255 ? opaque++ : soft[p] === 0 ? clear++ : edge++;
  console.log("alpha: opaque", opaque, "clear", clear, "feathered", edge);

  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba[p * 4] = data[p * C];
    rgba[p * 4 + 1] = data[p * C + 1];
    rgba[p * 4 + 2] = data[p * C + 2];
    rgba[p * 4 + 3] = soft[p];
  }

  const pad = 8;
  const left = Math.max(0, minX - pad), top = Math.max(0, minY - pad);
  const cut = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract({
      left, top,
      width: Math.min(W - left, maxX - minX + 1 + pad * 2),
      height: Math.min(H - top, maxY - minY + 1 + pad * 2),
    })
    .png().toBuffer();

  for (const [file, height, quality] of [
    ["nizar-avatar.webp", 1100, 84],
    ["nizar-avatar-small.webp", 640, 80],
  ]) {
    const r = await sharp(cut).resize({ height, fit: "inside", withoutEnlargement: true })
      .webp({ quality, alphaQuality: 92, effort: 6 }).toFile("assets/img/avatar/" + file);
    console.log(file, r.width + "x" + r.height, Math.round(r.size / 1024) + " KB");
  }
})();
