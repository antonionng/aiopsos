import type { Metadata } from "next";
import Home from "./home-client";
import { getPublicSiteUrl } from "@/lib/site";
import { withSiteShareImages, siteShareImage, siteOgImageUrl } from "@/lib/social-image";
const SHARE_TITLE = "Experrt | Learning Platform, Academy & AI Labs";
const SHARE_DESCRIPTION = "Build capability with our agentic learning platform and academy. Build AI systems, technology products, robotics and HR transformation with Experrt AI Labs.";
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
    { "@type": "Organization", "@id": `${url}/#organisation`, name: "Experrt", url, logo: `${url}/icon.svg`, sameAs: ["https://www.linkedin.com/company/yourexperrt/"] },
    { "@type": "WebSite", "@id": `${url}/#website`, name: "Experrt", url, publisher: { "@id": `${url}/#organisation` } }
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} /><Home /></>;
}
