import type { Metadata } from "next";
import { DESCRIPTION, NAME, PROJECTS, SOCIALS } from "@/lib/data";

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://minimal-portfolio-template-by-lokesh.vercel.app/",
);
export const SEO_NAME = NAME.replace(/👋/gu, "").trim();
export const SITE_TITLE = SEO_NAME + " | AI Design Engineer";
export const SITE_DESCRIPTION = DESCRIPTION;

const socialImage = {
  url: "/og-03-collage.png",
  width: 1730,
  height: 909,
  alt: SEO_NAME + " — Design Engineer, illustrated avatar on a blue paper collage",
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = path === "/" ? SITE_TITLE : title + " | " + SEO_NAME;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_TITLE,
      type: "website",
      locale: "en_US",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@ShipItLokesh",
      title: fullTitle,
      description,
      images: [socialImage],
    },
  };
}

export const PROJECTS_DESCRIPTION = "Explore " + SEO_NAME + "’s projects: " +
  PROJECTS.map((project) => project.title).join(", ") +
  ". Thoughtful interfaces, AI-powered tools, and full-stack web applications.";

export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": new URL("/#person", SITE_URL).href,
  name: SEO_NAME,
  url: SITE_URL.href,
  image: new URL("/avatar.jpg", SITE_URL).href,
  jobTitle: "AI Design Engineer",
  description: SITE_DESCRIPTION,
  sameAs: SOCIALS.map((social) => social.href),
};
