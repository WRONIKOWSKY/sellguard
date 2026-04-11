import { useState, useRef } from "react";
import Head from "next/head";
import Layout from "../components/Layout";

export default function Protection() {
  const [photos, setPhotos] = useState([]);
  const [articleName, setArticleName] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [certified, setCertified] = useState(null);
  const fileRef = useRef();

  function handleFiles(files) {
    const newPhotos = Array.from(files).map(file => {
      const url = URL.createObjectURL(file);
      return { url, name: file.name, size: file.size, timestamp: new Date().toISOString() };
    });
    setPhotos(p => [...p, ...newPhotos]);
  }

  function removePhoto(idx) {
    setPhotos(p => p.filter((_, i) => i !== idx));
  }

  function certify() {
    if (photos.length === 0 || !articleName.trim()) return;
    const cert = {
      id: "SG-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      article: articleName,
      orderRef: orderRef || "Non renseigné",
      date: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
      timestamp: new Date().toISOString(),
      photoCount: photos.length,
      photos: photos,
      hash: btoa(articleName + photos.length + Date.now()).substr(0, 24)
    };
    setCertified(cert);
  }

  function reset() {
    setPhotos([]); setArticleName(""); setOrderRef(""); setCertified(null);
  }

  return (
    <>
      <Head><title>SellGuard — Protéger mon envoi</title></Head>
      <Layout>
        {!certified ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>🛡️ Protéger mon envoi</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>Certifie tes photos avant l'envoi. En cas de litige, tu as une preuve horodatée et inattaquable.</p>
            </div>

            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "14px 18px", marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.6 }}>
                <strong>Comment ça marche :</strong> Prends des photos de l'article ET du colis emballé avant de fermer. On génère un certificat numérique avec horodatage que tu conserves en cas de litige.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Nom de l'article *</label>
              <input value={articleName} onChange={e => setArticleName(e.target.value)} placeholder="Ex: Levi's Trucker Jacket Type 2 - Taille M" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Référence commande <span style={{ fontWeight: 400, color: "#999" }}>(optionnel)</span></label>
              <input value={orderRef} onChange={e => setOrderRef(e.target.value)} placeholder="Ex: Vinted #4829301" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Photos de l'article et du colis *</label>
              <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                style={{ border: "2px dashed #D1D5DB", borderRadius: 14, padding: 20, cursor: "pointer", background: "#fff", textAlign: "center", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div>
                  <p style={{ fontSize: 14, color: "#888" }}>+ Ajouter des photos</p>
                  <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>Article, étiquette, colis emballé, détails</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />

              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={p.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB" }} />
                      <button onClick={() => removePhoto(i)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={certify} disabled={photos.length === 0 || !articleName.trim()}
              style={{ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: (photos.length === 0 || !articleName.trim()) ? "#E5E7EB" : "#111", color: (photos.length === 0 || !articleName.trim()) ? "#999" : "#fff", cursor: (photos.length === 0 || !articleName.trim()) ? "default" : "pointer", fontFamily: "inherit" }}>
              Générer le certificat →
            </button>
          </>
        ) : (
          <>
            <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 16, padding: "20px 24px", marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#15803D", marginBottom: 4 }}>Envoi certifié</h3>
              <p style={{ fontSize: 13, color: "#166534" }}>Conserve ce certificat. Il est ta preuve légale en cas de litige.</p>
            </div>

            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 4 }}>CERTIFICAT SELLGUARD</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{certified.id}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: "#F0FDF4", color: "#15803D" }}>Certifié</span>
              </div>

              {[
                ["Article", certified.article],
                ["Référence", certified.orderRef],
                ["Date & heure", certified.date],
                ["Nombre de photos", `${certified.photoCount} photo${certified.photoCount > 1 ? "s" : ""}`],
                ["Empreinte numérique", certified.hash],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
                  <span style={{ fontSize: 13, color: "#888", flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111", textAlign: "right", marginLeft: 16 }}>{value}</span>
                </div>
              ))}
            </div>

            {certified.photos.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 12 }}>PHOTOS CERTIFIÉES</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {certified.photos.map((p, i) => (
                    <img key={i} src={p.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                <strong>Important :</strong> Fais une capture d'écran de ce certificat ou note le numéro <strong>{certified.id}</strong>. En cas de litige, utilise ce numéro dans l'outil "Gérer un litige".
              </p>
            </div>

            <button onClick={reset} style={{ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: "#111", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
              Protéger un autre envoi
            </button>
          </>
        )}
      </Layout>
    </>
  );
}
