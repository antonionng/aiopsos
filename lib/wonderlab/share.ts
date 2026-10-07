/** Public brand artwork only. Never put a child's profile or creation in social metadata. */
export const wonderlabShare = {
  openGraph: {
    images: [
      {
        url: "/images/wonderlab/inventors.png",
        width: 1536,
        height: 1024,
        alt: "Wonderlab: an illustrated invention island for curious minds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    images: ["/images/wonderlab/inventors.png"],
  },
};
