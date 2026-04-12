export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { item, condition } = req.body;

  if (!item || !item.trim()) return res.status(400).json({ error: "Item name required" });

  const prompt = `Tu es un expert en revente en ligne. Analyse le marche actuel pour cet article et reponds UNIQUEMENT en JSON valide sans markdown.

Article : ${item}
Etat : ${condition || "Non precise"}

JSON :
{
  "item_name": "Nom exact de l'article",
  "price_min": 15,
  "price_max": 45,
  "price_optimal": 30,
  "demand": "haute | moyenne | basse",
  "trend": "hausse | stable | baisse",
  "trend_detail": "Explication en 1 phrase",
  "platforms": [
    {
      "name": "Vinted",
      "price_min": 12,
      "price_max": 35,
      "avg_price": 22,
      "sell_time": "3-7 jours",
      "tip": "Conseil court pour cette plateforme"
    }
  ],
  "advice": "Conseil global pour maximiser le prix en 2 phrases"
}

REGLES :
- Inclure 3-5 plateformes pertinentes parmi : Vinted, Depop, Grailed, Vestiaire Collective, eBay, Leboncoin, Rakuten, Etsy, Facebook Marketplace.
- Prix realistes du marche francais actuel en euros.
- Choisis les plateformes selon le type d'article (luxe → Vestiaire, streetwear → Grailed, etc.).
- sell_time = estimation realiste du delai de vente moyen.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API error");
    const text = data.content.map(function(b) { return b.text || ""; }).join("");
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
