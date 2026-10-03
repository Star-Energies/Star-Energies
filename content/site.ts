import { routes, quoteRoute } from "./routes";
import type { SiteSettings } from "@/types/content";

/** Canonical business settings used by the public site and admin console. */
export const siteSettings = {
  businessName: "Star Energies",
  brandName: "STAR ENERGIES",
  tagline: "Industrial coal. Sourced to requirement.",
  shortDescription: "Requirement-led industrial coal sourcing and supply across Wani, Chandrapur and Nagpur.",
  footerDescription: "Requirement-led industrial coal sourcing and supply across Wani, Chandrapur and Nagpur.",
  footerMeta: "Industrial coal supply · India",
  contact: {
    phoneDisplay: "+91 91566 42098",
    phoneHref: "tel:+919156642098",
    secondaryPhoneDisplay: "+91 91851 17100",
    secondaryPhoneHref: "tel:+919185117100",
    whatsappHref: "https://wa.me/919185117100",
    email: "contact@starenergies.in",
    emailHref: "mailto:contact@starenergies.in",
    isPlaceholder: false,
  },
  address: {
    display: "Wani · Chandrapur · Nagpur, Maharashtra, India",
    city: "Wani",
    district: "Multiple locations",
    state: "Maharashtra",
    country: "India",
  },
  primaryQuoteCTA: { label: "Request a Quote", href: quoteRoute, intent: "quote" },
  secondaryContactCTA: { label: "WhatsApp", href: "https://wa.me/919185117100", intent: "whatsapp", external: true },
  defaultSeo: {
    title: "Star Energies | Industrial Coal, Sourced to Requirement",
    description: "Requirement-led industrial coal sourcing and supply across Wani, Chandrapur and Nagpur, Maharashtra.",
    canonicalPath: routes.home,
  },
  logo: {
    assetId: "star-energies-wordmark",
    altText: "Star Energies",
  },
  navigation: [
    { route: "home", label: "Home" },
    { route: "about", label: "About" },
    { route: "coal", label: "Coal & Products" },
    { route: "industries", label: "Industries" },
    { route: "capabilities", label: "Capabilities" },
    { route: "operations", label: "Operations" },
    { route: "contact", label: "Contact" },
  ],
} satisfies SiteSettings;
