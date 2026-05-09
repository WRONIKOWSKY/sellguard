// Utilitaire de compression photo côté front.
// Resize une image à maxWidth max + ré-encode en JPEG qualité donnée.
// Utilisé par /annonce et /litige pour rester sous la limite Next.js bodyParser
// (1 MB par défaut) et économiser des tokens Anthropic en input vision.
//
// Usage : compressImage(file, 1200, 0.75, (dataUrl) => { ... })
// Le callback reçoit la dataURL complète "data:image/jpeg;base64,XXXX".

export function compressImage(file, maxWidth, quality, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > maxWidth) {
        h = Math.round(h * maxWidth / w);
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
