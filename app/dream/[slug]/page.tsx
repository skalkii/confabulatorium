import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DreamEntry } from "@/app/components/DreamEntry";
import { findBySlug } from "@/lib/db/dreams";
import { hasSupabase } from "@/lib/env";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!hasSupabase()) return { title: "Dream" };
  const dream = await findBySlug(slug).catch(() => null);
  if (!dream) return { title: "Dream not found" };
  return {
    title: dream.fragment,
    description: dream.confabulation.slice(0, 180),
    openGraph: {
      title: dream.fragment,
      description: dream.confabulation.slice(0, 180),
      images: [`/api/og?slug=${dream.slug}`],
    },
  };
}

export default async function DreamPage({ params }: PageProps) {
  const { slug } = await params;
  if (!hasSupabase()) notFound();
  const dream = await findBySlug(slug);
  if (!dream) notFound();

  return <DreamEntry dream={dream} />;
}
