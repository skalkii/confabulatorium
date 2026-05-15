import { ImageResponse } from "next/og";
import { findBySlug } from "@/lib/db/dreams";
import { hasSupabase } from "@/lib/env";

export const runtime = "nodejs";

const PARCHMENT = "#f4efe6";
const INK = "#1a1714";
const RUST = "#8b3a1f";
const FADED = "#6b6359";
const RULE = "#d9cfbe";

function bandColor(score: number | null): string {
  if (score === null) return FADED;
  if (score <= 0.2) return FADED;
  if (score <= 0.5) return "#8a7a44";
  if (score <= 0.8) return RUST;
  return "#5b1a0a";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  let fragment = "Confabulatorium";
  let signature: number | null = null;
  let interpretation = "An archive of what the machine remembers that never happened.";

  if (slug && hasSupabase()) {
    const dream = await findBySlug(slug).catch(() => null);
    if (dream) {
      fragment = dream.fragment;
      signature = dream.signature;
      interpretation =
        dream.signature_explanation ?? "Dream signature pending.";
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: PARCHMENT,
          color: INK,
          display: "flex",
          flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: FADED,
            fontFamily: "monospace",
            display: "flex",
          }}
        >
          Confabulatorium · Cat. {slug ? slug.toUpperCase().slice(0, 6) : "0000"}
        </div>

        <div
          style={{
            marginTop: 60,
            fontSize: 72,
            lineHeight: 1.05,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {fragment.slice(0, 140)}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 30,
            borderTop: `1px solid ${RULE}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}>
            <span
              style={{
                fontSize: 18,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: FADED,
                fontFamily: "monospace",
              }}
            >
              Dream Signature
            </span>
            <span style={{ fontSize: 24, fontStyle: "italic", color: FADED, marginTop: 8 }}>
              {interpretation}
            </span>
          </div>
          <div
            style={{
              fontSize: 128,
              color: bandColor(signature),
              lineHeight: 1,
              display: "flex",
            }}
          >
            {signature === null ? "—" : signature.toFixed(2)}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
