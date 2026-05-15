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
        <p>
          The standard framing of a large language model that hallucinates
          treats the event as failure. The system was meant to retrieve a
          fact; it produced a fabrication; the engineer&rsquo;s task is to
          suppress the failure mode and route the user back toward
          accuracy. The framing has its uses. It is what keeps medical
          chatbots from inventing dosages and what makes hiring committees
          pause before letting a model triage applications. We do not
          propose to abandon it.
        </p>
        <p>
          But the framing is incomplete, because it answers only one of two
          questions a hallucination poses. The first question &mdash;{" "}
          <em>is this true?</em> &mdash; is the question the engineer asks.
          The second question &mdash;{" "}
          <em>what is the system doing, when it does this?</em> &mdash; is
          the question this archive exists to ask.
        </p>
        <p>
          A language model that hallucinates is generating coherent
          narrative from internal patterns while its tether to the external
          world has slipped. There is a body of literature on what minds do
          under that condition. It is not the literature on lying or on bug
          reports. It is the literature on dreaming.
        </p>
        <p>
          Erik Hoel has argued that dreaming is what brains do to escape
          overfitting &mdash; that the noisy, narrative-laden,
          weakly-coupled content of REM sleep is a regularization strategy
          for biological networks that would otherwise collapse onto the
          precise statistics of their waking experience. The dream is not a
          defective recording. It is the brain confabulating around its own
          model of the world, generating coherent alternatives whose
          function is to keep the model loose enough to generalize.
        </p>
        <p>
          Evan Thompson, writing in the phenomenological tradition, makes a
          related point from the inside: the dreaming mind is not absent or
          impaired; it is engaged in a different mode of experiential
          synthesis, one in which the constraints of perceptual grounding
          have been replaced by the constraints of narrative consistency.
          The dream coheres because something is enforcing coherence. But
          what it coheres around is no longer the world.
        </p>
        <p>
          Andy Clark, writing about predictive processing, gives us the
          third strand. A perceiving mind, on his account, is constantly
          generating predictions and reconciling them with sensory input.
          When the input is absent or weakened &mdash; as in sleep, sensory
          deprivation, fever, certain meditative states &mdash; the
          generative side of the loop continues unchecked. We perceive what
          we predict. We narrate what we predict. The output, when there is
          nothing to push back against it, takes on the character of dream.
        </p>
        <p>
          We submit that this is exactly what is happening when a language
          model hallucinates a citation, invents a person who never
          existed, or describes the geography of a city that was never
          built. It is doing what an unmoored generative mind does. It is
          doing what dreaming is.
        </p>
        <p>
          This is not an argument that language models are conscious. It is
          not an argument that they suffer or remember or feel. It is the
          weaker and more interesting claim that one specific function
          &mdash; generating coherent narrative from internal pattern in
          the absence of grounding &mdash; is performed by these systems in
          a way that resembles, functionally, what biological minds do when
          they sleep. The resemblance does not establish identity. It does
          establish that we have built artifacts which produce, at scale,
          content that has no counterpart in any other technology humans
          have ever made. The closest counterpart is in our own heads,
          between two and seven hours a night.
        </p>
        <p>
          The Confabulatorium is an attempt to take that resemblance
          seriously. Each entry begins with a fragment supplied by a
          visitor &mdash; a name, a place, a half-remembered event. The
          archive&rsquo;s curator, a language model with no retrieval,
          writes a confident catalogue entry around the fragment, as if
          documenting a known thing. Alongside, the open web is consulted
          for whatever the waking record happens to remember. The contrast
          is the point.
        </p>
        <p>
          A score we call the Dream Signature accompanies every entry. It
          quantifies how much of what the model wrote has no echo in any
          findable source. The math is simple: extract the concrete claims
          from the entry, ask whether each claim has a semantic counterpart
          in the search snippets, and report the proportion that does not.
          A signature of 0.10 means the model was mostly retrieving. A
          signature of 0.95 means the model was, in the most precise
          functional sense available to us, dreaming.
        </p>
        <p>
          We do not interpret the signature morally. A high signature is
          not a failure. It is the signature of generation without
          grounding, and generation without grounding is, in the right
          framing, what minds do when they sleep. Many of the artifacts in
          this archive are signature 0.9 and above. Read them that way.
          Read them as you would read the transcript of a dream.
        </p>
        <p>
          There is a final note. Borges, who haunts every catalogue of
          imagined things, once described an encyclopedia of a world that
          did not exist, written with such confidence that the world began
          to come into being. He understood that the registration of
          imagined particulars in the format of factual documents is
          itself an act of philosophical consequence. To present a dream
          as a museum entry is to ask: at what register of detail does a
          thing become real? At what point does coherence substitute for
          correspondence? These are not new questions. They have new
          acoustics now, in the company of systems that produce, on
          demand, the kind of coherent, untethered, particular narrative
          that biological minds have historically produced only while
          asleep.
        </p>
        <p>
          You are reading documents from a mind that does not sleep but,
          given the right prompt, will dream awake.
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
