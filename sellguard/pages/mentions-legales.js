import Link from "next/link";
import LegalLayout from "../components/LegalLayout";

export default function MentionsLegales() {
  return (
    <LegalLayout
      title="Mentions légales"
      description="Mentions légales de SellCov — éditeur, hébergeur, propriété intellectuelle."
      frenchOnly
    >
      <h1 className="legal-title">Mentions légales.</h1>
      <p className="legal-subtitle">Dernière mise à jour : 3 mai 2026.</p>

      <div className="legal-content">
        <h2>Édition du site</h2>
        <p>Le site sellcov.com est édité à titre personnel, dans le cadre d'un projet en bêta privée.</p>
        <p>Le projet est en cours de structuration juridique.</p>
        <p>
          Pour toute demande, contact : <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>.
        </p>

        <h2>Hébergement</h2>
        <p>Le site est hébergé par :</p>
        <p>
          Vercel Inc.<br />
          340 S Lemon Ave #4133<br />
          Walnut, CA 91789<br />
          États-Unis<br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
        </p>

        <h2>Directeur de la publication</h2>
        <p>
          Le directeur de la publication peut être contacté à l'adresse{" "}
          <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble des contenus présents sur sellcov.com (textes, logos, visuels, code source) est protégé par le droit d'auteur et le droit des marques.</p>
        <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, par quelque moyen ou procédé que ce soit, est interdite sans autorisation écrite préalable.</p>

        <h2>Données personnelles</h2>
        <p>
          Le traitement de tes données personnelles est régi par notre{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>, conforme au Règlement Général sur la Protection des Données (RGPD).
        </p>

        <h2>Cookies</h2>
        <p>
          Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement (authentification, préférences). Plus d'informations dans la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>

        <h2>Droit applicable</h2>
        <p>Le site sellcov.com est soumis au droit français. Tout litige relatif à son utilisation relève de la compétence des tribunaux français.</p>
      </div>
    </LegalLayout>
  );
}
