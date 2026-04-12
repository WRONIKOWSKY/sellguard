import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";

function loadShipments() {
  try { return JSON.parse(localStorage.getItem("sg_shipments") || "[]"); } catch(e) { return []; }
}
function saveShipments(list) {
  try { localStorage.setItem("sg_shipments", JSON.stringify(list)); } catch(e) {}
}

export default function Protection() {
  var ref = useLang(), t = ref.t, lang = ref.lang;
  var p = t.protection;

  var _tab = useState("certify"), tab = _tab[0], setTab = _tab[1];
  var _mode = useState("video"), mode = _mode[0], setMode = _mode[1];
  var _articleName = useState(""), articleName = _articleName[0], setArticleName = _articleName[1];
  var _orderRef = useState(""), orderRef = _orderRef[0], setOrderRef = _orderRef[1];
  var _photos = useState([]), photos = _photos[0], setPhotos = _photos[1];
  var _certified = useState(null), certified = _certified[0], setCertified = _certified[1];
  var _recording = useState(false), recording = _recording[0], setRecording = _recording[1];
  var _recordedBlob = useState(null), recordedBlob = _recordedBlob[0], setRecordedBlob = _recordedBlob[1];
  var _recordedUrl = useState(null), recordedUrl = _recordedUrl[0], setRecordedUrl = _recordedUrl[1];
  var _elapsed = useState(0), elapsed = _elapsed[0], setElapsed = _elapsed[1];
  var _cameraOn = useState(false), cameraOn = _cameraOn[0], setCameraOn = _cameraOn[1];
  var _cameraError = useState(null), cameraError = _cameraError[0], setCameraError = _cameraError[1];
  var _processing = useState(false), processing = _processing[0], setProcessing = _processing[1];
  var _timestamp = useState(""), timestamp = _timestamp[0], setTimestamp = _timestamp[1];
  var _recordDate = useState(""), recordDate = _recordDate[0], setRecordDate = _recordDate[1];
  var _certData = useState(null), certData = _certData[0], setCertData = _certData[1];
  var _shipments = useState([]), shipments = _shipments[0], setShipments = _shipments[1];
  var _editingId = useState(null), editingId = _editingId[0], setEditingId = _editingId[1];
  var _trackingNum = useState(""), trackingNum = _trackingNum[0], setTrackingNum = _trackingNum[1];
  var _receiptPhoto = useState(null), receiptPhoto = _receiptPhoto[0], setReceiptPhoto = _receiptPhoto[1];

  var videoRef = useRef();
  var streamRef = useRef();
  var mediaRecorderRef = useRef();
  var chunksRef = useRef([]);
  var timerRef = useRef();
  var tsTimerRef = useRef();
  var fileRef = useRef();
  var receiptRef = useRef();

  useEffect(function() {
    setShipments(loadShipments());
    tsTimerRef.current = setInterval(function() {
      setTimestamp(new Date().toLocaleString("fr-FR"));
    }, 1000);
    return function() { clearInterval(tsTimerRef.current); };
  }, []);

  function addShipment(data) {
    var updated = [data].concat(loadShipments());
    saveShipments(updated);
    setShipments(updated);
  }

  function updateShipment(certId, tracking, receipt) {
    var list = loadShipments();
    var updated = list.map(function(s) {
      if (s.id === certId) {
        return Object.assign({}, s, { tracking_number: tracking || s.tracking_number, receipt_photo: receipt || s.receipt_photo, tracking_date: new Date().toLocaleString("fr-FR") });
      }
      return s;
    });
    saveShipments(updated);
    setShipments(updated);
    setEditingId(null);
    setTrackingNum("");
    setReceiptPhoto(null);
  }

  function deleteShipment(certId) {
    var list = loadShipments().filter(function(s) { return s.id !== certId; });
    saveShipments(list);
    setShipments(list);
  }

  async function computeHash(blob) {
    try {
      var buffer = await blob.arrayBuffer();
      var hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(function(b) { return b.toString(16).padStart(2, "0"); }).join("").substring(0, 32).toUpperCase();
    } catch(e) {
      return "HASH-" + Math.random().toString(36).substr(2, 16).toUpperCase();
    }
  }

  function getDeviceInfo() {
    var ua = navigator.userAgent;
    if (/iPhone/.test(ua)) return "iPhone / Safari iOS";
    if (/iPad/.test(ua)) return "iPad / Safari iOS";
    if (/Android/.test(ua)) return "Android";
    return "Desktop";
  }

  async function startCamera() {
    try {
      setCameraError(null);
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraOn(true);
    } catch (e) {
      setCameraError(lang === "en"
        ? "Cannot access camera. Please allow access in your browser settings."
        : "Impossible d'accéder à la caméra. Autorise l'accès dans les paramètres de ton navigateur.");
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(function(t) { t.stop(); }); streamRef.current = null; }
    setCameraOn(false); setRecording(false);
    clearInterval(timerRef.current);
  }

  function getSupportedMimeType() {
    var types = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8,opus", "video/webm"];
    for (var i = 0; i < types.length; i++) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(types[i])) return types[i];
    }
    return "";
  }

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    var mimeType = getSupportedMimeType();
    var options = mimeType ? { mimeType: mimeType } : {};
    try {
      var mr = new MediaRecorder(streamRef.current, options);
      mr.ondataavailable = function(e) { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = function() {
        var mime = mimeType || "video/mp4";
        var blob = new Blob(chunksRef.current, { type: mime });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        setRecordDate(new Date().toLocaleString("fr-FR"));
      };
      mr.start(100);
      mediaRecorderRef.current = mr;
      setRecording(true); setElapsed(0);
      timerRef.current = setInterval(function() { setElapsed(function(e) { return e + 1; }); }, 1000);
    } catch(e) {
      setCameraError(lang === "en" ? "Recording not supported on this browser." : "Enregistrement non supporté sur ce navigateur.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false); clearInterval(timerRef.current);
  }

  async function shareFile(blob, filename) {
    if (navigator.share && navigator.canShare) {
      var file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: filename }); return true; }
        catch(e) { if (e.name !== "AbortError") console.error(e); }
      }
    }
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    return true;
  }

  async function downloadVideo() {
    if (!recordedBlob) return;
    var id = "SG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    var dateStr = recordDate || new Date().toLocaleString("fr-FR");
    var name = (articleName || "envoi").replace(/[^a-zA-Z0-9]/g, "_");
    var ext = recordedBlob.type.includes("mp4") ? "mp4" : "webm";
    var hash = await computeHash(recordedBlob);
    var videoSizeKB = Math.round(recordedBlob.size / 1024);
    setCertData({ id: id, dateStr: dateStr, hash: hash, videoSizeKB: videoSizeKB });
    await shareFile(recordedBlob, "SellGuard_" + id + "_" + name + "." + ext);
  }

  async function downloadPDF() {
    if (!certData && !recordedBlob) return;
    setProcessing(true);
    var id = certData ? certData.id : "SG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    var dateStr = certData ? certData.dateStr : recordDate || new Date().toLocaleString("fr-FR");
    var hash = certData ? certData.hash : await computeHash(recordedBlob);
    var videoSizeKB = certData ? certData.videoSizeKB : (recordedBlob ? Math.round(recordedBlob.size / 1024) : 0);
    try {
      var params = new URLSearchParams({ certId: id, article: articleName || "", orderRef: orderRef || "", dateStr: dateStr, hash: hash, videoSizeKB: videoSizeKB, deviceInfo: getDeviceInfo(), lang: lang });
      var res = await fetch("/api/certificat?" + params.toString());
      var blob = await res.blob();
      await shareFile(blob, "SellGuard_" + id + "_Certificat.pdf");
      var certInfo = { id: id, article: articleName || "Article", date: dateStr, hash: hash, orderRef: orderRef || "" };
      setCertified(certInfo);
      addShipment({ id: id, article: articleName || "Article", date: dateStr, hash: hash, orderRef: orderRef || "", tracking_number: "", receipt_photo: "", tracking_date: "" });
    } catch(e) { console.error(e); }
    setProcessing(false);
  }

  function handleFiles(files) {
    setPhotos(function(prev) { return prev.concat(Array.from(files).map(function(f) { return { url: URL.createObjectURL(f) }; })); });
  }

  function certifyPhotos() {
    if (!photos.length || !articleName.trim()) return;
    var certInfo = { id: "SG-" + Math.random().toString(36).substr(2, 9).toUpperCase(), article: articleName, date: new Date().toLocaleString("fr-FR"), photos: photos };
    setCertified(certInfo);
    addShipment({ id: certInfo.id, article: articleName, date: certInfo.date, hash: "", orderRef: orderRef || "", tracking_number: "", receipt_photo: "", tracking_date: "" });
  }

  function handleReceiptPhoto(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) { setReceiptPhoto(ev.target.result); };
    reader.readAsDataURL(file);
  }

  function reset() {
    stopCamera(); setRecordedBlob(null); setRecordedUrl(null); setPhotos([]);
    setArticleName(""); setOrderRef(""); setCertified(null); setElapsed(0);
    setProcessing(false); setRecordDate(""); setCertData(null);
  }

  function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }

  useEffect(function() { return function() { stopCamera(); clearInterval(tsTimerRef.current); }; }, []);

  var inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111", boxSizing: "border-box" };
  var btnStyle = function(bg, col, dis) { return { width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: dis ? "#E5E7EB" : bg, color: dis ? "#999" : col, cursor: dis ? "default" : "pointer", fontFamily: "inherit" }; };

  var PLATFORM_GUIDE = [
    { name: "Vinted", color: "#09B1BA", bg: "#E6F9FA", score: "★★★☆", tip: lang === "en" ? "Dispute → 'Add proof' → upload video + PDF certificate." : "Litige → 'Ajouter des preuves' → upload la vidéo + le certificat PDF." },
    { name: "Depop", color: "#FF0000", bg: "#FFF0F0", score: "★★★☆", tip: lang === "en" ? "Dispute → 'Provide evidence' → attach both files." : "Litige → 'Provide evidence' → joint les deux fichiers." },
    { name: "Grailed", color: "#000000", bg: "#F5F5F5", score: "★★★☆", tip: lang === "en" ? "Open support ticket, attach video + certificate PDF." : "Ouvre un ticket support, joint la vidéo + le certificat PDF." },
    { name: "Vestiaire Collective", color: "#1A1A1A", bg: "#F5F0EB", score: "★★★☆", tip: lang === "en" ? "Contact customer service with both files attached." : "Contacte leur service client avec les deux fichiers en pièce jointe." },
    { name: "Etsy", color: "#F1641E", bg: "#FFF3EE", score: "★★★★", tip: lang === "en" ? "Resolution center → 'Submit evidence' → upload both files." : "Centre de résolution → 'Submit evidence' → upload les deux fichiers." },
  ];

  // ── CERTIFIED VIEW ──
  if (certified) return (
    <>
      <Head><title>SellGuard — {p.certified_title}</title></Head>
      <Layout>
        <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{"✅"}</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#15803D", marginBottom: 6 }}>{p.certified_title}</h3>
          <p style={{ fontSize: 14, color: "#166534", lineHeight: 1.6 }}>{p.certified_sub}</p>
        </div>

        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.6, fontWeight: 600, marginBottom: 6 }}>
            {lang === "en" ? "📄 2 files downloaded:" : "📄 2 fichiers téléchargés :"}
          </p>
          <p style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {lang === "en"
              ? "• Video file (.mp4 / .webm)\n• SellGuard certificate PDF with SHA-256 hash\n\nKeep both files together. They form your complete proof."
              : "• Fichier vidéo (.mp4 / .webm)\n• Certificat PDF SellGuard avec empreinte SHA-256\n\nConserve les deux fichiers ensemble. Ils constituent ta preuve complète."}
          </p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
          {[
            [lang === "en" ? "Number" : "Numéro", certified.id],
            [lang === "en" ? "Item" : "Article", certified.article],
            ["Date & heure", certified.date],
            ["SHA-256", certified.hash ? certified.hash.substring(0, 16) + "..." : "—"],
          ].map(function(row) {
            return (
              <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
                <span style={{ fontSize: 13, color: "#888" }}>{row[0]}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111", textAlign: "right", marginLeft: 16, fontFamily: row[0] === "SHA-256" ? "monospace" : "inherit" }}>{row[1]}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
            {lang === "en"
              ? "📦 You can add your tracking number and deposit receipt later from the \"My shipments\" tab."
              : "📦 Tu pourras ajouter ton numéro de suivi et ta preuve de dépôt plus tard depuis l'onglet \"Mes envois\"."}
          </p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 14 }}>{p.guide_title}</p>
          {PLATFORM_GUIDE.map(function(pl, i) {
            return (
              <div key={pl.name} style={{ padding: "10px 0", borderBottom: i < PLATFORM_GUIDE.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: pl.bg, color: pl.color }}>{pl.name}</span>
                  <span style={{ fontSize: 11, color: "#aaa" }}>{pl.score}</span>
                </div>
                <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5, margin: 0 }}>{pl.tip}</p>
              </div>
            );
          })}
        </div>
        <button onClick={reset} style={btnStyle("#111", "#fff", false)}>{p.new_btn}</button>
      </Layout>
    </>
  );

  // ── MAIN VIEW ──
  return (
    <>
      <Head><title>SellGuard — {p.title}</title></Head>
      <Layout>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>{"🛡"} {p.title}</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{p.subtitle}</p>
        </div>

        {/* ── TOP TABS: Certify / My shipments ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "#F3F4F6", borderRadius: 12, padding: 4 }}>
          {[
            ["certify", lang === "en" ? "🛡 Certify" : "🛡 Certifier"],
            ["shipments", lang === "en" ? "📦 My shipments" : "📦 Mes envois"]
          ].map(function(item) {
            var hasCount = item[0] === "shipments" && shipments.length > 0;
            return (
              <button key={item[0]} onClick={function() { setTab(item[0]); if (item[0] === "shipments") setShipments(loadShipments()); }}
                style={{ flex: 1, padding: "10px 12px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "none",
                  background: tab === item[0] ? "#fff" : "transparent", color: tab === item[0] ? "#111" : "#888",
                  cursor: "pointer", fontFamily: "inherit", boxShadow: tab === item[0] ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                {item[1]} {hasCount ? " (" + shipments.length + ")" : ""}
              </button>
            );
          })}
        </div>

        {/* ── TAB: MY SHIPMENTS ── */}
        {tab === "shipments" && (
          <div>
            {shipments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{"📦"}</div>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{lang === "en" ? "No shipments yet" : "Aucun envoi certifié"}</p>
                <p style={{ fontSize: 13 }}>{lang === "en" ? "Certify a shipment to see it here." : "Certifie un envoi pour le voir ici."}</p>
              </div>
            ) : (
              shipments.map(function(s) {
                var isEditing = editingId === s.id;
                var hasTracking = s.tracking_number || s.receipt_photo;
                return (
                  <div key={s.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 18px", marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>{s.article}</p>
                        <p style={{ fontSize: 12, color: "#888" }}>{s.date}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: hasTracking ? "#F0FDF4" : "#FFF7ED", color: hasTracking ? "#16A34A" : "#D97706" }}>
                        {hasTracking ? (lang === "en" ? "Complete" : "Complet") : (lang === "en" ? "No tracking" : "Sans suivi")}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                      <span style={{ fontFamily: "monospace", background: "#F3F4F6", padding: "2px 8px", borderRadius: 6 }}>{s.id}</span>
                      {s.orderRef ? <span style={{ marginLeft: 8 }}>{lang === "en" ? "Ref:" : "Réf:"} {s.orderRef}</span> : null}
                    </div>

                    {hasTracking && !isEditing && (
                      <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                        {s.tracking_number && (
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: s.receipt_photo ? 6 : 0 }}>
                            <span style={{ fontSize: 12, color: "#666" }}>{lang === "en" ? "Tracking" : "Suivi"}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#111", fontFamily: "monospace" }}>{s.tracking_number}</span>
                          </div>
                        )}
                        {s.receipt_photo && (
                          <div style={{ marginTop: 6 }}>
                            <span style={{ fontSize: 12, color: "#666" }}>{lang === "en" ? "Deposit receipt" : "Preuve de dépôt"} {"✅"}</span>
                          </div>
                        )}
                        {s.tracking_date && <p style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{lang === "en" ? "Added" : "Ajouté"} {s.tracking_date}</p>}
                      </div>
                    )}

                    {isEditing && (
                      <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>
                          {lang === "en" ? "Tracking number" : "Numéro de suivi"}
                        </label>
                        <input
                          value={trackingNum}
                          onChange={function(e) { setTrackingNum(e.target.value); }}
                          placeholder={lang === "en" ? "Ex: 8R12345678901" : "Ex: 8R12345678901"}
                          style={Object.assign({}, inp, { marginBottom: 12 })}
                        />

                        <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>
                          {lang === "en" ? "Deposit receipt photo" : "Photo preuve de dépôt"} <span style={{ fontWeight: 400, color: "#999" }}>({p.optional})</span>
                        </label>
                        <div
                          onClick={function() { receiptRef.current && receiptRef.current.click(); }}
                          style={{ border: "2px dashed #D1D5DB", borderRadius: 10, padding: 14, cursor: "pointer", background: "#fff", textAlign: "center", marginBottom: 12 }}>
                          {receiptPhoto
                            ? <img src={receiptPhoto} style={{ maxWidth: "100%", maxHeight: 120, borderRadius: 8 }} />
                            : <p style={{ fontSize: 13, color: "#888" }}>+ {lang === "en" ? "Add photo" : "Ajouter la photo"}</p>
                          }
                        </div>
                        <input ref={receiptRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleReceiptPhoto} />

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={function() { updateShipment(s.id, trackingNum, receiptPhoto); }}
                            disabled={!trackingNum.trim() && !receiptPhoto}
                            style={Object.assign({}, btnStyle("#16A34A", "#fff", !trackingNum.trim() && !receiptPhoto), { flex: 2 })}>
                            {lang === "en" ? "Save" : "Enregistrer"}
                          </button>
                          <button
                            onClick={function() { setEditingId(null); setTrackingNum(""); setReceiptPhoto(null); }}
                            style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>
                            {lang === "en" ? "Cancel" : "Annuler"}
                          </button>
                        </div>
                      </div>
                    )}

                    {!isEditing && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={function() { setEditingId(s.id); setTrackingNum(s.tracking_number || ""); setReceiptPhoto(s.receipt_photo || null); }}
                          style={{ flex: 1, padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: hasTracking ? "#555" : "#2563EB", cursor: "pointer", fontFamily: "inherit" }}>
                          {hasTracking
                            ? (lang === "en" ? "Edit tracking" : "Modifier le suivi")
                            : (lang === "en" ? "+ Add tracking" : "+ Ajouter le suivi")}
                        </button>
                        <button
                          onClick={function() { if (confirm(lang === "en" ? "Delete this shipment?" : "Supprimer cet envoi ?")) deleteShipment(s.id); }}
                          style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontFamily: "inherit" }}>
                          {"🗑"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TAB: CERTIFY ── */}
        {tab === "certify" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[["video", p.video_tab, p.recommended], ["photos", p.photo_tab, ""]].map(function(item) {
                return (
                  <button key={item[0]} onClick={function() { setMode(item[0]); if (item[0] === "photos") stopCamera(); }}
                    style={{ flex: 1, padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: mode === item[0] ? "2px solid #111" : "1px solid #E5E7EB", background: mode === item[0] ? "#111" : "#fff", color: mode === item[0] ? "#fff" : "#555", cursor: "pointer", fontFamily: "inherit" }}>
                    {item[1]} {item[2] ? React.createElement("span", { style: { fontSize: 10, marginLeft: 4, padding: "2px 6px", background: "#16A34A", color: "#fff", borderRadius: 10 } }, item[2]) : null}
                  </button>
                );
              })}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{p.article_label} *</label>
              <input value={articleName} onChange={function(e) { setArticleName(e.target.value); }} placeholder={p.article_ph} style={inp} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{p.ref_label} <span style={{ fontWeight: 400, color: "#999" }}>({p.optional})</span></label>
              <input value={orderRef} onChange={function(e) { setOrderRef(e.target.value); }} placeholder={p.ref_ph} style={inp} />
            </div>

            {mode === "video" && (
              <>
                <div style={{ marginBottom: 16, borderRadius: 14, overflow: "hidden", background: "#111", position: "relative", minHeight: 220 }}>
                  <video ref={videoRef} muted playsInline style={{ width: "100%", display: cameraOn && !recordedUrl ? "block" : "none", maxHeight: 340, objectFit: "cover" }} />

                  {cameraOn && !recordedUrl && (
                    <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.55)", borderRadius: 8, padding: "4px 12px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, color: "#00FF88", fontFamily: "monospace", fontWeight: 700 }}>SellGuard · {timestamp}</span>
                    </div>
                  )}

                  {recordedUrl && <video src={recordedUrl} controls playsInline style={{ width: "100%", maxHeight: 340 }} />}

                  {!cameraOn && !recordedUrl && (
                    <div style={{ minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <div style={{ fontSize: 40 }}>{"🎥"}</div>
                      <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: "0 20px" }}>
                        {lang === "en" ? "Video + SHA-256 certificate generated automatically" : "Vidéo + certificat SHA-256 générés automatiquement"}
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
                      ? <button onClick={startCamera} disabled={!articleName.trim()} style={btnStyle("#111", "#fff", !articleName.trim())}>{p.activate}</button>
                      : !recording
                        ? <>
                            <button onClick={startRecording} style={Object.assign({}, btnStyle("#DC2626", "#fff", false), { flex: 2 })}>{p.start}</button>
                            <button onClick={stopCamera} style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>{p.cancel}</button>
                          </>
                        : <button onClick={stopRecording} style={btnStyle("#111", "#fff", false)}>{p.stop} — {fmt(elapsed)}</button>
                    }
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    <button onClick={downloadVideo} disabled={processing} style={btnStyle("#16A34A", "#fff", processing)}>
                      {lang === "en" ? "⬇️ Download video" : "⬇️ Télécharger la vidéo"}
                    </button>
                    <button onClick={downloadPDF} disabled={processing} style={btnStyle("#2563EB", "#fff", processing)}>
                      {processing ? (lang === "en" ? "Generating..." : "Génération...") : (lang === "en" ? "📄 Download PDF certificate" : "📄 Télécharger le certificat PDF")}
                    </button>
                    <button onClick={function() { setRecordedBlob(null); setRecordedUrl(null); setElapsed(0); startCamera(); }}
                      style={{ padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>{p.redo}</button>
                  </div>
                )}

                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px" }}>
                  <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}><strong>{lang === "en" ? "Tip:" : "Conseil :"}</strong> {p.tips}</p>
                </div>
              </>
            )}

            {mode === "photos" && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div onClick={function() { fileRef.current.click(); }} style={{ border: "2px dashed #D1D5DB", borderRadius: 14, padding: 20, cursor: "pointer", background: "#fff", textAlign: "center", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: 14, color: "#888" }}>+ {lang === "en" ? "Add photos" : "Ajouter des photos"}</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={function(e) { handleFiles(e.target.files); }} />
                  {photos.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
                      {photos.map(function(ph, i) {
                        return (
                          <div key={i} style={{ position: "relative" }}>
                            <img src={ph.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB" }} />
                            <button onClick={function() { setPhotos(function(prev) { return prev.filter(function(_, idx) { return idx !== i; }); }); }}
                              style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#DC2626", color: "#fff", border: "2px solid #fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>
                              {"×"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button onClick={certifyPhotos} disabled={!photos.length || !articleName.trim()} style={btnStyle("#111", "#fff", !photos.length || !articleName.trim())}>
                  {lang === "en" ? "Generate certificate →" : "Générer le certificat →"}
                </button>
              </>
            )}
          </>
        )}
      </Layout>
    </>
  );
}
