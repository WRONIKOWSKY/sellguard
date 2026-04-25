import { useState, useRef } from "react"

export default function Protection() {
  const [isRecording, setIsRecording] = useState(false)
  const [videoURL, setVideoURL] = useState(null)

  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunks = useRef([])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // iPhone back camera
        audio: true
      })

      videoRef.current.srcObject = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setVideoURL(url)
        chunks.current = []
      }

      mediaRecorder.start()
      setIsRecording(true)

    } catch (err) {
      alert("Erreur caméra : " + err.message)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current.stop()
    setIsRecording(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      color: "#fff",
      padding: "40px 20px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>

        <h1 style={{ fontSize: "28px", fontWeight: "600" }}>
          Certifier mon envoi
        </h1>

        <p style={{ color: "#888", marginTop: "8px" }}>
          Enregistrez une preuve vidéo horodatée.
        </p>

        {/* CARD CAMERA */}
        <div style={{
          marginTop: "24px",
          background: "#111",
          borderRadius: "16px",
          padding: "16px",
          border: "1px solid #1F1F1F"
        }}>

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              borderRadius: "12px",
              background: "#000"
            }}
          />

          {!isRecording ? (
            <button
              onClick={startCamera}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#fff",
                color: "#000",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Démarrer la caméra
            </button>
          ) : (
            <button
              onClick={stopRecording}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#FF3B30",
                color: "#fff",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Stop & sauvegarder
            </button>
          )}
        </div>

        {/* VIDEO RESULT */}
        {videoURL && (
          <div style={{
            marginTop: "24px",
            background: "#111",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #1F1F1F"
          }}>
            <p style={{ marginBottom: "12px" }}>
              Vidéo enregistrée :
            </p>

            <video
              src={videoURL}
              controls
              style={{ width: "100%", borderRadius: "12px" }}
            />
          </div>
        )}

      </div>
    </div>
  )
}
