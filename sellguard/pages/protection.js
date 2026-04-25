import { useState } from "react"

export default function Protection() {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "40px 20px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>

        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          Certifier mon envoi
        </h1>

        <p style={{ color: "#888", marginBottom: "30px" }}>
          Enregistrez une preuve vidéo horodatée, recevable en cas de litige.
        </p>

        <input
          placeholder="Nom de l’article"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            background: "#111",
            border: "1px solid #222",
            borderRadius: "10px",
            color: "#fff"
          }}
        />

        <input
          placeholder="Référence commande (optionnel)"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            background: "#111",
            border: "1px solid #222",
            borderRadius: "10px",
            color: "#fff"
          }}
        />

        <div style={{
          background: "#0A0A0A",
          border: "1px solid #222",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px"
        }}>
          <p style={{ color: "#777", marginBottom: "10px" }}>
            Étapes de certification
          </p>

          <p>1. Montre l’article</p>
          <p>2. Filme l’emballage</p>
          <p>3. Filme l’étiquette</p>

          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            Durée recommandée : 20–40 secondes
          </p>
        </div>

        <button
          onClick={() => setIsRecording(true)}
          style={{
            width: "100%",
            padding: "14px",
            background: "#fff",
            color: "#000",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Commencer la certification
        </button>

        {isRecording && (
          <p style={{ color: "#00ff88", marginTop: "10px" }}>
            ● Enregistrement en cours
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px", fontSize: "12px", color: "#777" }}>
          <span>Sécurisé</span>
          <span>Horodaté</span>
          <span>Vérifiable</span>
        </div>

      </div>
    </div>
  )
}
