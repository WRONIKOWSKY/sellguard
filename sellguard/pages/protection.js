import { useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useLang } from "../contexts/LangContext";
import { getSupabase } from "../lib/supabaseClient";

const CARRIERS = [
  { id: "colissimo", label: "Colissimo (La Poste)" },
  { id: "mondialrelay", label: "Mondial Relay" },
  { id: "chronopost", label: "Chronopost" },
  { id: "dpd", label: "DPD" },
  { id: "ups", label: "UPS" },
  { id: "dhl", label: "DHL" },
  { id: "laposte", label: "La Poste (lettre suivie)" },
  { id: "autre", label: "Autre" },
];

// Mapping des transporteurs vers leurs URLs de tracking publiques
const TRACKING_URLS = {
  colissimo: (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  mondialrelay: (n) => `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${encodeURIComponent(n)}`,
  chronopost: (n) => `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${encodeURIComponent(n)}`,
  dpd: (n) => `https://www.dpd.fr/traces?lng=fr&typeLien=numero&numero=${encodeURIComponent(n)}`,
  ups: (n) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}`,
  dhl: (n) => `https://www.dhl.com/fr-fr/home/suivi.html?tracking-id=${encodeURIComponent(n)}`,
  laposte: (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
};

export default function Protection() {
  const { t, lang } = useLang();
  const p = (t && t.protection) || {};

  // Étapes : "form" → "recording" → "review" → "uploading" → "done"
  const [step, setStep] = useState("form");
  const [article, setArticle] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("colissimo");
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [cert, setCert] = useState(null); // { cert_id, hash, timestamp, signature }

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  function reset() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStep("form");
    setVideoBlob(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setError(null);
    setCert(null);
    chunksRef.current = [];
  }

  async function startCamera() {
    if (!article.trim()) {
      setError("Précise le nom de l'article avant de filmer.");
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStep("recording");

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setStep("review");
      };
      mr.start();
    } catch (e) {
      setError("Erreur caméra : " + (e.message || e));
      setStep("form");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }

  async function uploadCert() {
    if (!videoBlob) return;
    setStep("uploading");
    setError(null);

    try {
      const sb = getSupabase();
      const sessRes = await sb.auth.getSession();
      const session = sessRes?.data?.session;
      if (!session) {
        setError("Tu dois être connecté pour certifier un envoi. Va sur /compte.");
        setStep("review");
        return;
      }

      const formData = new FormData();
      formData.append("video", videoBlob, "proof.webm");
      formData.append("article", article);
      formData.append("order_ref", orderRef);
      formData.append("tracking_number", trackingNumber);
      formData.append("tracking_carrier", trackingCarrier);
      formData.append("device_info", navigator.userAgent.substring(0, 200));

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + session.access_token },
        body: formData,
      });

      const data = await res.json();
      if (res.status === 429) {
        throw new Error("Quota journalier atteint (50 certificats / jour). Reset à minuit UTC.");
      }
      if (!res.ok) {
        throw new Error(data.error || "Erreur upload");
      }

      setCert(data);
      setStep("done");
    } catch (e) {
      setError(e.message || "Erreur");
      setStep("review");
    }
  }

  // Render helpers
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: 14,
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginBottom: 14,
  };
  const labelStyle = { display: "block", fontSize: 12, color: "#888", marginBottom: 6, marginTop: 4, fontWeight: 500 };
  const btnPrimary = {
    width: "100%",
    padding: "14px",
    borderRadius: 10,
    border: "none",
    background: "#fff",
    color: "#000",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
  };
  const btnSecondary = { ...btnPrimary, background: "rgba(255,255,255,0.08)", color: "#fff" };
  const btnDanger = { ...btnPrimary, background: "#FF3B30", color: "#fff" };

  return (
    <>
      <Head>
        <title>SellCov — Protéger un envoi</title>
      </Head>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)", padding: "14px 20px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/">
              <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                <img src="/logo.png" alt="SellCov" style={{ height: 72, width: "auto" }} />
              </span>
            </Link>
            <Link href="/">
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>← Retour</span>
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px 0", fontFamily: "'DM Serif Display', serif" }}>
            Certifier un envoi
          </h1>
          <p style={{ color: "#888", margin: "0 0 28px 0", fontSize: 14 }}>
            Vidéo horodatée, signature cryptographique, certificat PDF vérifiable.
          </p>

          {error && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,59,48,0.1)", color: "#FF3B30", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {step === "form" && (
            <>
              <label style={labelStyle}>Nom de l'article *</label>
              <input
                type="text"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder="Ex: Levi's 501 W30 L32"
                style={inputStyle}
                maxLength={200}
              />

              <label style={labelStyle}>Référence commande (optionnel)</label>
              <input
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="Ex: Vinted #4829301"
                style={inputStyle}
                maxLength={100}
              />

              <label style={labelStyle}>Transporteur</label>
              <select
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                style={inputStyle}
              >
                {CARRIERS.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: "#000" }}>
                    {c.label}
                  </option>
                ))}
              </select>

              <label style={labelStyle}>Numéro de suivi (optionnel)</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex: 6A12345678901"
                style={inputStyle}
                maxLength={100}
              />

              <p style={{ fontSize: 12, color: "#666", margin: "16px 0", lineHeight: 1.5 }}>
                Conseil : emballe et scelle ton colis avant la vidéo. Filme l'article, le colis fermé puis l'étiquette. 30 secondes suffisent.
              </p>

              <button onClick={startCamera} style={btnPrimary}>
                Démarrer l'enregistrement
              </button>
            </>
          )}

          {step === "recording" && (
            <>
              <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", borderRadius: 12, background: "#000" }} />
              <div style={{ marginTop: 16 }}>
                <button onClick={stopRecording} style={btnDanger}>
                  Stop & sauvegarder
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#888", marginTop: 12, textAlign: "center" }}>
                ⏺ Enregistrement en cours
              </p>
            </>
          )}

          {step === "review" && (
            <>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Aperçu — vérifie avant de certifier :</p>
              {videoUrl && <video src={videoUrl} controls style={{ width: "100%", borderRadius: 12, background: "#000" }} />}
              <div style={{ marginTop: 20 }}>
                <button onClick={uploadCert} style={btnPrimary}>
                  Certifier maintenant
                </button>
                <div style={{ height: 10 }} />
                <button onClick={reset} style={btnSecondary}>
                  Refaire
                </button>
              </div>
            </>
          )}

          {step === "uploading" && (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 16 }}>Upload + horodatage en cours…</p>
              <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Ne ferme pas cette page.</p>
            </div>
          )}

          {step === "done" && cert && (
            <div style={{ padding: 24, borderRadius: 16, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}>
              <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#4ADE80" }}>✓ Envoi certifié</p>
              <p style={{ fontSize: 13, color: "#888", margin: "8px 0 20px 0" }}>
                Ton certificat est créé, signé et stocké en sécurité.
              </p>

              <div style={{ background: "#0A0A0A", padding: 14, borderRadius: 10, fontFamily: "monospace", fontSize: 13 }}>
                <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>RÉFÉRENCE CERTIFICAT</div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.02em" }}>{cert.cert_id}</div>
              </div>

              <div style={{ marginTop: 20 }}>
                <a
                  href={`/api/certificat?cert_id=${encodeURIComponent(cert.cert_id)}&lang=${lang || "fr"}`}
                  style={{ ...btnPrimary, textDecoration: "none", display: "block", textAlign: "center", boxSizing: "border-box" }}
                >
                  Télécharger le certificat PDF
                </a>
                <div style={{ height: 10 }} />
                <Link href={`/verify/${cert.cert_id}`}>
                  <span style={{ ...btnSecondary, textDecoration: "none", display: "block", textAlign: "center", boxSizing: "border-box" }}>
                    Voir la page de vérification publique
                  </span>
                </Link>
                {trackingNumber && TRACKING_URLS[trackingCarrier] && (
                  <>
                    <div style={{ height: 10 }} />
                    <a
                      href={TRACKING_URLS[trackingCarrier](trackingNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...btnSecondary, textDecoration: "none", display: "block", textAlign: "center", boxSizing: "border-box" }}
                    >
                      Suivre le colis ({CARRIERS.find((c) => c.id === trackingCarrier)?.label})
                    </a>
                  </>
                )}
                <div style={{ height: 10 }} />
                <button onClick={reset} style={btnSecondary}>
                  Certifier un autre envoi
                </button>
              </div>

              <p style={{ fontSize: 11, color: "#666", marginTop: 20, lineHeight: 1.5 }}>
                Hash SHA-256 : <span style={{ fontFamily: "monospace" }}>{cert.hash.substring(0, 32)}…</span>
                <br />
                Horodatage : {new Date(cert.timestamp).toLocaleString(lang === "en" ? "en-US" : "fr-FR")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
