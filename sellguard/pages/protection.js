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

  function tx(obj) { return obj[lang] || obj.en || obj.fr; }

  var GUIDE_STEPS = [
    { time: 0, dur: 10, label: tx({fr:"Filme l'article", en:"Film the item", es:"Filma el artículo", it:"Filma l'articolo"}), icon: "1" },
    { time: 10, dur: 10, label: tx({fr:"Filme le colis fermé", en:"Film the sealed parcel", es:"Filma el paquete cerrado", it:"Filma il pacco chiuso"}), icon: "2" },
    { time: 20, dur: 10, label: tx({fr:"Filme l'étiquette d'envoi", en:"Film the shipping label", es:"Filma la etiqueta de envío", it:"Filma l'etichetta di spedizione"}), icon: "3" },
  ];
  function getCurrentStep(secs) {
    for (var i = GUIDE_STEPS.length - 1; i >= 0; i--) {
      if (secs >= GUIDE_STEPS[i].time) return i;
    }
    return 0;
  }

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
      setCameraError(tx({fr:"Impossible d'accéder à la caméra. Autorise l'accès dans les paramètres de ton navigateur.", en:"Cannot access camera. Please allow access in your browser settings.", es:"No se puede acceder a la cámara. Permite el acceso en la configuración de tu navegador.", it:"Impossibile accedere alla fotocamera. Consenti l'accesso nelle impostazioni del browser."}));
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
      setCameraError(tx({fr:"Enregistrement non supporté sur ce navigateur.", en:"Recording not supported on this browser.", es:"Grabación no soportada en este navegador.", it:"Registrazione non supportata su questo browser."}));
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
    var id = "SC-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    var dateStr = recordDate || new Date().toLocaleString("fr-FR");
    var name = (articleName || "envoi").replace(/[^a-zA-Z0-9]/g, "_");
    var ext = recordedBlob.type.includes("mp4") ? "mp4" : "webm";
    var hash = await computeHash(recordedBlob);
    var videoSizeKB = Math.round(recordedBlob.size / 1024);
    setCertData({ id: id, dateStr: dateStr, hash: hash, videoSizeKB: videoSizeKB });
    await shareFile(recordedBlob, "SellCov_" + id + "_" + name + "." + ext);
  }

  async function downloadPDF() {
    if (!certData && !recordedBlob) return;
    setProcessing(true);
    var id = certData ? certData.id : "SC-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    var dateStr = certData ? certData.dateStr : recordDate || new Date().toLocaleString("fr-FR");
    var hash = certData ? certData.hash : await computeHash(recordedBlob);
    var videoSizeKB = certData ? certData.videoSizeKB : (recordedBlob ? Math.round(recordedBlob.size / 1024) : 0);
    try {
      var params = new URLSearchParams({ certId: id, article: articleName || "", orderRef: orderRef || "", dateStr: dateStr, hash: hash, videoSizeKB: videoSizeKB, deviceInfo: getDeviceInfo(), lang: lang });
      var res = await fetch("/api/certificat?" + params.toString());
      var blob = await res.blob();
      await shareFile(blob, "SellCov_" + id + "_Certificat.pdf");
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
    var certInfo = { id: "SC-" + Math.random().toString(36).substr(2, 9).toUpperCase(), article: articleName, date: new Date().toLocaleString("fr-FR"), photos: photos };
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

  var inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#111", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#fff", boxSizing: "border-box" };
  var btnStyle = function(bg, col, dis) { return { width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: dis ? "rgba(255,255,255,0.06)" : bg, color: dis ? "rgba(255,255,255,0.25)" : col, cursor: dis ? "default" : "pointer", fontFamily: "inherit" }; };

  var PLATFORM_GUIDE = [
    { name: "Vinted", color: "#09B1BA", bg: "rgba(9,177,186,0.1)", score: "★★★☆", tip: tx({fr:"Litige → 'Ajouter des preuves' → upload la vidéo + le certificat PDF.", en:"Dispute → 'Add proof' → upload video + PDF certificate.", es:"Disputa → 'Añadir pruebas' → sube el vídeo + certificado PDF.", it:"Controversia → 'Aggiungi prove' → carica video + certificato PDF."}) },
    { name: "Depop", color: "#FF0000", bg: "rgba(255,0,0,0.08)", score: "★★★☆", tip: tx({fr:"Litige → 'Provide evidence' → joint les deux fichiers.", en:"Dispute → 'Provide evidence' → attach both files.", es:"Disputa → 'Provide evidence' → adjunta ambos archivos.", it:"Controversia → 'Provide evidence' → allega entrambi i file."}) },
    { name: "Grailed", color: "#fff", bg: "rgba(255,255,255,0.06)", score: "★★★☆", tip: tx({fr:"Ouvre un ticket support, joint la vidéo + le certificat PDF.", en:"Open support ticket, attach video + certificate PDF.", es:"Abre un ticket de soporte, adjunta vídeo + certificado PDF.", it:"Apri un ticket di supporto, allega video + certificato PDF."}) },
    { name: "Vestiaire Collective", color: "#ccc", bg: "rgba(255,255,255,0.05)", score: "★★★☆", tip: tx({fr:"Contacte leur service client avec les deux fichiers en pièce jointe.", en:"Contact customer service with both files attached.", es:"Contacta con atención al cliente con ambos archivos adjuntos.", it:"Contatta il servizio clienti con entrambi i file allegati."}) },
    { name: "Etsy", color: "#F1641E", bg: "rgba(241,100,30,0.08)", score: "★★★★", tip: tx({fr:"Centre de résolution → 'Submit evidence' → upload les deux fichiers.", en:"Resolution center → 'Submit evidence' → upload both files.", es:"Centro de resolución → 'Submit evidence' → sube ambos archivos.", it:"Centro risoluzione → 'Submit evidence' → carica entrambi i file."}) },
  ];

  if (certified) return (
    <>
      <Head><title>SellCov {p.certified_title}</title></Head>
      <Layout>
        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#15803D", marginBottom: 6 }}>{p.certified_title}</h3>
          <p style={{ fontSize: 14, color: "#166534", lineHeight: 1.6 }}>{p.certified_sub}</p>
        </div>

        <div style={{ background: "rgba(99,102,241,0.08)", border: "0.5px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.6, fontWeight: 600, marginBottom: 6 }}>
            {tx({fr:"2 fichiers téléchargés :", en:"2 files downloaded:", es:"2 archivos descargados:", it:"2 file scaricati:"})}
          </p>
          <p style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {tx({fr:"• Fichier vidéo (.mp4 / .webm)\n• Certificat PDF SellCov avec empreinte SHA-256\n\nConserve les deux fichiers ensemble. Ils constituent ta preuve complète.", en:"• Video file (.mp4 / .webm)\n• SellCov certificate PDF with SHA-256 hash\n\nKeep both files together. They form your complete proof.", es:"• Archivo de vídeo (.mp4 / .webm)\n• Certificado PDF SellCov con hash SHA-256\n\nConserva ambos archivos juntos. Constituyen tu prueba completa.", it:"• File video (.mp4 / .webm)\n• Certificato PDF SellCov con hash SHA-256\n\nConserva entrambi i file. Costituiscono la tua prova completa."})}
          </p>
        </div>

        <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
          {[
            [tx({fr:"Numéro", en:"Number", es:"Número", it:"Numero"}), certified.id],
            [tx({fr:"Article", en:"Item", es:"Artículo", it:"Articolo"}), certified.article],
            ["Date", certified.date],
            ["SHA-256", certified.hash ? certified.hash.substring(0, 16) + "..." : ""],
          ].map(function(row) {
            return (
              <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{row[0]}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right", marginLeft: 16, fontFamily: row[0] === "SHA-256" ? "monospace" : "inherit" }}>{row[1]}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: "rgba(74,222,128,0.06)", border: "0.5px solid rgba(74,222,128,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#16A34A", lineHeight: 1.6 }}>
            {tx({fr:"Tu pourras ajouter ton numéro de suivi et ta preuve de dépôt plus tard depuis l'onglet \"Mes envois\".", en:"You can add your tracking number and deposit receipt later from the \"My shipments\" tab.", es:"Puedes añadir tu número de seguimiento y recibo de depósito más tarde desde la pestaña \"Mis envíos\".", it:"Puoi aggiungere il numero di tracciamento e la ricevuta di deposito più tardi dalla scheda \"Le mie spedizioni\"."})}
          </p>
        </div>

        <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5, marginBottom: 14 }}>{p.guide_title}</p>
          {PLATFORM_GUIDE.map(function(pl, i) {
            return (
              <div key={pl.name} style={{ padding: "10px 0", borderBottom: i < PLATFORM_GUIDE.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: pl.bg, color: pl.color }}>{pl.name}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{pl.score}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>{pl.tip}</p>
              </div>
            );
          })}
        </div>
        <button onClick={reset} style={btnStyle("#fff", "#000", false)}>{p.new_btn}</button>
      </Layout>
    </>
  );

  return (
    <>
      <Head><title>SellCov {p.title}</title></Head>
      <Layout>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{p.title}</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>{p.subtitle}</p>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4 }}>
          {[
            ["certify", tx({fr:"Certifier", en:"Certify", es:"Certificar", it:"Certifica"})],
            ["shipments", tx({fr:"Mes envois", en:"My shipments", es:"Mis envíos", it:"Le mie spedizioni"})]
          ].map(function(item) {
            var hasCount = item[0] === "shipments" && shipments.length > 0;
            return (
              <button key={item[0]} onClick={function() { setTab(item[0]); if (item[0] === "shipments") setShipments(loadShipments()); }}
                style={{ flex: 1, padding: "10px 12px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "none",
                  background: tab === item[0] ? "rgba(255,255,255,0.1)" : "transparent", color: tab === item[0] ? "#fff" : "rgba(255,255,255,0.35)",
                  cursor: "pointer", fontFamily: "inherit", boxShadow: tab === item[0] ? "0 1px 3px rgba(255,255,255,0.05)" : "none" }}>
                {item[1]} {hasCount ? " (" + shipments.length + ")" : ""}
              </button>
            );
          })}
        </div>

        {tab === "shipments" && (
          <div>
            {shipments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.35)" }}>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{tx({fr:"Aucun envoi certifié", en:"No shipments yet", es:"Ningún envío certificado", it:"Nessuna spedizione certificata"})}</p>
                <p style={{ fontSize: 13 }}>{tx({fr:"Certifie un envoi pour le voir ici.", en:"Certify a shipment to see it here.", es:"Certifica un envío para verlo aquí.", it:"Certifica una spedizione per vederla qui."})}</p>
              </div>
            ) : (
              shipments.map(function(s) {
                var isEditing = editingId === s.id;
                var hasTracking = s.tracking_number || s.receipt_photo;
                return (
                  <div key={s.id} style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{s.article}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{s.date}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: hasTracking ? "rgba(34,197,94,0.1)" : "rgba(251,146,60,0.1)", color: hasTracking ? "#16A34A" : "#D97706" }}>
                        {hasTracking ? (tx({fr:"Complet", en:"Complete", es:"Completo", it:"Completo"})) : (tx({fr:"Sans suivi", en:"No tracking", es:"Sin seguimiento", it:"Senza tracciamento"}))}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                      <span style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 6 }}>{s.id}</span>
                      {s.orderRef ? <span style={{ marginLeft: 8 }}>{tx({fr:"Réf:", en:"Ref:", es:"Ref:", it:"Rif:"})} {s.orderRef}</span> : null}
                    </div>

                    {hasTracking && !isEditing && (
                      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                        {s.tracking_number && (
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: s.receipt_photo ? 6 : 0 }}>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{tx({fr:"Suivi", en:"Tracking", es:"Seguimiento", it:"Tracciamento"})}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>{s.tracking_number}</span>
                          </div>
                        )}
                        {s.receipt_photo && (
                          <div style={{ marginTop: 6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{tx({fr:"Preuve de dépôt", en:"Deposit receipt", es:"Recibo de depósito", it:"Ricevuta di deposito"})}</span>
                              <button onClick={function() {
                                var a = document.createElement("a");
                                a.href = s.receipt_photo;
                                a.download = "SellCov_" + s.id + "_receipt.jpg";
                                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                              }} style={{ fontSize: 11, fontWeight: 600, color: "#818CF8", background: "rgba(99,102,241,0.08)", border: "0.5px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                                {tx({fr:"Télécharger", en:"Download", es:"Descargar", it:"Scarica"})}
                              </button>
                            </div>
                            <img src={s.receipt_photo} style={{ width: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.07)" }} />
                          </div>
                        )}
                        {s.tracking_date && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 4 }}>{tx({fr:"Ajouté", en:"Added", es:"Añadido", it:"Aggiunto"})} {s.tracking_date}</p>}
                      </div>
                    )}

                    {isEditing && (
                      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
                          {tx({fr:"Numéro de suivi", en:"Tracking number", es:"Número de seguimiento", it:"Numero di tracciamento"})}
                        </label>
                        <input value={trackingNum} onChange={function(e) { setTrackingNum(e.target.value); }} placeholder="Ex: 8R12345678901" style={Object.assign({}, inp, { marginBottom: 12 })} />
                        <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
                          {tx({fr:"Photo preuve de dépôt", en:"Deposit receipt photo", es:"Foto recibo de depósito", it:"Foto ricevuta di deposito"})} <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.25)" }}>({p.optional})</span>
                        </label>
                        <div onClick={function() { receiptRef.current && receiptRef.current.click(); }}
                          style={{ border: "1.5px dashed rgba(255,255,255,0.14)", borderRadius: 10, padding: 14, cursor: "pointer", background: "#0A0A0A", textAlign: "center", marginBottom: 12 }}>
                          {receiptPhoto
                            ? <img src={receiptPhoto} style={{ maxWidth: "100%", maxHeight: 120, borderRadius: 8 }} />
                            : <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>+ {tx({fr:"Ajouter la photo", en:"Add photo", es:"Añadir foto", it:"Aggiungi foto"})}</p>
                          }
                        </div>
                        <input ref={receiptRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleReceiptPhoto} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={function() { updateShipment(s.id, trackingNum, receiptPhoto); }} disabled={!trackingNum.trim() && !receiptPhoto}
                            style={Object.assign({}, btnStyle("#16A34A", "#fff", !trackingNum.trim() && !receiptPhoto), { flex: 2 })}>
                            {tx({fr:"Enregistrer", en:"Save", es:"Guardar", it:"Salva"})}
                          </button>
                          <button onClick={function() { setEditingId(null); setTrackingNum(""); setReceiptPhoto(null); }}
                            style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "0.5px solid rgba(255,255,255,0.07)", background: "#0A0A0A", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>
                            {tx({fr:"Annuler", en:"Cancel", es:"Cancelar", it:"Annulla"})}
                          </button>
                        </div>
                      </div>
                    )}

                    {!isEditing && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={function() { setEditingId(s.id); setTrackingNum(s.tracking_number || ""); setReceiptPhoto(s.receipt_photo || null); }}
                          style={{ flex: 1, padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.07)", background: "#0A0A0A", color: hasTracking ? "rgba(255,255,255,0.5)" : "#818CF8", cursor: "pointer", fontFamily: "inherit" }}>
                          {hasTracking ? (tx({fr:"Modifier le suivi", en:"Edit tracking", es:"Editar seguimiento", it:"Modifica tracciamento"})) : (tx({fr:"+ Ajouter le suivi", en:"+ Add tracking", es:"+ Añadir seguimiento", it:"+ Aggiungi tracciamento"}))}
                        </button>
                        <button onClick={function() { if (confirm(tx({fr:"Supprimer cet envoi ?", en:"Delete this shipment?", es:"¿Eliminar este envío?", it:"Eliminare questa spedizione?"}))) deleteShipment(s.id); }}
                          style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "0.5px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.08)", color: "#DC2626", cursor: "pointer", fontFamily: "inherit" }}>
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "certify" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[["video", p.video_tab, p.recommended], ["photos", p.photo_tab, ""]].map(function(item) {
                return (
                  <button key={item[0]} onClick={function() { setMode(item[0]); if (item[0] === "photos") stopCamera(); }}
                    style={{ flex: 1, padding: "10px 14px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: mode === item[0] ? "1.5px solid rgba(255,255,255,0.5)" : "0.5px solid rgba(255,255,255,0.1)", background: mode === item[0] ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", color: mode === item[0] ? "#fff" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>
                    {item[1]} {item[2] ? React.createElement("span", { style: { fontSize: 10, marginLeft: 4, padding: "2px 6px", background: "#16A34A", color: "#fff", borderRadius: 10 } }, item[2]) : null}
                  </button>
                );
              })}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{p.article_label}</label>
              <input value={articleName} onChange={function(e) { setArticleName(e.target.value); }} placeholder={mode === "photos" ? (p.article_ph_photo || p.article_ph) : p.article_ph} style={inp} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{p.ref_label} <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.25)" }}>({p.optional})</span></label>
              <input value={orderRef} onChange={function(e) { setOrderRef(e.target.value); }} placeholder={p.ref_ph} style={inp} />
            </div>

            {mode === "video" && (
              <div style={{ background: "rgba(74,222,128,0.06)", border: "0.5px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#16A34A", lineHeight: 1.5 }}>
                  {tx({fr:"Emballe et scelle ton colis avant de lancer la vidéo.", en:"Pack and seal your parcel before starting the video.", es:"Empaqueta y sella tu paquete antes de grabar.", it:"Imballa e sigilla il pacco prima di registrare."})}
                </p>
              </div>
              <>
                <div style={{ marginBottom: 16, borderRadius: 14, overflow: "hidden", background: "#111", position: "relative", minHeight: 220 }}>
                  <video ref={videoRef} muted playsInline style={{ width: "100%", display: cameraOn && !recordedUrl ? "block" : "none", maxHeight: 340, objectFit: "cover" }} />
                  {cameraOn && !recordedUrl && (
                    <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.55)", borderRadius: 8, padding: "4px 12px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, color: "#00FF88", fontFamily: "monospace", fontWeight: 700 }}>SellCov · {timestamp}</span>
                    </div>
                  )}
                  {recordedUrl && <video src={recordedUrl} controls playsInline style={{ width: "100%", maxHeight: 340 }} />}
                  {!cameraOn && !recordedUrl && (
                    <div style={{ minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                        {GUIDE_STEPS.map(function(s, i) {
                          return (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(74,222,128,0.3)", color: "rgba(74,222,128,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.icon}</div>
                              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {recording && (function() {
                    var step = getCurrentStep(elapsed);
                    var gs = GUIDE_STEPS[step];
                    var stepProgress = Math.min(((elapsed - gs.time) / gs.dur) * 100, 100);
                    return (
                      <>
                        {/* Step progress bar */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", gap: 3, padding: "8px 10px" }}>
                          {GUIDE_STEPS.map(function(s, i) {
                            return (
                              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: 2, background: i < step ? "#4ADE80" : i === step ? "#4ADE80" : "transparent", width: i < step ? "100%" : i === step ? stepProgress + "%" : "0%", transition: "width 0.3s" }} />
                              </div>
                            );
                          })}
                        </div>
                        {/* Current step instruction */}
                        <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.75)", borderRadius: 12, padding: "8px 18px", display: "flex", alignItems: "center", gap: 10, backdropFilter: "blur(8px)" }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#4ADE80", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{gs.icon}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{gs.label}</span>
                        </div>
                        {/* Timer + red dot */}
                        <div style={{ position: "absolute", top: 60, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3B30", animation: "pulse 1s infinite" }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{fmt(elapsed)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {cameraError && <div style={{ marginBottom: 14, padding: 12, background: "rgba(220,38,38,0.08)", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{cameraError}</div>}

                {!recordedUrl ? (
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    {!cameraOn
                      ? <button onClick={startCamera} disabled={!articleName.trim()} style={btnStyle("#fff", "#000", !articleName.trim())}>{p.activate}</button>
                      : !recording
                        ? <>
                            <button onClick={startRecording} style={Object.assign({}, btnStyle("#DC2626", "#fff", false), { flex: 2 })}>{p.start}</button>
                            <button onClick={stopCamera} style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "0.5px solid rgba(255,255,255,0.07)", background: "#0A0A0A", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>{p.cancel}</button>
                          </>
                        : <button onClick={stopRecording} style={btnStyle("#fff", "#000", false)}>{p.stop} {fmt(elapsed)}</button>
                    }
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    <button onClick={downloadVideo} disabled={processing} style={btnStyle("#16A34A", "#fff", processing)}>
                      {tx({fr:"Télécharger la vidéo", en:"Download video", es:"Descargar vídeo", it:"Scarica video"})}
                    </button>
                    <button onClick={downloadPDF} disabled={processing} style={btnStyle("#2563EB", "#fff", processing)}>
                      {processing ? (tx({fr:"Génération...", en:"Generating...", es:"Generando...", it:"Generazione..."})) : (tx({fr:"Télécharger le certificat PDF", en:"Download PDF certificate", es:"Descargar certificado PDF", it:"Scarica certificato PDF"}))}
                    </button>
                    <button onClick={function() { setRecordedBlob(null); setRecordedUrl(null); setElapsed(0); startCamera(); }}
                      style={{ padding: 14, fontSize: 14, fontWeight: 600, borderRadius: 12, border: "0.5px solid rgba(255,255,255,0.07)", background: "#0A0A0A", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>{p.redo}</button>
                  </div>
                )}


              </>
            )}

            {mode === "photos" && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div onClick={function() { fileRef.current.click(); }} style={{ border: "1.5px dashed rgba(255,255,255,0.14)", borderRadius: 14, padding: 20, cursor: "pointer", background: "#0A0A0A", textAlign: "center", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>+ {tx({fr:"Ajouter des photos", en:"Add photos", es:"Añadir fotos", it:"Aggiungi foto"})}</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={function(e) { handleFiles(e.target.files); }} />
                  {photos.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
                      {photos.map(function(ph, i) {
                        return (
                          <div key={i} style={{ position: "relative" }}>
                            <img src={ph.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.07)" }} />
                            <button onClick={function() { setPhotos(function(prev) { return prev.filter(function(_, idx) { return idx !== i; }); }); }}
                              style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#DC2626", color: "#fff", border: "2px solid #111", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button onClick={certifyPhotos} disabled={!photos.length || !articleName.trim()} style={btnStyle("#fff", "#000", !photos.length || !articleName.trim())}>
                  {tx({fr:"Générer le certificat", en:"Generate certificate", es:"Generar certificado", it:"Genera certificato"})}
                </button>
              </>
            )}
          </>
        )}
      </Layout>
    </>
  );
}
