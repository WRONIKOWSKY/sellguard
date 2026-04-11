export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { imageBase64, imageMime, condition, extra } = req.body;

  const prompt = `Tu es un expert en revente de mode en ligne. Analyse cet article et réponds UNIQUEMENT en JSON valide sans markdown.

État : ${condition}
${extra ? "Infos : " + extra : ""}
${imageBase64 ? "Analyse la photo pour identifier précisément l'article (marque exacte, modèle exact, référence si visible)." : ""}

JSON :
{
  "item_name": "Nom très précis ex: Levi's Trucker Jacket Type 2 Taille M",
  "item_category": "Catégorie précise",
  "platforms": [
    { "name": "Vinted", "score": 9, "reason": "Pourquoi cette plateforme en 1 phrase", "price_min": 15, "price_max": 25 }
  ],
  "best_platform": "Nom de la meilleure plateforme",
  "title": "Titre annonce max 60 caractères",
  "description": "Description vendeuse 4-5 phrases naturelles et précises, incluant les mesures si fournies",
  "keywords": ["mot1","mot2","mot3","mot4","mot5","mot6"],
  "selling_tips": ["Conseil 1", "Conseil 2", "Conseil 3"],
  "time_to_sell": "Ex: 3-7 jours"
}

PLATEFORMES DISPONIBLES : Vinted, Depop, Grailed, Vestiaire Collective, Etsy.
Sélectionne exactement 3 plateformes selon le type d'article :

MODE QUOTIDIENNE (t-shirts, jeans, robes, baskets courantes) :
→ 1. Vinted  2. Depop  3. Etsy

STREETWEAR / HYPE (Supreme, Palace, Nike SB, Jordan, Stone Island, Stüssy, Carhartt...) :
→ 1. Grailed  2. Depop  3. Vinted

MODE PREMIUM / DESIGNER (Acne, Ami, A.P.C., Isabel Marant, Sandro...) :
→ 1. Vestiaire Collective  2. Depop  3. Grailed

LUXE (Gucci, Prada, Louis Vuitton, Hermès, Balenciaga, Bottega...) :
→ 1. Vestiaire Collective  2. Grailed  3. Etsy

VINTAGE AUTHENTIQUE (années 60-90, workwear, militaire, archive...) :
→ 1. Depop  2. Etsy  3. Grailed

SNEAKERS HYPE / COLLAB :
→ 1. Grailed  2. Depop  3. Vinted

ACCESSOIRES / MAROQUINERIE :
→ 1. Vestiaire Collective  2. Depop  3. Etsy

Score sur 10. Prix réalistes marché français actuel.`;

  const content = imageBase64
    ? [{ type: "image", source: { type: "base64", media_type: imageMime, data: imageBase64 } }, { type: "text", text: prompt }]
    : [{ type: "text", text: prompt }];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: 1400, messages: [{ role: "user", content }] })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erreur API");
    const text = data.content.map(b => b.text || "").join("");
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
