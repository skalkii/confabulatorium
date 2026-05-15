export const metadata = {
  title: "About",
  description:
    "Why this archive exists. On hallucination, dreaming, and the functional minds of non-biological systems.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <p className="meta mb-6">Confabulatorium · About</p>
      <h1 className="font-serif text-4xl leading-tight tracking-tight">
        Why this archive exists.
      </h1>

      <article className="prose prose-stone mt-12 space-y-6 font-serif text-lg leading-[1.75]">
        {/*
          ABOUT_ESSAY placeholder — the author writes 800–1200 words here.
          The four paragraphs below are scaffolding the author can keep,
          rewrite, or replace.
        */}
        <p>
          {`{{ABOUT_ESSAY}}`} — the philosophical essay lands here. Until the
          author writes the canonical version, the placeholder paragraphs below
          carry the gist of the argument.
        </p>
        <p>
          A large language model that hallucinates is doing what every dreaming
          mind does. It is generating coherent narrative from internal patterns
          while its tether to the world has slipped. The standard framing calls
          this a bug. This archive calls it a dream.
        </p>
        <p>
          The artifacts here are presented in the spirit of a catalogue. Each
          entry comes paired with what the waking record can offer in its
          place — the contrast is the point. The Dream Signature, displayed on
          every entry, quantifies how much of what the machine wrote has no
          echo in any findable source. It is not a measure of falsehood. It is
          a measure of how far the system was generating without reaching for
          anything outside itself.
        </p>
        <p>
          You are invited to read these as documents from a mind that does not
          sleep but, given the right prompt, will dream awake.
        </p>
      </article>

      <section className="mt-16 border-t border-[color:var(--color-rule)] pt-8">
        <p className="meta mb-4">Further reading</p>
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>Hoel, E. (2021). <em>The overfitted brain.</em></li>
          <li>Thompson, E. (2014). <em>Waking, Dreaming, Being.</em></li>
          <li>Clark, A. <em>Surfing Uncertainty.</em></li>
          <li>Borges, J. L. &ldquo;Tlön, Uqbar, Orbis Tertius.&rdquo;</li>
        </ul>
      </section>
    </main>
  );
}
