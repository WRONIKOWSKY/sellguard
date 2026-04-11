export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { imageBase64, imageMime, condition, extra } = req.body;

  const prompt = `Tu es un expert en revente en ligne. Analyse cet article et réponds UNIQUEMENT en JSON valide sans markdown.

État : ${condition}
${extra ? "Infos : " + extra : ""}
${imageBase64 ? "Analyse la photo pour identifier précisément l'article (marque exacte, modèle exact, référence si visible)." : ""}

JSON :
{
  "item_name": "Nom très précis ex: Levi's Trucker Jacket Type 2 Taille M",
  "item_category": "Catégorie",
  "platforms": [
    { "name": "Vinted", "score": 9, "reason": "Pourquoi en 1 phrase", "price_min": 15, "price_max": 25 }
  ],
  "best_platform": "Meilleure plateforme",
  "title": "Titre annonce max 60 caractères",
  "description": "Description vendeuse 4-5 phrases naturelles et précises",
  "keywords": ["mot1","mot2","mot3","mot4","mot5"],
  "selling_tips": ["Conseil 1", "Conseil 2", "Conseil 3"],
  "time_to_sell": "Ex: 3-7 jours"
}

Inclure 3-4 plateformes parmi : Vinted (fringues/chaussures), Vestiaire Collective (luxe/premium), Leboncoin (meubles/électro/divers), Rakuten (livres/jeux/high-tech), eBay (tout), Facebook Marketplace (local). Score /10. Prix réalistes marché français actuel.`;

  const content = imageBase64
    ? [{ type: "image", source: { type: "base64", media_type: imageMime, data: imageBase64 } }, { type: "text", text: prompt }]
    : [{ type: "text", text: prompt }];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: 1200, messages: [{ role: "user", content }] })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erreur API");
    const text = data.content.map(b => b.text || "").join("");
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
