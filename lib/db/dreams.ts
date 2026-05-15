import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";
import { supabaseServer } from "@/lib/db/client";
import type { Dream, DreamInsert } from "@/lib/db/types";

const slugify = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 10);

export function hashFragment(fragment: string): string {
  return createHash("sha256")
    .update(fragment.trim().toLowerCase().replace(/\s+/g, " "))
    .digest("hex");
}

export function newSlug(): string {
  return slugify();
}

export async function findByFragmentHash(hash: string): Promise<Dream | null> {
  const { data, error } = await supabaseServer()
    .from("dreams")
    .select("*")
    .eq("fragment_hash", hash)
    .maybeSingle();
  if (error) throw error;
  return (data as Dream) ?? null;
}

export async function findBySlug(slug: string): Promise<Dream | null> {
  const { data, error } = await supabaseServer()
    .from("dreams")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as Dream) ?? null;
}

export async function insertDream(row: DreamInsert): Promise<Dream> {
  const { data, error } = await supabaseServer()
    .from("dreams")
    .insert(row)
    .select("*")
    .single();
  if (error) throw error;
  return data as Dream;
}

export async function updateDream(
  id: string,
  patch: Partial<Dream>,
): Promise<Dream> {
  const { data, error } = await supabaseServer()
    .from("dreams")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Dream;
}

export interface ListArchiveOpts {
  limit?: number;
  offset?: number;
  sort?: "signature" | "recent";
}

export async function listArchive({
  limit = 30,
  offset = 0,
  sort = "recent",
}: ListArchiveOpts = {}): Promise<Dream[]> {
  const q = supabaseServer()
    .from("dreams")
    .select("*")
    .eq("is_public", true)
    .eq("is_reviewed", true)
    .range(offset, offset + limit - 1);

  const ordered =
    sort === "signature"
      ? q.order("signature", { ascending: false, nullsFirst: false })
      : q.order("created_at", { ascending: false });

  const { data, error } = await ordered;
  if (error) throw error;
  return (data as Dream[]) ?? [];
}
