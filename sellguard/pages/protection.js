import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";

export default function Protection() {
  const [mode, setMode] = useState("video");
  const [articleName, setArticleName] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [photos, setPhotos] = useState([]);
  const [certified, setCertified] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef();
  const mediaRecorderRef = useRef();
  const chunksRef = useRef([]);
  const timerRef = useRef();
  const animFrameRef = useRef();
  const fileRef = useRef();

  async function startCamera() {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraOn(true);
    } catch (e) {
      setCameraError("Impossible d'accéder à la caméra. Autorise l'accès dans les paramètres de ton navigateur.");
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraOn(false); setRecording(false);
    cancelAnimationFrame(animFrameRef.current); clearInterval(timerRef.current);
  }

  function drawOverlay() {
    const canvas = canvasRef.current; const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const now = new Date();
    const line1 = `SellGuard · ${now.toLocaleDateString("fr-FR")} ${now.toLocaleTimeString("fr-FR")}`;
    const fontSize = Math.max(13, canvas.width * 0.022);
    ctx.font = `bold ${fontSize}px monospace`;
    const tw = ctx.measureText(line1).width;
    const cx = (canvas.width - tw) / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    const padH = 10, padV = 6;
    ctx.fillRect(cx - padH, cy - fontSize - padV, tw + padH * 2, fontSize + padV * 2);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(line1, cx, cy);
    ctx.globalAlpha = 1.0;
    if (recording) {
      ctx.beginPath(); ctx.arc(18, 18, 7, 0, Math.PI * 2);
      ctx.fillStyle = Math.sin(Date.now() / 300) > 0 ? "#FF3B30" : "rgba(255,59,48,0.3)";
      ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "bold 13px monospace";
      ctx.fillText("REC", 30, 24);
    }
    animFrameRef.current = requestAnimationFrame(drawOverlay);
  }

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const canvas = canvasRef.current;
    const canvasStream = canvas.captureStream(30);
    streamRef.current.getAudioTracks().forEach(t => canvasStream.addTrack(t));
    const mr = new MediaRecorder(canvasStream, { mimeType: "video/webm;codecs=vp8,opus" });
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob); setRecordedUrl(URL.createObjectURL(blob));
    };
    mr.start(100); mediaRecorderRef.current = mr;
    setRecording(true); setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    drawOverlay();
  }

  function stopRecording() {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setRecording(false); clearInterval(timerRef.current); cancelAnimationFrame(animFrameRef.current);
  }

  function downloadVideo() {
    if (!recordedBlob) return;
    const certId = "SG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const name = (articleName || "envoi").replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = recordedUrl; a.download = `SellGuard_${certId}_${name}.webm`; a.click();
    setCertified({ id: certId, article: articleName || "Article", date: new Date().toLocaleString("fr-FR") });
  }

  function handleFiles(files) {
    setPhotos(p => [...p, ...Array.from(files).map(f => ({ url: URL.createObjectURL(f) }))]);
  }

  function certifyPhotos() {
    if (!photos.length || !articleName.trim()) return;
    setCertified({ id: "SG-" + Math.random().toString(36).substr(2, 9).toUpperCase(), article: articleName, date: new Date().toLocaleString("fr-FR"), photos });
  }

  function reset() {
    stopCamera(); setRecordedBlob(null); setRecordedUrl(null); setPhotos([]);
    setArticleName(""); setOrderRef(""); setCertified(null); setElapsed(0);
  }

  function fmt(s) { return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }

  useEffect(() => () => stopCamera(), []);

  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };
  const lbl = { fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 };
  const btn = (bg, col, dis) => ({ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: dis ? "#E5E7EB" : bg, color: dis ? "#999" : col, cursor: dis ? "default" : "pointer", fontFamily: "inherit" });

  if (certified) return (
    <>
      <Head><title>SellGuard — Envoi certifié</title></Head>
      <Layout>
        <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#15803D", marginBottom: 6 }}>Envoi certifié !</h3>
          <p style={{ fontSize: 14, color: "#166534", lineHeight: 1.6 }}>Ta preuve vidéo horodatée a été téléchargée. Conserve ce fichier précieusement.</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 16 }}>CERTIFICAT SELLGUARD</p>
          {[["Numéro", certified.id], ["Article", certified.article], ["Date & heure", certified.date], ["Type", "Vidéo horodatée SellGuard"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
              <span style={{ fontSize: 13, color: "#888" }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111", textAlign: "right", marginLeft: 16 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 14 }}>COMMENT UTILISER CETTE PREUVE PAR PLATEFORME</p>
          {[
            { name: "Vinted", color: "#0F6E56", bg: "#E1F5EE", score: "★★★☆", tip: "Litige → 'Ajouter des preuves' → upload la vidéo. La plupart des acheteurs frauduleux abandonnent dès qu'ils voient une preuve datée." },
            { name: "eBay", color: "#854F0B", bg: "#FEF3C7", score: "★★★★", tip: "Centre de résolution → 'Soumettre des preuves' → upload. eBay reconnaît les vidéos horodatées comme preuve valable. Très efficace." },
            { name: "Leboncoin", color: "#9A3412", bg: "#FFEDD5", score: "★★★★", tip: "Pas de système de litige intégré. Envoie la vidéo directement à l'acheteur. En cas de recours bancaire ou tribunal, c'est une preuve légale solide." },
            { name: "Facebook Marketplace", color: "#1D4ED8", bg: "#EFF6FF", score: "★★★☆", tip: "Envoie via Messenger à l'acheteur et conserve pour tout chargeback bancaire. C'est ta principale protection sur cette plateforme." },
            { name: "Vestiaire Collective", color: "#5B21B6", bg: "#EDE9FE", score: "★★☆☆", tip: "Contacte leur service client et joint la vidéo. Elle renforce ton dossier mais ne remplace pas leur processus d'authentification." },
            { name: "Grailed", color: "#991B1B", bg: "#FEE2E2", score: "★★★☆", tip: "Ouvre un ticket support et joint la vidéo. Grailed est réactif sur les litiges avec preuves." },
            { name: "Depop", color: "#333333", bg: "#F3F4F6", score: "★★★☆", tip: "Litige → 'Provide evidence' → joint la vidéo. Depop accepte les preuves externes." },
            { name: "Etsy", color: "#D97706", bg: "#FFFBEB", score: "★★★★", tip: "Centre de résolution → 'Submit evidence' → upload. Etsy prend les preuves externes très au sérieux." },
          ].map((pl, i) => (
            <div key={pl.name} style={{ padding: "10px 0", borderBottom: i < 7 ? "1px solid #F9FAFB" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: pl.bg, color: pl.color }}>{pl.name}</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>{pl.score}</span>
              </div>
              <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5, margin: 0 }}>{pl.tip}</p>
            </div>
          ))}
        </div>
        <button onClick={reset} style={btn("#111", "#fff", false)}>Protéger un autre envoi</button>
      </Layout>
    </>
  );

  return (
    <>
      <Head><title>SellGuard — Protéger mon envoi</title></Head>
      <Layout>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>🛡️ Protéger mon envoi</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>Enregistre une vidéo avec horodatage automatique — preuve solide en cas de litige Vinted.</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[["video", "🎥 Vidéo", "Recommandé"], ["photos", "📷 Photos", ""]].map(([m, label, tag]) => (
            <button key={m} onClick={() => { setMode(m); if (m === "photos") stopCamera(); }}
              style={{ flex: 1, padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: mode === m ? "2px solid #111" : "1px solid #E5E7EB", background: mode === m ? "#111" : "#fff", color: mode === m ? "#fff" : "#555", cursor: "pointer", fontFamily: "inherit" }}>
              {label} {tag && <span style={{ fontSize: 10, marginLeft: 4, padding: "2px 6px", background: "#16A34A", color: "#fff", borderRadius: 10 }}>{tag}</span>}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Nom de l'article *</label>
          <input value={articleName} onChange={e => setArticleName(e.target.value)} placeholder="Ex: Levi's Trucker Jacket Type 2 - Taille M" style={inp} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Référence commande <span style={{ fontWeight: 400, color: "#999" }}>(optionnel)</span></label>
          <input value={orderRef} onChange={e => setOrderRef(e.target.value)} placeholder="Ex: Vinted #4829301" style={inp} />
        </div>

        {mode === "video" && (
          <>
            <div style={{ marginBottom: 16, borderRadius: 14, overflow: "hidden", background: "#111", position: "relative", minHeight: 220 }}>
              <video ref={videoRef} muted playsInline style={{ width: "100%", display: cameraOn && !recordedUrl ? "block" : "none", maxHeight: 300, objectFit: "cover" }} />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              {recordedUrl && <video src={recordedUrl} controls style={{ width: "100%", maxHeight: 300 }} />}
              {!cameraOn && !recordedUrl && (
                <div style={{ minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{ fontSize: 40 }}>🎥</div>
                  <p style={{ fontSize: 13, color: "#888", textAlign: "center" }}>Date & heure SellGuard incrustées automatiquement</p>
                </div>
              )}
              {recording && (
                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3B30" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{fmt(elapsed)}</span>
                </div>
              )}
            </div>

            {cameraError && <div style={{ marginBottom: 14, padding: 12, background: "#FEF2F2", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{cameraError}</div>}

            {!recordedUrl ? (
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {!cameraOn
                  ? <button onClick={startCamera} style={btn("#111", "#fff", false)}>Activer la caméra →</button>
                  : !recording
                    ? <>
                        <button onClick={startRecording} disabled={!articleName.trim()} style={{ ...btn("#DC2626", "#fff", !articleName.trim()), flex: 2 }}>⏺ Démarrer</button>
                        <button onClick={stopCamera} style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
                      </>
                    : <button onClick={stopRecording} style={btn("#111", "#fff", false)}>⏹ Arrêter — {fmt(elapsed)}</button>
                }
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button onClick={downloadVideo} style={{ ...btn("#16A34A", "#fff", false), flex: 2 }}>⬇️ Télécharger la preuve vidéo</button>
                <button onClick={() => { setRecordedBlob(null); setRecordedUrl(null); setElapsed(0); startCamera(); }}
                  style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>Refaire</button>
              </div>
            )}

            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px" }}>
              <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                <strong>Conseils :</strong> Filme l'article, l'étiquette, puis le colis emballé avec le bon de livraison visible. 30 secondes suffisent.
              </p>
            </div>
          </>
        )}

        {mode === "photos" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Photos *</label>
              <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #D1D5DB", borderRadius: 14, padding: 20, cursor: "pointer", background: "#fff", textAlign: "center", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: 14, color: "#888" }}>+ Ajouter des photos</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
                  {photos.map((p, i) => <img key={i} src={p.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB" }} />)}
                </div>
              )}
            </div>
            <button onClick={certifyPhotos} disabled={!photos.length || !articleName.trim()} style={btn("#111", "#fff", !photos.length || !articleName.trim())}>
              Générer le certificat →
            </button>
          </>
        )}
      </Layout>
    </>
  );
}
