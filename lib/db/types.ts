export interface DreamMetadata {
  invented_dates?: string[];
  invented_sources?: string[];
  invented_witnesses?: string[];
  [key: string]: unknown;
}

export interface SearchSnippet {
  title: string;
  url: string;
  description: string;
}

export interface Dream {
  id: string;
  slug: string;
  fragment: string;
  fragment_hash: string;
  confabulation: string;
  metadata: DreamMetadata | null;
  search_snippets: SearchSnippet[] | null;
  signature: number | null;
  signature_explanation: string | null;
  model_used: string | null;
  is_public: boolean;
  is_reviewed: boolean;
  safety_score: number | null;
  created_at: string;
}

export type DreamInsert = Omit<Dream, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
