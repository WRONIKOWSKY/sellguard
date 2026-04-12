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
  const [processing, setProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const videoRef = useRef();
  const streamRef = useRef();
  const mediaRecorderRef = useRef();
  const chunksRef = useRef([]);
  const timerRef = useRef();
  const tsTimerRef = useRef();
  const fileRef = useRef();
  const ffmpegRef = useRef(null);
  const ffmpegLoadedRef = useRef(false);

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    tsTimerRef.current = setInterval(() => {
      setTimestamp(new Date().toLocaleString("fr-FR"));
    }, 1000);
    return () => clearInterval(tsTimerRef.current);
  }, []);

  async function loadFFmpeg() {
    if (ffmpegLoadedRef.current) return ffmpegRef.current;
    setProcessProgress(lang === "en" ? "Loading video processor (first time only)..." : "Chargement du processeur vidéo (première fois uniquement)...");
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress }) => {
        setProcessProgress(lang === "en" ? `Processing video... ${Math.round(progress * 100)}%` : `Traitement vidéo... ${Math.round(progress * 100)}%`);
      });
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = { ffmpeg, fetchFile };
      ffmpegLoadedRef.current = true;
      return ffmpegRef.current;
    } catch(e) {
      console.error("FFmpeg load error:", e);
      return null;
    }
  }

  async function embedTimestamp(blob, dateStr) {
    const { ffmpeg, fetchFile } = await loadFFmpeg() || {};
    if (!ffmpeg) return blob; // fallback: return original

    try {
      setProcessing(true);
      const inputName = "input.mp4";
      const outputName = "output.mp4";
      ffmpeg.writeFile(inputName, await fetchFile(blob));

      // Embed timestamp as text overlay using drawtext filter
      const text = `SellGuard · ${dateStr}`;
      const escapedText = text.replace(/'/g, "\\'").replace(/:/g, "\\:");
      await ffmpeg.exec([
        "-i", inputName,
        "-vf", `drawtext=text='${escapedText}':fontsize=24:fontcolor=white:x=(w-text_w)/2:y=h/2-text_h/2:box=1:boxcolor=black@0.4:boxborderw=8`,
        "-c:a", "copy",
        "-preset", "ultrafast",
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const outputBlob = new Blob([data.buffer], { type: "video/mp4" });
      ffmpeg.deleteFile(inputName);
      ffmpeg.deleteFile(outputName);
      setProcessing(false);
      setProcessProgress("");
      return outputBlob;
    } catch(e) {
      console.error("FFmpeg process error:", e);
      setProcessing(false);
      setProcessProgress("");
      return blob; // fallback
    }
  }

  async function startCamera() {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraOn(true);
      // Preload ffmpeg in background
      loadFFmpeg().catch(() => {});
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
    const types = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8,opus", "video/webm"];
    for (const type of types) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
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
      mr.onstop = async () => {
        const mime = mimeType || "video/mp4";
        const rawBlob = new Blob(chunksRef.current, { type: mime });
        const dateStr = new Date().toLocaleString("fr-FR");
        setProcessProgress(lang === "en" ? "Embedding timestamp..." : "Incrustation de l'horodatage...");
        setProcessing(true);
        const finalBlob = await embedTimestamp(rawBlob, dateStr);
        setRecordedBlob(finalBlob);
        setRecordedUrl(URL.createObjectURL(finalBlob));
        setProcessing(false);
        setProcessProgress("");
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
    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = `SellGuard_${certId}_${name}.mp4`;
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
    setProcessing(false); setProcessProgress("");
  }

  function fmt(s) { return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }

  useEffect(() => () => { stopCamera(); clearInterval(tsTimerRef.current); }, []);

  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };
  const btn = (bg, col, dis) => ({ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: dis ? "#E5E7EB" : bg, color: dis ? "#999" : col, cursor: dis ? "default" : "pointer", fontFamily: "inherit" });

  const PLATFORM_GUIDE = [
    { name: "Vinted", color: "#09B1BA", bg: "#E6F9FA", score: "★★★☆", tip: lang === "en" ? "Dispute → 'Add proof' → upload video." : "Litige → 'Ajouter des preuves' → upload la vidéo." },
    { name: "Depop", color: "#FF0000", bg: "#FFF0F0", score: "★★★☆", tip: lang === "en" ? "Dispute → 'Provide evidence' → attach video." : "Litige → 'Provide evidence' → joint la vidéo." },
    { name: "Grailed", color: "#000000", bg: "#F5F5F5", score: "★★★☆", tip: lang === "en" ? "Open support ticket and attach video." : "Ouvre un ticket support et joint la vidéo." },
    { name: "Vestiaire Collective", color: "#1A1A1A", bg: "#F5F0EB", score: "★★☆☆", tip: lang === "en" ? "Contact customer service and attach video." : "Contacte leur service client et joint la vidéo." },
    { name: "Etsy", color: "#F1641E", bg: "#FFF3EE", score: "★★★★", tip: lang === "en" ? "Resolution center → 'Submit evidence' → upload." : "Centre de résolution → 'Submit evidence' → upload." },
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
            <div style={{ marginBottom: 16, borderRadius: 14, overflow: "hidden", background: "#111", position: "relative", minHeight: 220 }}>
              <video ref={videoRef} muted playsInline style={{ width: "100%", display: cameraOn && !recordedUrl ? "block" : "none", maxHeight: 340, objectFit: "cover" }} />

              {cameraOn && !recordedUrl && (
                <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "4px 12px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 12, color: "#00FF88", fontFamily: "monospace", fontWeight: 700 }}>SellGuard · {timestamp}</span>
                </div>
              )}

              {processing && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, border: "3px solid #333", borderTop: "3px solid #00FF88", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ fontSize: 13, color: "#fff", textAlign: "center", padding: "0 20px" }}>{processProgress}</p>
                </div>
              )}

              {recordedUrl && !processing && <video src={recordedUrl} controls playsInline style={{ width: "100%", maxHeight: 340 }} />}

              {!cameraOn && !recordedUrl && (
                <div style={{ minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{ fontSize: 40 }}>🎥</div>
                  <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: "0 20px" }}>
                    {lang === "en" ? "Timestamp permanently embedded in video file" : "Horodatage gravé définitivement dans le fichier vidéo"}
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

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {cameraError && <div style={{ marginBottom: 14, padding: 12, background: "#FEF2F2", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{cameraError}</div>}

            {!recordedUrl && !processing ? (
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
            ) : recordedUrl && !processing ? (
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button onClick={downloadVideo} style={{ ...btn("#16A34A", "#fff", false), flex: 2 }}>{p.download}</button>
                <button onClick={() => { setRecordedBlob(null); setRecordedUrl(null); setElapsed(0); startCamera(); }}
                  style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>{p.redo}</button>
              </div>
            ) : (
              <div style={{ marginBottom: 20, padding: 14, background: "#F9FAFB", borderRadius: 12, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#666" }}>{processProgress}</p>
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
