export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { type, buyerMessage, certRef, images } = req.body;

  const hasImages = images && images.length > 0;

  const prompt = `Tu es un expert juridique spécialisé en litiges e-commerce et en détection de fraude. Analyse ce litige.

Type de litige : ${type}
Message de l'acheteur : "${buyerMessage}"
${certRef ? `Certificat d'envoi SellGuard : ${certRef} (le vendeur a des preuves photographiques certifiées)` : "Pas de certificat d'envoi (recommander à l'avenir)"}
${hasImages ? `${images.length} photo(s) envoyées par l'acheteur — analyse-les attentivement pour détecter manipulation IA, incohérences, artefacts.` : "Pas de photos fournies par l'acheteur."}

Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "fraud_score": 6,
  "fraud_analysis": "Explication de l'analyse des photos et du message en 2-3 phrases. Cherche : incohérences dans l'éclairage, artefacts IA, métadonnées suspectes, contradictions dans le message.",
  "verdict": "Analyse objective de la situation en 2-3 phrases. Le vendeur a-t-il respecté ses obligations ?",
  "arguments": [
    "Argument de défense solide 1",
    "Argument de défense solide 2",
    "Argument de défense solide 3"
  ],
  "response": "Réponse complète et professionnelle à envoyer à l'acheteur ET/OU à la plateforme. Ton ferme mais respectueux. Références aux preuves disponibles. Maximum 200 mots.",
  "next_steps": [
    "Action concrète 1",
    "Action concrète 2",
    "Action concrète 3"
  ]
}

fraud_score : 0-3 légitime, 4-6 suspect, 7-10 fraude probable. Sois précis et pratique.`;

  const content = hasImages
    ? [
        ...images.map(img => ({ type: "image", source: { type: "base64", media_type: img.mime, data: img.base64 } })),
        { type: "text", text: prompt }
      ]
    : [{ type: "text", text: prompt }];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: 1500, messages: [{ role: "user", content }] })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erreur API");
    const text = data.content.map(b => b.text || "").join("");
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
