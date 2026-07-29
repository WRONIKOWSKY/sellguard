// SellCov · Dossier litige (100% client-side)
//
// Constat du test Vinted de juillet 2026 : les supports des plateformes
// n'exploitent ni les liens externes ni les vidéos — ils demandent des photos
// en pièce jointe. Ce module transforme un certificat en dossier PDF
// autoportant : photos clés extraites de la vidéo certifiée + métadonnées +
// QR code vers la page de vérification publique.
//
// Tout se passe dans le navigateur (canvas + jsPDF) : pas de ffmpeg côté
// serveur, pas de stockage supplémentaire, et ça marche pour tous les
// certificats existants puisque /api/verify fournit déjà l'URL signée.
//
// Limite assumée : les photos sont extraites par le navigateur du visiteur,
// elles ne sont donc pas individuellement certifiées. Le PDF le dit
// explicitement et renvoie vers la vidéo intégrale (hash SHA-256 + Bitcoin)
// pour toute vérification indépendante.

const CARRIER_LABELS = {
  colissimo: "Colissimo",
  mondialrelay: "Mondial Relay",
  chronopost: "Chronopost",
  dpd: "DPD",
  ups: "UPS",
  dhl: "DHL",
  laposte: "La Poste",
  autre: "Autre",
};

// ---------------------------------------------------------------------------
// Extraction de photos clés
// ---------------------------------------------------------------------------

const SEEK_TIMEOUT_MS = 8000;
// Les MP4 de MediaRecorder ont souvent le moov en fin de fichier : le
// navigateur doit télécharger une grande partie de la vidéo avant d'avoir
// les métadonnées. On laisse large.
const METADATA_TIMEOUT_MS = 30000;
const SIG_SIZE = 8; // signature 8x8 en niveaux de gris pour la déduplication
const SIG_DIFF_THRESHOLD = 6; // en dessous : frames considérées identiques

function waitForEvent(el, event, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`timeout waiting for ${event}`));
    }, timeoutMs);
    function onEvent() {
      cleanup();
      resolve();
    }
    function onError() {
      cleanup();
      reject(new Error("video error"));
    }
    function cleanup() {
      clearTimeout(timer);
      el.removeEventListener(event, onEvent);
      el.removeEventListener("error", onError);
    }
    el.addEventListener(event, onEvent);
    el.addEventListener("error", onError);
  });
}

// Certains webm issus de MediaRecorder ont duration=Infinity tant qu'on n'a
// pas seek au-delà de la fin (bug Chrome connu). Le seek géant force le
// navigateur à calculer la vraie durée.
async function resolveDuration(video) {
  if (isFinite(video.duration) && video.duration > 0) return video.duration;
  video.currentTime = 1e9;
  await waitForEvent(video, "seeked", SEEK_TIMEOUT_MS).catch(() => {});
  const d = video.duration;
  video.currentTime = 0;
  await waitForEvent(video, "seeked", SEEK_TIMEOUT_MS).catch(() => {});
  if (isFinite(d) && d > 0) return d;
  throw new Error("duration unavailable");
}

