import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "AS Motor's";
const SITE_URL = (process.env.REACT_APP_SITE_URL || "https://as-motors.com").replace(/\/$/, "");

const ROUTE_META = {
  "/": {
    title: "AS Motor's | Location de voitures de luxe a Paris",
    description:
      "Decouvrez notre flotte de voitures de luxe a Paris. Reservation rapide et accompagnement premium.",
    robots: "index,follow",
  },
  "/vehicules": {
    title: "Vehicules disponibles | AS Motors",
    description:
      "Consultez nos vehicules premium disponibles a la location et trouvez le modele adapte a votre besoin.",
    robots: "index,follow",
  },
  "/contact": {
    title: "Contact | AS Motors",
    description:
      "Contactez AS Motors pour toute question, reservation ou demande de devis personnalise.",
    robots: "index,follow",
  },
  "/legal/mentions": {
    title: "Mentions legales | AS Motors",
    description: "Informations legales de l'editeur et de l'hebergeur du site AS Motors.",
    robots: "index,follow",
  },
  "/legal/privacy": {
    title: "Politique de confidentialite | AS Motors",
    description:
      "Consultez la politique de confidentialite d'AS Motors concernant la collecte et la protection de vos donnees.",
    robots: "index,follow",
  },
  "/legal/cookies": {
    title: "Politique de cookies | AS Motors",
    description: "Informations sur l'usage des cookies et vos choix de consentement.",
    robots: "index,follow",
  },
  "/legal/terms": {
    title: "CGU | AS Motors",
    description: "Conditions generales d'utilisation du site AS Motors et cadre contractuel des reservations.",
    robots: "index,follow",
  },
  "/admin": {
    title: "Espace admin | AS Motors",
    description: "Espace d'administration du site AS Motors.",
    robots: "noindex,nofollow",
  },
  "/login": {
    title: "Connexion | AS Motors",
    description: "Connectez-vous a votre compte AS Motors.",
    robots: "noindex,nofollow",
  },
  "/register": {
    title: "Inscription | AS Motors",
    description: "Creez votre compte AS Motors.",
    robots: "noindex,nofollow",
  },
  "/profile": {
    title: "Profil | AS Motors",
    description: "Gerer votre profil utilisateur AS Motors.",
    robots: "noindex,nofollow",
  },
};

const upsertMeta = (attr, key, content) => {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attr}='${key}']`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  let canonical = document.head.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", href);
};

const upsertJsonLd = (id, payload) => {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(payload);
};

const resolveRouteMeta = (pathname) => {
  if (pathname.startsWith("/vehicules/")) {
    return {
      title: "Detail vehicule | AS Motors",
      description: "Consultez les informations et disponibilites de ce vehicule premium.",
      robots: "index,follow",
    };
  }

  return (
    ROUTE_META[pathname] || {
      title: "AS Motor's | Location de voitures de luxe a Paris",
      description:
        "Decouvrez notre flotte de voitures de luxe a Paris. Reservation rapide et accompagnement premium.",
      robots: "index,follow",
    }
  );
};

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    const meta = resolveRouteMeta(pathname);
    const canonicalUrl = `${SITE_URL}${pathname || "/"}`;

    document.title = meta.title;

    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", meta.robots);
    upsertMeta("name", "googlebot", meta.robots);

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", canonicalUrl);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);

    upsertCanonical(canonicalUrl);

    upsertJsonLd("ld-as-motors-localbusiness", {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      name: "AS Motors",
      url: SITE_URL,
      image: `${SITE_URL}/logo_clair_transparent.png`,
      telephone: "+33783366760",
      email: "contact@as-motors.fr",
      address: {
        "@type": "PostalAddress",
        streetAddress: "15 rue du Louvre",
        postalCode: "75001",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
      sameAs: [
        "https://www.instagram.com/as_motors75/",
        "https://www.tiktok.com/@as.motors75",
        "https://www.snapchat.com/add/as_motors75",
      ],
    });
  }, [location]);

  return null;
};

export default SeoManager;
