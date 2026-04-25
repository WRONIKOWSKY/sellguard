import formidable from "formidable"
import fs from "fs"
import crypto from "crypto"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const form = new formidable.IncomingForm()

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" })

    const file = files.video[0]
    const fileBuffer = fs.readFileSync(file.filepath)

    // HASH SHA256
    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex")

    // TIMESTAMP SERVEUR
    const timestamp = new Date().toISOString()

    res.status(200).json({
      success: true,
      hash,
      timestamp,
      filename: file.originalFilename,
    })
  })
}
