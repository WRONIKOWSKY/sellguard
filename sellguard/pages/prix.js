export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { item, condition, lang } = req.body;
  if (!item) return res.status(400).json({ error: "Item required" });

  const isEn = lang === "en";
  const prompt = `Tu es un expert en revente de mode en ligne avec une connaissance parfaite des prix du marché en ${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.

Article : "${item}"
État : ${condition || "Bon état"}

Analyse le marché actuel et réponds UNIQUEMENT en JSON valide sans markdown :

{
  "market_price_min": 25,
  "market_price_max": 65,
  "sweet_spot": 45,
  "demand": "high",
  "trend": "up",
  "platforms": [
    {
      "name": "Vinted",
      "price_min": 25,
      "price_max": 45,
      "avg_time_to_sell": "3-7 jours",
      "tips": "Conseil spécifique pour cette plateforme"
    }
  ],
  "price_factors": [
    "Facteur qui influence le prix positivement ou négativement"
  ],
  "verdict": "Analyse courte du marché en 2 phrases"
}

Plateformes à inclure : Vinted, Depop, Grailed, Vestiaire Collective, Etsy (seulement celles pertinentes pour cet article, max 3).
demand: "high" | "medium" | "low"
trend: "up" | "stable" | "down"
Prix réalistes marché ${isEn ? "European" : "français"} actuel. Sois précis.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API Error");
    const text = data.content.map(b => b.text || "").join("");
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
