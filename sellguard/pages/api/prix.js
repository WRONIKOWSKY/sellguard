export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  var body = req.body;
  var item = body.item;
  var condition = body.condition;
  var lang = body.lang || "fr";

  if (!item || !item.trim()) return res.status(400).json({ error: "Item name required" });

  var prompt;
  if (lang === "en") {
    prompt = "You are an expert in online reselling. Analyze the current market for this item and respond ONLY in valid JSON without markdown.\n\nItem: " + item + "\nCondition: " + (condition || "Not specified") + "\n\nJSON:\n{\n  \"item_name\": \"Exact item name\",\n  \"price_min\": 15,\n  \"price_max\": 45,\n  \"price_optimal\": 30,\n  \"demand\": \"high | medium | low\",\n  \"trend\": \"rising | stable | declining\",\n  \"trend_detail\": \"One sentence explanation\",\n  \"platforms\": [\n    {\n      \"name\": \"Vinted\",\n      \"price_min\": 12,\n      \"price_max\": 35,\n      \"avg_price\": 22,\n      \"sell_time\": \"3-7 days\",\n      \"tip\": \"Short tip for this platform in English\"\n    }\n  ],\n  \"advice\": \"Global advice to maximize the price in 2 sentences in English\"\n}\n\nRULES:\n- Include 3-5 relevant platforms among: Vinted, Depop, Grailed, Vestiaire Collective, eBay, Leboncoin, Rakuten, Etsy, Facebook Marketplace.\n- Realistic prices in euros based on the current French/European market.\n- Choose platforms based on item type (luxury → Vestiaire, streetwear → Grailed, etc.).\n- sell_time = realistic average selling time estimate.\n- ALL text values must be in English.";
  } else {
    prompt = "Tu es un expert en revente en ligne. Analyse le marche actuel pour cet article et reponds UNIQUEMENT en JSON valide sans markdown.\n\nArticle : " + item + "\nEtat : " + (condition || "Non precise") + "\n\nJSON :\n{\n  \"item_name\": \"Nom exact de l'article\",\n  \"price_min\": 15,\n  \"price_max\": 45,\n  \"price_optimal\": 30,\n  \"demand\": \"haute | moyenne | basse\",\n  \"trend\": \"hausse | stable | baisse\",\n  \"trend_detail\": \"Explication en 1 phrase\",\n  \"platforms\": [\n    {\n      \"name\": \"Vinted\",\n      \"price_min\": 12,\n      \"price_max\": 35,\n      \"avg_price\": 22,\n      \"sell_time\": \"3-7 jours\",\n      \"tip\": \"Conseil court pour cette plateforme\"\n    }\n  ],\n  \"advice\": \"Conseil global pour maximiser le prix en 2 phrases\"\n}\n\nREGLES :\n- Inclure 3-5 plateformes pertinentes parmi : Vinted, Depop, Grailed, Vestiaire Collective, eBay, Leboncoin, Rakuten, Etsy, Facebook Marketplace.\n- Prix realistes du marche francais actuel en euros.\n- Choisis les plateformes selon le type d'article (luxe → Vestiaire, streetwear → Grailed, etc.).\n- sell_time = estimation realiste du delai de vente moyen.";
  }

  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
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
    var data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API error");
    var text = data.content.map(function(b) { return b.text || ""; }).join("");
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
