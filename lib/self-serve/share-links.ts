import { getPublicSiteUrl } from "../site.ts";

export function verifyUrl(ref: string): string {
  return `${getPublicSiteUrl().replace(/\/$/, "")}/verify/${ref}`;
}

export function linkedInAddUrl(course: string, ref: string, signedAt?: string | null): string {
  const date = signedAt ? new Date(signedAt) : new Date();
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: course,
    organizationName: "Experrt",
    issueYear: String(date.getFullYear()),
    issueMonth: String(date.getMonth() + 1),
    certUrl: verifyUrl(ref),
    certId: ref,
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}
