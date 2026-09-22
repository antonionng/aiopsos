import type { Metadata } from "next";
import Home from "./home-client";
import { ORGANISATION_LD } from "@/components/structured-data";
import { getPublicSiteUrl } from "@/lib/site";
import { withSiteShareImages, siteShareImage, siteOgImageUrl } from "@/lib/social-image";
const SHARE_TITLE = "Experrt | AI, Technology & Robotics Courses, AI LMS and AI Labs";
const SHARE_DESCRIPTION = "Self-paced online courses and trainer-led training in AI, technology, robotics and HR, with verifiable certificates. Plus an AI LMS for teams and AI Labs implementation.";
export const metadata: Metadata = withSiteShareImages({
  title: { absolute: SHARE_TITLE },
  description: SHARE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: SHARE_TITLE, description: SHARE_DESCRIPTION, siteName: "Experrt", url: "/", type: "website", images: [siteShareImage()] },
  twitter: { title: SHARE_TITLE, description: SHARE_DESCRIPTION, images: [siteOgImageUrl()] },
});
export default function Page() {
  const url = getPublicSiteUrl();
  const data = { "@context": "https://schema.org", "@graph": [
    { "@type": "EducationalOrganization", "@id": `${url}/#organisation`, name: "Experrt", url, logo: `${url}/icon.svg`, description: ORGANISATION_LD.description, areaServed: "GB", knowsAbout: ORGANISATION_LD.knowsAbout, sameAs: ["https://www.linkedin.com/company/yourexperrt/"] },
    { "@type": "WebSite", "@id": `${url}/#website`, name: "Experrt", url, inLanguage: "en-GB", publisher: { "@id": `${url}/#organisation` } }
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} /><Home /></>;
}
