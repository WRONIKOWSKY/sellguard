export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  var body = req.body;
  var imageBase64 = body.imageBase64;
  var imageMime = body.imageMime;
  var condition = body.condition;
  var extra = body.extra;
  var lang = body.lang || "fr";

  var prompt;
  if (lang === "en") {
    prompt = "You are an expert in online fashion reselling. Analyze this item and respond ONLY in valid JSON without markdown. ALL text values MUST be in English.\n\nCondition: " + condition + "\n" + (extra ? "Info: " + extra : "") + "\n" + (imageBase64 ? "Analyze the photo to precisely identify the item (exact brand, exact model, reference if visible)." : "") + "\n\nJSON:\n{\n  \"item_name\": \"Very precise name e.g.: Levi's Trucker Jacket Type 2 Size M\",\n  \"item_category\": \"Precise category\",\n  \"platforms\": [\n    { \"name\": \"Vinted\", \"score\": 9, \"reason\": \"Why this platform in 1 sentence in English\", \"price_min\": 15, \"price_max\": 25 }\n  ],\n  \"best_platform\": \"Best platform name\",\n  \"title\": \"SHORT simple title: Type + Brand only, max 4-5 words. Ex: Polo Balenciaga, Carhartt Detroit Jacket, Nike Dunk Low. NEVER add condition or filler words.\",\n  \"description\": \"Selling description 4-5 natural and precise sentences in English, including measurements if provided\",\n  \"keywords\": [\"word1\",\"word2\",\"word3\",\"word4\",\"word5\",\"word6\"],\n  \"selling_tips\": [\"Tip 1 in English\", \"Tip 2 in English\", \"Tip 3 in English\"],\n  \"time_to_sell\": \"e.g.: 3-7 days\"\n}\n\nAVAILABLE PLATFORMS: Vinted, Depop, Grailed, Vestiaire Collective, Etsy.\nSelect exactly 3 platforms based on item type:\n\nEVERYDAY FASHION (t-shirts, jeans, dresses, common sneakers):\n→ 1. Vinted  2. Depop  3. Etsy\n\nSTREETWEAR / HYPE (Supreme, Palace, Nike SB, Jordan, Stone Island, Stussy, Carhartt...):\n→ 1. Grailed  2. Depop  3. Vinted\n\nPREMIUM / DESIGNER (Acne, Ami, A.P.C., Isabel Marant, Sandro...):\n→ 1. Vestiaire Collective  2. Depop  3. Grailed\n\nLUXURY (Gucci, Prada, Louis Vuitton, Hermes, Balenciaga, Bottega...):\n→ 1. Vestiaire Collective  2. Grailed  3. Etsy\n\nAUTHENTIC VINTAGE (60s-90s, workwear, military, archive...):\n→ 1. Depop  2. Etsy  3. Grailed\n\nHYPE SNEAKERS / COLLAB:\n→ 1. Grailed  2. Depop  3. Vinted\n\nACCESSORIES / LEATHER GOODS:\n→ 1. Vestiaire Collective  2. Depop  3. Etsy\n\nScore out of 10. Realistic prices for the current French/European market in euros. ALL text must be in English.";
  } else {
    prompt = "Tu es un expert en revente de mode en ligne. Analyse cet article et réponds UNIQUEMENT en JSON valide sans markdown.\n\nÉtat : " + condition + "\n" + (extra ? "Infos : " + extra : "") + "\n" + (imageBase64 ? "Analyse la photo pour identifier précisément l'article (marque exacte, modèle exact, référence si visible)." : "") + "\n\nJSON :\n{\n  \"item_name\": \"Nom très précis ex: Levi's Trucker Jacket Type 2 Taille M\",\n  \"item_category\": \"Catégorie précise\",\n  \"platforms\": [\n    { \"name\": \"Vinted\", \"score\": 9, \"reason\": \"Pourquoi cette plateforme en 1 phrase\", \"price_min\": 15, \"price_max\": 25 }\n  ],\n  \"best_platform\": \"Nom de la meilleure plateforme\",\n  \"title\": \"Titre COURT et simple : Type + Marque uniquement, max 4-5 mots. Ex: Polo Balenciaga, Veste Carhartt Detroit, Nike Dunk Low. JAMAIS ajouter état ou mots inutiles.\",\n  \"description\": \"Description vendeuse 4-5 phrases naturelles et précises, incluant les mesures si fournies\",\n  \"keywords\": [\"mot1\",\"mot2\",\"mot3\",\"mot4\",\"mot5\",\"mot6\"],\n  \"selling_tips\": [\"Conseil 1\", \"Conseil 2\", \"Conseil 3\"],\n  \"time_to_sell\": \"Ex: 3-7 jours\"\n}\n\nPLATEFORMES DISPONIBLES : Vinted, Depop, Grailed, Vestiaire Collective, Etsy.\nSélectionne exactement 3 plateformes selon le type d'article :\n\nMODE QUOTIDIENNE (t-shirts, jeans, robes, baskets courantes) :\n→ 1. Vinted  2. Depop  3. Etsy\n\nSTREETWEAR / HYPE (Supreme, Palace, Nike SB, Jordan, Stone Island, Stüssy, Carhartt...) :\n→ 1. Grailed  2. Depop  3. Vinted\n\nMODE PREMIUM / DESIGNER (Acne, Ami, A.P.C., Isabel Marant, Sandro...) :\n→ 1. Vestiaire Collective  2. Depop  3. Grailed\n\nLUXE (Gucci, Prada, Louis Vuitton, Hermès, Balenciaga, Bottega...) :\n→ 1. Vestiaire Collective  2. Grailed  3. Etsy\n\nVINTAGE AUTHENTIQUE (années 60-90, workwear, militaire, archive...) :\n→ 1. Depop  2. Etsy  3. Grailed\n\nSNEAKERS HYPE / COLLAB :\n→ 1. Grailed  2. Depop  3. Vinted\n\nACCESSOIRES / MAROQUINERIE :\n→ 1. Vestiaire Collective  2. Depop  3. Etsy\n\nScore sur 10. Prix réalistes marché français actuel.";
  }

  var content = imageBase64
    ? [{ type: "image", source: { type: "base64", media_type: imageMime, data: imageBase64 } }, { type: "text", text: prompt }]
    : [{ type: "text", text: prompt }];

  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1400, messages: [{ role: "user", content: content }] })
    });
    var data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API error");
    var text = data.content.map(function(b) { return b.text || ""; }).join("");
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
