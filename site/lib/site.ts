/** Where the site lives and what it is called. Served under BASE_PATH (labs.mertia.xyz/barycenter). */
export const SITE_NAME = "Barycenter";
export const SITE_TAGLINE = "Who funds nuclear energy";
export const BASE_PATH = "/barycenter";
export const LABS_URL = "https://labs.mertia.xyz";
export const CONTACT_EMAIL = "tom.gernez@gmail.com";

/** Public files (public/…) need the base path when fetched by hand; next/link and next/image add it themselves. */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
