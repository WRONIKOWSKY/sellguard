import { createContext, useContext, useState } from "react";

export const T = {
  fr: {
    nav: { annonce: "Annonce", protection: "Protection", litige: "Litige", calculateur: "Calculateur", ventes: "Ventes", prix: "Prix" },
    home: {
      title: "La suite complète du revendeur professionnel",
      subtitle: "Annonces optimisées, protection légale avant envoi, et défense automatique contre les fraudes et litiges.",
      beta: "Version Bêta",
      beta_sub: "Accès 100% gratuit pendant la phase de test",
      m1_title: "Générer une annonce", m1_desc: "Photo → titre, description, hashtags et prix optimisés pour Vinted, Depop, Grailed et plus.", m1_tag: "Gain de temps",
      m2_title: "Protéger mon envoi", m2_desc: "Certifie tes photos avant l'envoi avec horodatage numérique. Preuve légale inattaquable en cas de litige.", m2_tag: "Protection légale",
      m3_title: "Gérer un litige", m3_desc: "Analyse les photos de l'acheteur pour détecter une fraude IA. Génère ta réponse de défense automatiquement.", m3_tag: "Anti-fraude",
      m4_title: "Calculateur", m4_desc: "Calcule tes frais, commissions et marges par plateforme pour fixer le bon prix de vente.", m4_tag: "Rentabilité",
      m5_title: "Mes ventes", m5_desc: "Retrouve l'historique de toutes tes annonces générées et suis tes ventes.", m5_tag: "Suivi",
      m6_title: "Comparer les prix", m6_desc: "Recherche les prix du marché pour un article sur toutes les plateformes en un clic.", m6_tag: "Prix marché",
    },
    prix: {
      title: "Comparer les prix",
      subtitle: "Entre un article et découvre son prix réel sur chaque plateforme.",
      item_label: "Nom de l'article",
      item_ph: "Ex: Nike Air Force 1 White - Taille 42",
      condition_label: "État",
      conditions: ["Neuf avec étiquettes", "Neuf sans étiquettes", "Très bon état", "Bon état", "État correct"],
      search_btn: "Rechercher les prix →",
      searching: "Recherche en cours...",
      range: "Fourchette de prix",
      avg: "Prix moyen",
      tip: "Conseil",
      back: "← Nouvelle recherche",
    },
  },
  en: {
    nav: { annonce: "Listing", protection: "Protection", litige: "Dispute", calculateur: "Calculator", ventes: "Sales", prix: "Prices" },
    home: {
      title: "The complete suite for professional resellers",
      subtitle: "Optimized listings, legal protection before shipping, and automatic defense against fraud and disputes.",
      beta: "Beta Version",
      beta_sub: "100% free access during the testing phase",
      m1_title: "Generate a listing", m1_desc: "Photo → title, description, hashtags and optimized prices for Vinted, Depop, Grailed and more.", m1_tag: "Time saver",
      m2_title: "Protect my shipment", m2_desc: "Certify your photos before shipping with digital timestamping. Unassailable legal proof in case of dispute.", m2_tag: "Legal protection",
      m3_title: "Handle a dispute", m3_desc: "Analyze buyer photos to detect AI fraud. Automatically generates your defense response.", m3_tag: "Anti-fraud",
      m4_title: "Calculator", m4_desc: "Calculate fees, commissions and margins per platform to set the right selling price.", m4_tag: "Profitability",
      m5_title: "My sales", m5_desc: "Find the history of all your generated listings and track your sales.", m5_tag: "Tracking",
      m6_title: "Compare prices", m6_desc: "Search real market prices for any item across all platforms in one click.", m6_tag: "Market prices",
    },
    prix: {
      title: "Compare prices",
      subtitle: "Enter an item and discover its real price on each platform.",
      item_label: "Item name",
      item_ph: "Ex: Nike Air Force 1 White - Size 9",
      condition_label: "Condition",
      conditions: ["New with tags", "New without tags", "Very good condition", "Good condition", "Fair condition"],
      search_btn: "Search prices →",
      searching: "Searching...",
      range: "Price range",
      avg: "Average price",
      tip: "Tip",
      back: "← New search",
    },
  }
};

const LangContext = createContext({ lang: "fr", t: T.fr, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState("fr");
  return <LangContext.Provider value={{ lang, t: T[lang], setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
