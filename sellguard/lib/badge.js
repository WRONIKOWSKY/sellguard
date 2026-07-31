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
    const lw = 330;
    const lh = (logo.height / logo.width) * lw;
    ctx.drawImage(logo, (SIZE - lw) / 2, 104, lw, lh);
  } catch (e) {
    ctx.fillStyle = GREEN_DEEP;
    ctx.font = "800 96px -apple-system, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SellCov", SIZE / 2, 220);
  }

  ctx.textAlign = "center";

  // Titre
  ctx.fillStyle = INK;
  ctx.font = "800 72px -apple-system, system-ui, sans-serif";
  ctx.fillText(isEn ? "Shipments filmed" : "Envois filmés", SIZE / 2, 490);
  ctx.fillText(isEn ? "and certified" : "et certifiés", SIZE / 2, 572);

  // Pseudo dans une pastille verte
  const handleText = "@" + handle;
  const handleSize = fitFont(ctx, handleText, 860, 54, 700);
  const pw = ctx.measureText(handleText).width + 96;
  ctx.fillStyle = "#e7f3ec";
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 4;
  roundRect(ctx, (SIZE - pw) / 2, 600, pw, 88, 44);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = GREEN_DEEP;
  ctx.font = `700 ${handleSize}px -apple-system, system-ui, sans-serif`;
  ctx.fillText(handleText, SIZE / 2, 658);

  // Adresse de vérification : l'élément principal. Sur mobile personne ne
  // peut scanner le QR de son propre écran, c'est l'adresse écrite qui se
  // lit et se retape. Elle rétrécit automatiquement pour les longs pseudos.
  const shortUrl = verifyUrl.replace(/^https?:\/\/(www\.)?/, "");
  ctx.fillStyle = BG;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 3;
  roundRect(ctx, 100, 730, SIZE - 200, 130, 28);
  ctx.fill();
  ctx.stroke();
  const urlSize = fitFont(ctx, shortUrl, 900, 50, 700);
  ctx.fillStyle = INK;
  ctx.font = `700 ${urlSize}px -apple-system, system-ui, sans-serif`;
  ctx.fillText(shortUrl, SIZE / 2, 730 + 65 + urlSize / 3);

  // Mention + QR (utile sur ordinateur et depuis une capture d'écran)
  ctx.fillStyle = MUTED;
  ctx.font = "500 28px -apple-system, system-ui, sans-serif";
  ctx.fillText(
    isEn ? "Type this address or scan the code to verify" : "Tape cette adresse ou scanne le code pour vérifier",
    SIZE / 2,
    912
  );

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 512, margin: 1 });
  const qrImg = await loadImage(qrDataUrl);
  const qs = 150;
  ctx.drawImage(qrImg, (SIZE - qs) / 2, 950, qs, qs);

  return canvas;
}

// Réduit la taille de police jusqu'à ce que le texte tienne dans maxWidth.
function fitFont(ctx, text, maxWidth, startSize, weight) {
  let size = startSize;
  const family = "-apple-system, system-ui, sans-serif";
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && size > 20) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
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
