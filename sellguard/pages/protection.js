import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useLang } from "../contexts/LangContext";
import { getSupabase } from "../lib/supabaseClient";

// Sélectionne le meilleur mimeType supporté par le navigateur.
// iOS Safari ne supporte que mp4 ; Chrome/Firefox préfèrent webm.
function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const t of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(t)) return t;
    } catch (_) {}
  }
  return null;
}

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

  const [step, setStep] = useState("form");
  const [article, setArticle] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [cert, setCert] = useState(null);
  const [copiedShare, setCopiedShare] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordedMimeRef = useRef(null);

  useEffect(() => {
    if (step === "recording" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [step]);

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

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Ton navigateur ne supporte pas la caméra. Essaie Safari ou Chrome récent.");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setError("Ton navigateur ne supporte pas l'enregistrement vidéo. Mets à jour iOS / Safari.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });
      streamRef.current = stream;
      setStep("recording");

      const mimeType = pickMimeType();
      const mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recordedMimeRef.current = mr.mimeType || mimeType || "video/webm";
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const rawType = recordedMimeRef.current || "video/webm";
        const cleanType = rawType.split(";")[0].trim() || "video/webm";
        recordedMimeRef.current = cleanType;
        try {
          const blob = new Blob(chunksRef.current, { type: cleanType });
          setVideoBlob(blob);
          setVideoUrl(URL.createObjectURL(blob));
        } catch (err) {
          setError("Erreur création vidéo : " + (err.message || err.name || "inconnue"));
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setStep("review");
      };
      mr.start();
    } catch (e) {
      let msg;
      if (e && (e.name === "NotAllowedError" || e.name === "PermissionDeniedError")) {
        msg = "Permission caméra refusée. Sur iPhone : tape sur l'icône à gauche de la barre d'adresse → Réglages du site → Caméra → Autoriser. Puis recharge la page.";
      } else if (e && e.name === "NotFoundError") {
        msg = "Aucune caméra trouvée sur cet appareil.";
      } else if (e && e.name === "NotReadableError") {
        msg = "La caméra est déjà utilisée par une autre app. Ferme les autres apps caméra puis réessaie.";
      } else if (e && e.name === "OverconstrainedError") {
        msg = "Cette caméra ne supporte pas la résolution demandée.";
      } else if (e && e.name === "SecurityError") {
        msg = "Caméra bloquée pour raisons de sécurité (page non sécurisée ?). Vérifie que l'URL commence bien par https://.";
      } else {
        msg = "Erreur caméra : " + ((e && (e.message || e.name)) || "inconnue");
      }
      setError(msg);
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

      const mime = recordedMimeRef.current || videoBlob.type || "video/webm";
      const authHeader = "Bearer " + session.access_token;

      const initRes = await fetch("/api/upload-init", {
        method: "POST",
        headers: { Authorization: authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ mime }),
      });
      const initData = await initRes.json().catch(() => ({}));
      if (!initRes.ok) {
        throw new Error(initData.error || "Erreur init upload");
      }
      const { video_path, upload_token } = initData;

      const { error: upErr } = await sb.storage
        .from("protection-videos")
        .uploadToSignedUrl(video_path, upload_token, videoBlob, {
          contentType: mime,
        });
      if (upErr) {
        throw new Error("Upload Storage : " + (upErr.message || "erreur"));
      }

      const finRes = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({
          video_path,
          article,
          order_ref: orderRef,
          tracking_number: trackingNumber,
          tracking_carrier: trackingCarrier,
          device_info: navigator.userAgent.substring(0, 200),
        }),
      });
      const finData = await finRes.json().catch(() => ({}));
      if (finRes.status === 429) {
        throw new Error("Quota journalier atteint (50 certificats / jour). Reset à minuit UTC.");
      }
      if (!finRes.ok) {
        throw new Error(finData.error || "Erreur finalisation");
      }

      setCert(finData);
      setStep("done");
    } catch (e) {
      setError(e.message || "Erreur");
      setStep("review");
    }
  }

  return (
    <>
      <Head>
        <title>SellCov — Certifier un envoi</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #f8f7f3;
          --bg-soft: #ffffff;
          --bg-card: #ffffff;
          --ink: #111111;
          --ink-soft: #2a2a2a;
          --muted: #6b6b6b;
          --dim: #a0a09a;
          --line: #e6e4dc;
          --line-strong: #d4d2c8;
          --green: #1f9f5f;
          --green-deep: #167a48;
          --green-soft: #e7f3ec;
          --danger: #c0392b;
          --radius: 16px;
          --radius-lg: 28px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }
        button { font-family: inherit; }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(248,247,243,0.92)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <Link href="/">
            <span style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
              <img src="/logo-full.png" alt="SellCov" style={{ height: 80, width: "auto" }} />
            </span>
          </Link>
          <Link href="/">
            <span style={{ color: "#6b6b6b", fontSize: 14, fontWeight: 500, padding: "8px 14px", borderRadius: 999, cursor: "pointer" }}>
              Retour
            </span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ padding: "48px 0 24px", textAlign: "center" }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 6vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Certifier un envoi
          </h1>
          <p style={{ color: "#6b6b6b", fontSize: 16, marginTop: 14, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Une vidéo en une prise, horodatée et signée. La preuve que tu ne peux pas perdre.
          </p>
        </div>

        {error && (
          <div style={{ padding: "14px 18px", borderRadius: 16, background: "#fdecea", color: "#c0392b", fontSize: 14, fontWeight: 500, marginBottom: 20, border: "1.5px solid #f5c2bc" }}>
            {error}
          </div>
        )}

        {step === "form" && (
          <div style={cardStyle}>
            <Field label="Nom de l'article *">
              <input
                type="text"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder="Ex : Levi's 501 W30 L32"
                style={inputStyle}
                maxLength={200}
              />
            </Field>

            <Field label="Référence commande (optionnel)">
              <input
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="Ex : Vinted #4829301"
                style={inputStyle}
                maxLength={100}
              />
            </Field>

            <Field label="Transporteur">
              <select
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                style={inputStyle}
              >
                <option value="">Sélectionne un transporteur</option>
                {CARRIERS.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Numéro de suivi (optionnel)">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex : 6A12345678901"
                style={inputStyle}
                maxLength={100}
              />
            </Field>

            <div style={{ background: "#f8f7f3", border: "1.5px solid #e6e4dc", borderRadius: 16, padding: "20px 22px", margin: "8px 0 24px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#167a48", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
                Comment filmer
              </p>
              <Step n={1}>Filme l'article dans tous ses détails (état, défauts, marque, étiquette).</Step>
              <Step n={2}>Continue en filmant la fermeture complète du colis et la pose de l'étiquette d'envoi.</Step>
              <Step n={3} strong>Le tout en une seule prise, sans couper la vidéo.</Step>
              <p style={{ fontSize: 13, color: "#6b6b6b", marginTop: 12, fontStyle: "italic" }}>
                Moins de 2 minutes en tout.
              </p>
            </div>

            <button onClick={startCamera} style={btnPrimary}>
              Démarrer l'enregistrement
            </button>
          </div>
        )}

        {step === "recording" && (
          <div style={cardStyle}>
            <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", borderRadius: 16, background: "#000" }} />
            <div style={{ marginTop: 20 }}>
              <button onClick={stopRecording} style={btnDanger}>
                Stop et sauvegarder
              </button>
            </div>
            <p style={{ fontSize: 13, color: "#6b6b6b", marginTop: 14, textAlign: "center", fontWeight: 500 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#c0392b", marginRight: 6, verticalAlign: "middle" }} />
              Enregistrement en cours
            </p>
          </div>
        )}

        {step === "review" && (
          <div style={cardStyle}>
            <p style={{ fontSize: 14, color: "#6b6b6b", marginBottom: 14, fontWeight: 500 }}>
              Vérifie ton aperçu avant de certifier :
            </p>
            {videoUrl && <video src={videoUrl} controls style={{ width: "100%", borderRadius: 16, background: "#000" }} />}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={uploadCert} style={btnPrimary}>Certifier maintenant</button>
              <button onClick={reset} style={btnGhost}>Refaire</button>
            </div>
          </div>
        )}

        {step === "uploading" && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "56px 28px" }}>
            <p style={{ fontSize: 17, fontWeight: 600 }}>Upload et horodatage en cours…</p>
            <p style={{ fontSize: 14, color: "#6b6b6b", marginTop: 10 }}>Ne ferme pas cette page.</p>
          </div>
        )}

        {step === "done" && cert && (
          <>
            <div style={{ background: "#e7f3ec", border: "1.5px solid #1f9f5f", borderRadius: 28, padding: "36px 28px", textAlign: "center", marginTop: 16 }}>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#167a48", letterSpacing: "-0.02em" }}>
                Envoi certifié
              </p>
              <p style={{ fontSize: 15, color: "#2a2a2a", marginTop: 8 }}>
                Ton certificat est créé, signé et stocké en sécurité.
              </p>

              <div style={{ background: "#fff", border: "1.5px solid #d4d2c8", borderRadius: 16, padding: "16px 18px", marginTop: 24, textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b6b6b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                  Référence certificat
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono), monospace", letterSpacing: "0.02em" }}>
                  {cert.cert_id}
                </div>
              </div>

              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href={`/api/certificat?cert_id=${encodeURIComponent(cert.cert_id)}&lang=${lang || "fr"}`}
                  style={{ ...btnPrimary, textDecoration: "none", textAlign: "center" }}
                >
                  Télécharger le certificat PDF
                </a>
                <Link href={`/verify/${cert.cert_id}`}>
                  <span style={{ ...btnGhost, textDecoration: "none", textAlign: "center", display: "block" }}>
                    Voir la page de vérification publique
                  </span>
                </Link>
                {trackingNumber && TRACKING_URLS[trackingCarrier] && (
                  <a
                    href={TRACKING_URLS[trackingCarrier](trackingNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...btnGhost, textDecoration: "none", textAlign: "center" }}
                  >
                    Suivre le colis ({CARRIERS.find((c) => c.id === trackingCarrier)?.label})
                  </a>
                )}
                <button onClick={reset} style={btnGhost}>Certifier un autre envoi</button>
              </div>

              <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #d4d2c8" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#6b6b6b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                  Partage ton expérience
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      const url = typeof window !== "undefined" ? `${window.location.origin}/verify/${cert.cert_id}` : "";
                      navigator.clipboard.writeText(url);
                      setCopiedShare("link");
                      setTimeout(() => setCopiedShare(null), 1500);
                    }}
                    style={pillStyle}
                  >
                    {copiedShare === "link" ? "✓ Copié" : "Copier le lien"}
                  </button>
                  <a
                    href={typeof window !== "undefined" ? `https://twitter.com/intent/tweet?text=${encodeURIComponent("Je viens de certifier ma vente avec SellCov. Preuve vidéo horodatée + signature cryptographique.")}&url=${encodeURIComponent(`${window.location.origin}/verify/${cert.cert_id}`)}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...pillStyle, textDecoration: "none", textAlign: "center" }}
                  >
                    Partager sur X
                  </a>
                  <a
                    href={typeof window !== "undefined" ? `https://wa.me/?text=${encodeURIComponent(`Je viens de certifier ma vente avec SellCov : ${window.location.origin}/verify/${cert.cert_id}`)}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...pillStyle, textDecoration: "none", textAlign: "center" }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <p style={{ fontSize: 11, color: "#a0a09a", marginTop: 22, lineHeight: 1.6, textAlign: "left", fontFamily: "var(--font-mono), monospace" }}>
                Hash SHA-256 : {cert.hash.substring(0, 32)}…
                <br />
                Horodatage : {new Date(cert.timestamp).toLocaleString(lang === "en" ? "en-US" : "fr-FR", { dateStyle: "long", timeStyle: "medium" })}
              </p>
            </div>
          </>
        )}
      </main>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1.5px solid #e6e4dc",
  borderRadius: 28,
  padding: "32px 28px",
  marginTop: 8,
};

const inputStyle = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #d4d2c8",
  borderRadius: 12,
  padding: "13px 14px",
  color: "#111",
  fontSize: 15.5,
  fontFamily: "inherit",
  display: "block",
  outline: "none",
  transition: "border-color .15s",
};

const btnPrimary = {
  width: "100%",
  background: "#1f9f5f",
  color: "#fff",
  border: "none",
  padding: "16px 24px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(31,159,95,0.22)",
  fontFamily: "inherit",
};

const btnGhost = {
  width: "100%",
  background: "transparent",
  color: "#111",
  border: "1.5px solid #d4d2c8",
  padding: "14px 22px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 14.5,
  cursor: "pointer",
  fontFamily: "inherit",
};

const btnDanger = {
  width: "100%",
  background: "#c0392b",
  color: "#fff",
  border: "none",
  padding: "16px 24px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(192,57,43,0.22)",
  fontFamily: "inherit",
};

const pillStyle = {
  flex: "1 1 auto",
  minWidth: 110,
  padding: "11px 14px",
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 999,
  border: "1.5px solid #d4d2c8",
  background: "#fff",
  color: "#111",
  cursor: "pointer",
  fontFamily: "inherit",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, color: "#6b6b6b", marginBottom: 8, fontWeight: 600, letterSpacing: "0.02em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Step({ n, children, strong }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10, fontSize: 14.5, color: strong ? "#111" : "#2a2a2a", lineHeight: 1.5 }}>
      <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "#e7f3ec", color: "#167a48", fontWeight: 700, fontSize: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
        {n}
      </span>
      <span style={{ fontWeight: strong ? 600 : 500 }}>{children}</span>
    </div>
  );
}
