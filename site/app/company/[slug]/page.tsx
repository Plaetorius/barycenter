import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityView } from "@/components/entity/entity-view";
import { getAllEntityIds, getEntity } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEntityIds().filter((e) => e.kind === "company").map((e) => ({ slug: e.id }));
}

export async function generateMetadata({ params }: PageProps<"/company/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntity(slug);
  return { title: e?.org.name ?? "Not found" };
}

export default async function Page({ params }: PageProps<"/company/[slug]">) {
  const { slug } = await params;
  const entity = getEntity(slug);
  if (!entity) notFound();
  return <EntityView entity={entity} />;
}
