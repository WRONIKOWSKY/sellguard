import { useState, useRef } from "react"

export default function Protection() {
  const [isRecording, setIsRecording] = useState(false)
  const [videoURL, setVideoURL] = useState(null)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunks = useRef([])

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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
  }

  const stopRecording = () => {
    mediaRecorderRef.current.stop()
    setIsRecording(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "40px 20px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>

        <h1>Certifier mon envoi</h1>
        <p style={{ color: "#888" }}>
          Enregistrez une preuve vidéo horodatée.
        </p>

        {/* VIDEO PREVIEW */}
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: "100%", borderRadius: "12px", marginTop: "20px" }}
        />

        {!isRecording ? (
          <button onClick={startCamera} style={{ marginTop: "20px", padding: "12px", width: "100%" }}>
            Démarrer la caméra
          </button>
        ) : (
          <button onClick={stopRecording} style={{ marginTop: "20px", padding: "12px", width: "100%", background: "red", color: "#fff" }}>
            Stop & sauvegarder
          </button>
        )}

        {/* VIDEO RESULT */}
        {videoURL && (
          <div style={{ marginTop: "20px" }}>
            <p>Vidéo enregistrée :</p>
            <video src={videoURL} controls style={{ width: "100%", borderRadius: "12px" }} />
          </div>
        )}

      </div>
    </div>
  )
}
