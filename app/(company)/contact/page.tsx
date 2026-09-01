import type { Metadata } from "next";
import { contactMetadata } from "@/lib/public-share-metadata";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = contactMetadata();

export default function ContactPage() {
  return <ContactForm />;
}