function frameSignature(video, sigCanvas) {
  const ctx = sigCanvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(video, 0, 0, SIG_SIZE, SIG_SIZE);
  const { data } = ctx.getImageData(0, 0, SIG_SIZE, SIG_SIZE);
  const gray = new Array(SIG_SIZE * SIG_SIZE);
  for (let i = 0; i < gray.length; i++) {
    gray[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  }
  return gray;
}

function signatureDiff(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

// Mesure de qualité d'une frame : luminosité moyenne + netteté (variance du
// Laplacien sur une réduction 64px). Sert à pré-décocher les photos
// probablement inexploitables (noires, floues) dans l'écran de sélection —
// c'est l'utilisateur qui tranche, pas l'algorithme.
const QUALITY_W = 64;
function frameQuality(video, qCanvas) {
  const qh = Math.max(8, Math.round((video.videoHeight / video.videoWidth) * QUALITY_W) || 36);
  qCanvas.width = QUALITY_W;
  qCanvas.height = qh;
  const ctx = qCanvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(video, 0, 0, QUALITY_W, qh);
  const { data } = ctx.getImageData(0, 0, QUALITY_W, qh);
  const gray = new Float32Array(QUALITY_W * qh);
  let sum = 0;
  for (let i = 0; i < gray.length; i++) {
    gray[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
    sum += gray[i];
  }
  const brightness = sum / gray.length;
  let lapVar = 0;
  let n = 0;
  for (let y = 1; y < qh - 1; y++) {
    for (let x = 1; x < QUALITY_W - 1; x++) {
      const i = y * QUALITY_W + x;
      const lap = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - QUALITY_W] - gray[i + QUALITY_W];
      lapVar += lap * lap;
      n++;
    }
  }
  return { brightness, sharpness: lapVar / n };
}

// Extrait jusqu'à `keep` photos distinctes de la vidéo. On échantillonne
// `candidates` positions régulières, on écarte les frames identiques à la
// précédente retenue (cas réel : caméra qui fige en cours d'enregistrement,
// cf. bug SC-4M34TMHW), puis on resserre à `keep` photos réparties.
// Chaque photo reçoit un booléen `flagged` (sombre ou nettement plus floue
// que les autres) pour pré-décocher dans l'écran de sélection.
//
// Chrome gèle le chargement des vidéos dans un onglet caché : si
// l'utilisateur change d'onglet pendant l'extraction, on attend qu'il
// revienne et on réessaie au lieu d'afficher une erreur.
export async function extractFrames(videoUrl, opts = {}) {
  try {
    return await doExtractFrames(videoUrl, opts);
  } catch (e) {
    if (typeof document !== "undefined" && document.hidden) {
      await new Promise((resolve) => {
        const onVisible = () => {
          if (!document.hidden) {
            document.removeEventListener("visibilitychange", onVisible);
            resolve();
          }
        };
        document.addEventListener("visibilitychange", onVisible);
      });
      return doExtractFrames(videoUrl, opts);
    }
    throw e;
  }
}

async function doExtractFrames(videoUrl, { candidates = 32, keep = 20, maxWidth = 1280, onProgress } = {}) {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous"; // signed URL Supabase → CORS *, canvas non taintée
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = videoUrl;

  await waitForEvent(video, "loadedmetadata", METADATA_TIMEOUT_MS);
  const duration = await resolveDuration(video);

  const w = Math.min(video.videoWidth || maxWidth, maxWidth);
  const h = Math.round((video.videoHeight / video.videoWidth) * w) || Math.round((w * 3) / 4);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const sigCanvas = document.createElement("canvas");
  sigCanvas.width = SIG_SIZE;
  sigCanvas.height = SIG_SIZE;
  const qCanvas = document.createElement("canvas");

  const collected = [];
  let lastSig = null;
  for (let i = 0; i < candidates; i++) {
    const t = duration * (0.02 + (0.96 * i) / (candidates - 1));
    try {
      video.currentTime = t;
      await waitForEvent(video, "seeked", SEEK_TIMEOUT_MS);
    } catch (e) {
      continue; // frame illisible → on passe à la suivante
    }
    const sig = frameSignature(video, sigCanvas);
    if (lastSig && signatureDiff(sig, lastSig) < SIG_DIFF_THRESHOLD) {
      if (onProgress) onProgress(i + 1, candidates);
      continue;
    }
    lastSig = sig;
    ctx.drawImage(video, 0, 0, w, h);
    const quality = frameQuality(video, qCanvas);
    collected.push({
      dataUrl: canvas.toDataURL("image/jpeg", 0.82),
      timeSec: video.currentTime,
      width: w,
      height: h,
      brightness: quality.brightness,
      sharpness: quality.sharpness,
    });
    if (onProgress) onProgress(i + 1, candidates);
  }

  video.removeAttribute("src");
  video.load();

  if (collected.length === 0) throw new Error("no frames extracted");

  let frames = collected;
  if (collected.length > keep) {
    // Resserre à `keep` photos réparties sur toute la vidéo
    const picked = [];
    for (let i = 0; i < keep; i++) {
      picked.push(collected[Math.round((i * (collected.length - 1)) / (keep - 1))]);
    }
    frames = [...new Set(picked)];
  }

  // Marque les frames suspectes : très sombres, ou nettement plus floues que
  // la médiane du lot (seuil relatif : une vidéo entièrement floue ne doit
  // pas tout décocher).
  const sharpnesses = frames.map((f) => f.sharpness).sort((a, b) => a - b);
  const medianSharp = sharpnesses[Math.floor(sharpnesses.length / 2)] || 0;
  frames.forEach((f) => {
    f.flagged = f.brightness < 25 || (medianSharp > 0 && f.sharpness < medianSharp * 0.25);
  });

  return frames;
}

// ---------------------------------------------------------------------------
// Assemblage du PDF
// ---------------------------------------------------------------------------

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const INK = [17, 17, 17];
const MUTED = [107, 107, 107];
const GREEN_DEEP = [22, 122, 72];
const GREEN_SOFT = [231, 243, 236];
const LINE = [230, 228, 220];
const BG_ALT = [248, 247, 243];

export async function buildDossierPdf({ cert, frames, lang, origin }) {
  const { jsPDF } = await import("jspdf");
  const QRCode = (await import("qrcode")).default;

  const isEn = lang === "en";
  const verifyUrl = `${origin}/verify/${cert.cert_id}`;
  const t = {
    title: isEn ? "Dispute evidence file" : "Dossier de preuve litige",
    subtitle: isEn ? "Timestamped video proof, key photos attached" : "Preuve vidéo horodatée, photos clés jointes",
    certLine: isEn ? `Certificate ${cert.cert_id}` : `Certificat ${cert.cert_id}`,
    f_article: isEn ? "Item" : "Article",
    f_ref: isEn ? "Order ref." : "Réf. commande",
    f_carrier: isEn ? "Carrier" : "Transporteur",
    f_tracking: isEn ? "Tracking" : "Suivi colis",
    f_date: isEn ? "Recorded on" : "Enregistré le",
    f_size: isEn ? "Video size" : "Taille vidéo",
    f_hash: isEn ? "SHA-256 hash of the video" : "Empreinte SHA-256 de la vidéo",
    f_btc: isEn ? "Bitcoin anchoring" : "Ancrage Bitcoin",
    btc_confirmed: isEn ? "Confirmed (OpenTimestamps)" : "Confirmé (OpenTimestamps)",
    btc_pending: isEn ? "In progress (OpenTimestamps)" : "En cours (OpenTimestamps)",
    verif_title: isEn ? "Independent verification" : "Vérification indépendante",
    verif_text: isEn
      ? "The photos in this file are extracted from a single-take video recorded at the date above. The video's SHA-256 hash is timestamped and anchored in the Bitcoin blockchain: neither the seller nor SellCov can alter it afterwards. Anyone can check the full video and its authenticity at:"
      : "Les photos de ce dossier sont extraites d'une vidéo en une seule prise, enregistrée à la date ci-dessus. L'empreinte SHA-256 de la vidéo est horodatée et ancrée dans la blockchain Bitcoin : ni le vendeur ni SellCov ne peuvent la modifier après coup. Toute personne peut consulter la vidéo intégrale et vérifier son authenticité sur :",
    photos_title: isEn ? "Key photos extracted from the certified video" : "Photos clés extraites de la vidéo certifiée",
    photo_caption: (i, n, ts) =>
      isEn
        ? `Photo ${i}/${n} · at ${ts} in certified video ${cert.cert_id}`
        : `Photo ${i}/${n} · à ${ts} dans la vidéo certifiée ${cert.cert_id}`,
    footer: isEn ? "Generated by SellCov" : "Généré par SellCov",
    page: (i, n) => (isEn ? `page ${i}/${n}` : `page ${i}/${n}`),
  };

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const MARGIN = 15;

  // --- Page 1 : constat -----------------------------------------------------
  // Header noir
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, W, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SellCov", MARGIN, 13);
  doc.setTextColor(9, 177, 186);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(t.title, MARGIN, 20);

  // Bandeau certificat
  doc.setFillColor(...GREEN_SOFT);
  doc.setDrawColor(31, 159, 95);
  doc.roundedRect(MARGIN, 32, W - 2 * MARGIN, 11, 2, 2, "FD");
  doc.setTextColor(...GREEN_DEEP);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${t.certLine} · ${t.subtitle}`, MARGIN + 4, 39);

  // Métadonnées
  const dateStr = new Date(cert.timestamp).toLocaleString(isEn ? "en-US" : "fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "long",
    timeStyle: "medium",
  });
  const sizeMB = cert.video_size_bytes ? (cert.video_size_bytes / (1024 * 1024)).toFixed(1) + " MB" : "—";
  const rows = [
    [t.f_article, cert.article || "—"],
    [t.f_ref, cert.order_ref || "—"],
    [t.f_carrier, CARRIER_LABELS[cert.tracking_carrier] || cert.tracking_carrier || "—"],
    [t.f_tracking, cert.tracking_number || "—"],
    [t.f_date, dateStr],
    [t.f_size, sizeMB],
  ];
  if (cert.ots_status === "bitcoin_confirmed") rows.push([t.f_btc, t.btc_confirmed]);
  else if (cert.ots_status === "pending_bitcoin") rows.push([t.f_btc, t.btc_pending]);

  let y = 50;
  rows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...BG_ALT);
      doc.rect(MARGIN, y - 5.2, W - 2 * MARGIN, 8, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), MARGIN + 3, y);
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(String(value).substring(0, 70), MARGIN + 60, y);
    y += 8;
  });

  // Hash sur sa propre ligne (courier, pleine largeur)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(t.f_hash.toUpperCase(), MARGIN + 3, y + 1);
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text(cert.video_hash || "—", MARGIN + 3, y + 6.5);
  y += 14;

  // Bloc vérification : texte + QR
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 512, margin: 1 });
  const boxH = 46;
  doc.setDrawColor(...LINE);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(MARGIN, y, W - 2 * MARGIN, boxH, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(t.verif_title, MARGIN + 5, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  const textWidth = W - 2 * MARGIN - 52;
  doc.text(doc.splitTextToSize(t.verif_text, textWidth), MARGIN + 5, y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...GREEN_DEEP);
  doc.text(verifyUrl.replace(/^https?:\/\//, ""), MARGIN + 5, y + boxH - 5);
  doc.addImage(qrDataUrl, "PNG", W - MARGIN - 42, y + 4, 38, 38);
  y += boxH + 8;

  // --- Pages photos ---------------------------------------------------------
  const perPage = 2;
  const slotH = 118;
  frames.forEach((frame, idx) => {
    const slot = idx % perPage;
    if (slot === 0) {
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...INK);
      doc.text(t.photos_title, MARGIN, 18);
    }
    const top = 26 + slot * (slotH + 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(t.photo_caption(idx + 1, frames.length, fmtTime(frame.timeSec)), MARGIN, top);
    const maxW = W - 2 * MARGIN;
    const ratio = frame.height / frame.width;
    let imgW = maxW;
    let imgH = imgW * ratio;
    if (imgH > slotH) {
      imgH = slotH;
      imgW = imgH / ratio;
    }
    doc.addImage(frame.dataUrl, "JPEG", MARGIN + (maxW - imgW) / 2, top + 3, imgW, imgH);
  });

  // --- Footer sur toutes les pages ------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LINE);
    doc.line(MARGIN, 285, W - MARGIN, 285);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`sellcov.com · ${t.footer} · ${cert.cert_id}`, MARGIN, 290);
    doc.text(t.page(i, pageCount), W - MARGIN, 290, { align: "right" });
  }

  return doc;
}

// Assemble le PDF avec les photos retenues par l'utilisateur et déclenche le
// téléchargement.
export async function saveDossierPdf({ cert, frames, lang, origin }) {
  const doc = await buildDossierPdf({ cert, frames, lang, origin });
  doc.save(`SellCov_${cert.cert_id}_Dossier.pdf`);
}
