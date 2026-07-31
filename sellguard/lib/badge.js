// SellCov · Badge vendeur (100% client-side)
//
// Génère l'image carrée que le vendeur ajoute en dernière photo de ses
// annonces : logo, mention "Envois filmés et certifiés", son pseudo, et un QR
// vers sa page publique sellcov.com/vendeur/<slug>.
//
// Anti-contrefaçon à deux étages : le pseudo est dessiné DANS l'image (un
// badge volé affiche le pseudo du vrai propriétaire), et le QR mène à la page
// SellCov qui confirme le pseudo et le nombre d'envois certifiés — page que
// personne d'autre ne peut fabriquer.

const SIZE = 1200;
const INK = "#111111";
const MUTED = "#6b6b6b";
const GREEN = "#1f9f5f";
const GREEN_DEEP = "#167a48";
const BG = "#f8f7f3";
const CARD = "#ffffff";
const LINE = "#e6e4dc";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed: " + src));
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Retourne un canvas 1200x1200 prêt à exporter.
export async function buildBadgeCanvas({ handle, slug, origin, lang = "fr" }) {
  const QRCode = (await import("qrcode")).default;
  const isEn = lang === "en";
  const verifyUrl = `${origin}/vendeur/${slug}`;

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");

  // Fond crème + carte blanche arrondie
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = CARD;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 4;
  roundRect(ctx, 60, 60, SIZE - 120, SIZE - 120, 56);
  ctx.fill();
  ctx.stroke();

  // Logo (déjà servi par le site, même origine → canvas propre)
  try {
    const logo = await loadImage("/logo-full.png");
    const lw = 380;
    const lh = (logo.height / logo.width) * lw;
    ctx.drawImage(logo, (SIZE - lw) / 2, 96, lw, lh);
  } catch (e) {
    ctx.fillStyle = GREEN_DEEP;
    ctx.font = "800 96px -apple-system, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SellCov", SIZE / 2, 220);
  }

  ctx.textAlign = "center";

  // Titre
  ctx.fillStyle = INK;
  ctx.font = "800 76px -apple-system, system-ui, sans-serif";
  ctx.fillText(isEn ? "Shipments filmed" : "Envois filmés", SIZE / 2, 520);
  ctx.fillText(isEn ? "and certified" : "et certifiés", SIZE / 2, 610);

  // Pseudo dans une pastille verte
  const handleText = "@" + handle;
  ctx.font = "700 54px -apple-system, system-ui, sans-serif";
  const tw = ctx.measureText(handleText).width;
  const pw = tw + 96;
  ctx.fillStyle = "#e7f3ec";
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 4;
  roundRect(ctx, (SIZE - pw) / 2, 660, pw, 92, 46);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = GREEN_DEEP;
  ctx.fillText(handleText, SIZE / 2, 722);

  // QR vers la page publique
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 512, margin: 1 });
  const qrImg = await loadImage(qrDataUrl);
  const qs = 260;
  ctx.drawImage(qrImg, (SIZE - qs) / 2, 790, qs, qs);

  // URL en toutes lettres + mention
  ctx.fillStyle = MUTED;
  ctx.font = "600 34px -apple-system, system-ui, sans-serif";
  ctx.fillText(verifyUrl.replace(/^https?:\/\/(www\.)?/, ""), SIZE / 2, 1092);
  ctx.font = "500 28px -apple-system, system-ui, sans-serif";
  ctx.fillText(
    isEn ? "Scan to verify this seller" : "Scanne pour vérifier ce vendeur",
    SIZE / 2,
    1132
  );

  return canvas;
}

// Génère et télécharge le badge en PNG.
export async function downloadBadge({ handle, slug, origin, lang }) {
  const canvas = await buildBadgeCanvas({ handle, slug, origin, lang });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("toBlob failed"));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `SellCov_badge_${slug}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      resolve();
    }, "image/png");
  });
}
