import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";

export default function Protection() {
  const { t, lang } = useLang();
  const p = t.protection;

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
  const [timestamp, setTimestamp] = useState("");

  const videoRef = useRef();
  const streamRef = useRef();
  const mediaRecorderRef = useRef();
  const chunksRef = useRef([]);
  const timerRef = useRef();
  const tsTimerRef = useRef();
  const fileRef = useRef();

  // Detect iOS
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Update timestamp every second for overlay display
  useEffect(() => {
    tsTimerRef.current = setInterval(() => {
      setTimestamp(new Date().toLocaleString("fr-FR"));
    }, 1000);
    return () => clearInterval(tsTimerRef.current);
  }, []);

  async function startCamera() {
    try {
      setCameraError(null);
      const constraints = { video: { facingMode: "environment" }, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraOn(true);
    } catch (e) {
      setCameraError(lang === "en"
        ? "Cannot access camera. Please allow camera access in your browser settings."
        : "Impossible d'accéder à la caméra. Autorise l'accès dans les paramètres de ton navigateur.");
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraOn(false); setRecording(false);
    clearInterval(timerRef.current);
  }

  function getSupportedMimeType() {
    const types = [
      "video/mp4;codecs=avc1",
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "";
  }

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];

    const mimeType = getSupportedMimeType();
    const options = mimeType ? { mimeType } : {};

    try {
      const mr = new MediaRecorder(streamRef.current, options);
      mr.ondataavailable = e => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const mime = mimeType || "video/mp4";
        const blob = new Blob(chunksRef.current, { type: mime });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
      };
      mr.start(100);
      mediaRecorderRef.current = mr;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } catch(e) {
      setCameraError(lang === "en" ? "Recording not supported on this browser." : "Enregistrement non supporté sur ce navigateur.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    clearInterval(timerRef.current);
  }

  function downloadVideo() {
    if (!recordedBlob) return;
    const certId = "SG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const name = (articleName || "envoi").replace(/\s+/g, "_");
    const ext = recordedBlob.type.includes("mp4") ? "mp4" : "webm";
    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = `SellGuard_${certId}_${name}.${ext}`;
    a.click();
    setCertified({ id: certId, article: articleName || "Article", date: new Date().toLocaleString("fr-FR") });
  }

  function handleFiles(files) {
    setPhotos(prev => [...prev, ...Array.from(files).map(f => ({ url: URL.createObjectURL(f) }))]);
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

  useEffect(() => () => { stopCamera(); clearInterval(tsTimerRef.current); }, []);

  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };
  const btn = (bg, col, dis) => ({ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: dis ? "#E5E7EB" : bg, color: dis ? "#999" : col, cursor: dis ? "default" : "pointer", fontFamily: "inherit" });

  const PLATFORM_GUIDE = [
    { name: "Vinted", color: "#09B1BA", bg: "#E6F9FA", score: "★★★☆", tip: lang === "en" ? "Dispute → 'Add proof' → upload video. Most fraudulent buyers back down when they see dated proof." : "Litige → 'Ajouter des preuves' → upload la vidéo. La plupart des acheteurs frauduleux abandonnent dès qu'ils voient une preuve datée." },
    { name: "Depop", color: "#FF0000", bg: "#FFF0F0", score: "★★★☆", tip: lang === "en" ? "Dispute → 'Provide evidence' → attach the video. Depop accepts external proof." : "Litige → 'Provide evidence' → joint la vidéo. Depop accepte les preuves externes." },
    { name: "Grailed", color: "#000000", bg: "#F5F5F5", score: "★★★☆", tip: lang === "en" ? "Open a support ticket and attach the video. Grailed responds quickly to disputes with proof." : "Ouvre un ticket support et joint la vidéo. Grailed est réactif sur les litiges avec preuves." },
    { name: "Vestiaire Collective", color: "#1A1A1A", bg: "#F5F0EB", score: "★★☆☆", tip: lang === "en" ? "Contact their customer service and attach the video." : "Contacte leur service client et joint la vidéo." },
    { name: "Etsy", color: "#F1641E", bg: "#FFF3EE", score: "★★★★", tip: lang === "en" ? "Resolution center → 'Submit evidence' → upload. Etsy takes external proof very seriously." : "Centre de résolution → 'Submit evidence' → upload. Etsy prend les preuves externes très au sérieux." },
  ];

  if (certified) return (
    <>
      <Head><title>SellGuard — {p.certified_title}</title></Head>
      <Layout>
        <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#15803D", marginBottom: 6 }}>{p.certified_title}</h3>
          <p style={{ fontSize: 14, color: "#166534", lineHeight: 1.6 }}>{p.certified_sub}</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
          {[["Numéro", certified.id], [p.article_label, certified.article], ["Date & heure", certified.date], ["Type", lang === "en" ? "SellGuard timestamped video" : "Vidéo horodatée SellGuard"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
              <span style={{ fontSize: 13, color: "#888" }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111", textAlign: "right", marginLeft: 16 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 14 }}>{p.guide_title}</p>
          {PLATFORM_GUIDE.map((pl, i) => (
            <div key={pl.name} style={{ padding: "10px 0", borderBottom: i < PLATFORM_GUIDE.length - 1 ? "1px solid #F9FAFB" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: pl.bg, color: pl.color }}>{pl.name}</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>{pl.score}</span>
              </div>
              <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5, margin: 0 }}>{pl.tip}</p>
            </div>
          ))}
        </div>
        <button onClick={reset} style={btn("#111", "#fff", false)}>{p.new_btn}</button>
      </Layout>
    </>
  );

  return (
    <>
      <Head><title>SellGuard — {p.title}</title></Head>
      <Layout>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>🛡️ {p.title}</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{p.subtitle}</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[["video", p.video_tab, p.recommended], ["photos", p.photo_tab, ""]].map(([m, label, tag]) => (
            <button key={m} onClick={() => { setMode(m); if (m === "photos") stopCamera(); }}
              style={{ flex: 1, padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: mode === m ? "2px solid #111" : "1px solid #E5E7EB", background: mode === m ? "#111" : "#fff", color: mode === m ? "#fff" : "#555", cursor: "pointer", fontFamily: "inherit" }}>
              {label} {tag && <span style={{ fontSize: 10, marginLeft: 4, padding: "2px 6px", background: "#16A34A", color: "#fff", borderRadius: 10 }}>{tag}</span>}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{p.article_label} *</label>
          <input value={articleName} onChange={e => setArticleName(e.target.value)} placeholder={p.article_ph} style={inp} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{p.ref_label} <span style={{ fontWeight: 400, color: "#999" }}>({p.optional})</span></label>
          <input value={orderRef} onChange={e => setOrderRef(e.target.value)} placeholder={p.ref_ph} style={inp} />
        </div>

        {mode === "video" && (
          <>
            {/* iOS warning */}
            {isIOS && !cameraOn && !recordedUrl && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
                  {lang === "en"
                    ? "📱 On iPhone, use Safari for best compatibility. The video will be saved directly to your phone."
                    : "📱 Sur iPhone, utilise Safari pour une meilleure compatibilité. La vidéo sera sauvegardée directement sur ton téléphone."}
                </p>
              </div>
            )}

            <div style={{ marginBottom: 16, borderRadius: 14, overflow: "hidden", background: "#111", position: "relative", minHeight: 220 }}>
              <video ref={videoRef} muted playsInline style={{ width: "100%", display: cameraOn && !recordedUrl ? "block" : "none", maxHeight: 340, objectFit: "cover" }} />

              {/* Timestamp overlay on video */}
              {cameraOn && !recordedUrl && (
                <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "4px 12px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 12, color: "#00FF88", fontFamily: "monospace", fontWeight: 700 }}>SellGuard · {timestamp}</span>
                </div>
              )}

              {recordedUrl && <video src={recordedUrl} controls playsInline style={{ width: "100%", maxHeight: 340 }} />}

              {!cameraOn && !recordedUrl && (
                <div style={{ minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{ fontSize: 40 }}>🎥</div>
                  <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: "0 20px" }}>
                    {lang === "en" ? "Timestamp automatically embedded in video" : "Date & heure SellGuard incrustées automatiquement"}
                  </p>
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
                  ? <button onClick={startCamera} disabled={!articleName.trim()} style={btn("#111", "#fff", !articleName.trim())}>{p.activate}</button>
                  : !recording
                    ? <>
                        <button onClick={startRecording} style={{ ...btn("#DC2626", "#fff", false), flex: 2 }}>{p.start}</button>
                        <button onClick={stopCamera} style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>{p.cancel}</button>
                      </>
                    : <button onClick={stopRecording} style={btn("#111", "#fff", false)}>{p.stop} — {fmt(elapsed)}</button>
                }
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button onClick={downloadVideo} style={{ ...btn("#16A34A", "#fff", false), flex: 2 }}>{p.download}</button>
                <button onClick={() => { setRecordedBlob(null); setRecordedUrl(null); setElapsed(0); startCamera(); }}
                  style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>{p.redo}</button>
              </div>
            )}

            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px" }}>
              <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}><strong>{p.tips_title} :</strong> {p.tips}</p>
            </div>
          </>
        )}

        {mode === "photos" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #D1D5DB", borderRadius: 14, padding: 20, cursor: "pointer", background: "#fff", textAlign: "center", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: 14, color: "#888" }}>+ {lang === "en" ? "Add photos" : "Ajouter des photos"}</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
                  {photos.map((ph, i) => <img key={i} src={ph.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB" }} />)}
                </div>
              )}
            </div>
            <button onClick={certifyPhotos} disabled={!photos.length || !articleName.trim()} style={btn("#111", "#fff", !photos.length || !articleName.trim())}>
              {lang === "en" ? "Generate certificate →" : "Générer le certificat →"}
            </button>
          </>
        )}
      </Layout>
    </>
  );
}
