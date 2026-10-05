import NextLink from "next/link";
import type { ComponentProps } from "react";

/** next/link without background prefetch: behind the Mertia Labs multi-zone proxy prefetch requests 404 (same as Asterism). */
export function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
