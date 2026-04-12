import { createContext, useContext, useState } from "react";

export const T = {
  fr: {
    nav: { annonce: "Annonce", protection: "Protection", litige: "Litige" },
    home: {
      title: "La suite complète du revendeur professionnel",
      subtitle: "Annonces optimisées, protection légale avant envoi, et défense automatique contre les fraudes et litiges.",
      m1_title: "Générer une annonce", m1_desc: "Photo → titre, description, hashtags et prix optimisés pour Vinted, Depop, Grailed et plus.", m1_tag: "Gain de temps",
      m2_title: "Protéger mon envoi", m2_desc: "Certifie tes photos avant l'envoi avec horodatage numérique. Preuve légale inattaquable en cas de litige.", m2_tag: "Protection légale",
      m3_title: "Gérer un litige", m3_desc: "Analyse les photos de l'acheteur pour détecter une fraude IA. Génère ta réponse de défense automatiquement.", m3_tag: "Anti-fraude",
      beta: "Version Bêta", beta_sub: "Accès 100% gratuit pendant la phase de test",
    },
    annonce: {
      title: "Générer une annonce", subtitle: "Photo → annonces optimisées pour toutes les plateformes en 10 secondes.",
      photo_label: "Photo de l'article", photo_hint: "Clique ou glisse une photo", photo_sub: "L'IA identifie l'article automatiquement",
      condition_label: "État", extra_label: "Infos supplémentaires", extra_ph: "Marque, taille, couleur, défauts éventuels...",
      measures_label: "Ajouter les mesures", measures_hint: "recommandé", measures_ph: "Choisir le type de vêtement...",
      generate_btn: "Générer les annonces →", generating: "Analyse en cours...", back: "← Retour",
      ai_title: "Plateformes sélectionnées par l'IA pour cet article",
      ai_text: "Poster au bon endroit = vendre 2x plus vite et jusqu'à 40% plus cher. L'IA analyse la marque, le style et la valeur pour choisir où tes acheteurs se trouvent vraiment.",
      copy: "Copier", copied: "Copié ✓", title_l: "TITRE", desc_l: "DESCRIPTION", kw_l: "HASHTAGS / MOTS-CLÉS", tips_l: "CONSEILS POUR CETTE PLATEFORME",
      conditions: ["Neuf avec étiquette", "Neuf sans étiquette", "Très bon état", "Bon état", "Satisfaisant"],
    },
    protection: {
      title: "Protéger mon envoi", subtitle: "Enregistre une vidéo avec horodatage automatique — preuve solide en cas de litige.",
      video_tab: "🎥 Vidéo", photo_tab: "📷 Photos", recommended: "Recommandé",
      article_label: "Nom de l'article", article_ph: "Ex: Levi's Trucker Jacket Type 2 - Taille M",
      ref_label: "Référence commande", ref_ph: "Ex: Vinted #4829301", optional: "optionnel",
      activate: "Activer la caméra →", start: "⏺ Démarrer", stop: "⏹ Arrêter", download: "⬇️ Télécharger la preuve vidéo", redo: "Refaire", cancel: "Annuler",
      tips: "Filme l'article, l'étiquette, puis le colis emballé avec le bon de livraison visible. 30 secondes suffisent.",
      certified_title: "Envoi certifié !", certified_sub: "Ta preuve vidéo horodatée a été téléchargée. Conserve ce fichier précieusement.",
      guide_title: "COMMENT UTILISER CETTE PREUVE PAR PLATEFORME", new_btn: "Protéger un autre envoi",
    },
    litige: {
      title: "Gérer un litige", subtitle: "L'IA analyse la situation, détecte les fraudes et génère ta réponse de défense.",
      type_label: "Type de litige", msg_label: "Message de l'acheteur", msg_ph: "Colle ici le message exact de l'acheteur ou le motif du litige...",
      photos_label: "Photos envoyées par l'acheteur", photos_hint: "optionnel — détection fraude", photos_add: "+ Ajouter les photos de l'acheteur",
      cert_label: "Référence certificat SellGuard", cert_ph: "Ex: SG-ABC123XYZ", cert_hint: "si tu as certifié l'envoi",
      analyze_btn: "Analyser et défendre →", analyzing: "Analyse en cours...", back: "← Retour",
      fraud_label: "Détection fraude", verdict_l: "ANALYSE DE LA SITUATION", args_l: "TES ARGUMENTS DE DÉFENSE",
      response_l: "RÉPONSE À ENVOYER", steps_l: "PROCHAINES ÉTAPES", copy: "Copier", copied: "Copié ✓",
      types: ["Article non conforme à la description", "Article prétendument endommagé", "Mauvaise couleur / taille", "Article prétendument non reçu", "Autre"],
    }
  },
  en: {
    nav: { annonce: "Listing", protection: "Protection", litige: "Dispute" },
    home: {
      title: "The complete suite for professional resellers",
      subtitle: "Optimized listings, legal protection before shipping, and automatic defense against fraud and disputes.",
      m1_title: "Generate a listing", m1_desc: "Photo → title, description, hashtags and optimized prices for Vinted, Depop, Grailed and more.", m1_tag: "Time saver",
      m2_title: "Protect my shipment", m2_desc: "Certify your photos before shipping with digital timestamping. Unassailable legal proof in case of dispute.", m2_tag: "Legal protection",
      m3_title: "Handle a dispute", m3_desc: "Analyze buyer photos to detect AI fraud. Automatically generates your defense response.", m3_tag: "Anti-fraud",
      beta: "Beta Version", beta_sub: "100% free during the testing phase",
    },
    annonce: {
      title: "Generate a listing", subtitle: "Photo → optimized listings for all platforms in 10 seconds.",
      photo_label: "Item photo", photo_hint: "Click or drag a photo here", photo_sub: "AI identifies the item automatically",
      condition_label: "Condition", extra_label: "Additional info", extra_ph: "Brand, size, color, any defects...",
      measures_label: "Add measurements", measures_hint: "recommended", measures_ph: "Choose garment type...",
      generate_btn: "Generate listings →", generating: "Analyzing...", back: "← Back",
      ai_title: "Platforms selected by AI for this item",
      ai_text: "Posting in the right place = sell 2x faster and up to 40% more. AI analyzes brand, style and value to find where your buyers actually are.",
      copy: "Copy", copied: "Copied ✓", title_l: "TITLE", desc_l: "DESCRIPTION", kw_l: "HASHTAGS / KEYWORDS", tips_l: "TIPS FOR THIS PLATFORM",
      conditions: ["New with tags", "New without tags", "Very good condition", "Good condition", "Fair condition"],
    },
    protection: {
      title: "Protect my shipment", subtitle: "Record a timestamped video — solid proof in case of a dispute.",
      video_tab: "🎥 Video", photo_tab: "📷 Photos", recommended: "Recommended",
      article_label: "Item name", article_ph: "Ex: Levi's Trucker Jacket Type 2 - Size M",
      ref_label: "Order reference", ref_ph: "Ex: Vinted #4829301", optional: "optional",
      activate: "Activate camera →", start: "⏺ Start recording", stop: "⏹ Stop", download: "⬇️ Download video proof", redo: "Redo", cancel: "Cancel",
      tips: "Film the item, the label, then the sealed package with the shipping label visible. 30 seconds is enough.",
      certified_title: "Shipment certified!", certified_sub: "Your timestamped video proof has been downloaded. Keep this file safe.",
      guide_title: "HOW TO USE THIS PROOF BY PLATFORM", new_btn: "Protect another shipment",
    },
    litige: {
      title: "Handle a dispute", subtitle: "AI analyzes the situation, detects fraud and generates your defense response.",
      type_label: "Dispute type", msg_label: "Buyer's message", msg_ph: "Paste the buyer's exact message or dispute reason here...",
      photos_label: "Photos sent by buyer", photos_hint: "optional — fraud detection", photos_add: "+ Add buyer's photos",
      cert_label: "SellGuard certificate reference", cert_ph: "Ex: SG-ABC123XYZ", cert_hint: "if you certified the shipment",
      analyze_btn: "Analyze and defend →", analyzing: "Analyzing...", back: "← Back",
      fraud_label: "Fraud detection", verdict_l: "SITUATION ANALYSIS", args_l: "YOUR DEFENSE ARGUMENTS",
      response_l: "RESPONSE TO SEND", steps_l: "NEXT STEPS", copy: "Copy", copied: "Copied ✓",
      types: ["Item not as described", "Item allegedly damaged", "Wrong color / size", "Item allegedly not received", "Other"],
    }
  }
};

const LangContext = createContext({ lang: "fr", t: T.fr, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState("fr");
  return <LangContext.Provider value={{ lang, t: T[lang], setLang }}>{children}</LangContext.Provider>;
}

export function useLang() { return useContext(LangContext); }
