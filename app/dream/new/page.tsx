import { GenerateForm } from "@/app/components/GenerateForm";

export const metadata = {
  title: "Submit a fragment",
  robots: { index: false, follow: false },
};

export default function NewDreamPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-14 md:px-6 md:py-20">
      <p className="meta mb-6">Confabulatorium · Submission</p>
      <h1 className="font-serif text-h1 tracking-tight lg:text-[2.75rem]">
        Give me something half-remembered.
      </h1>
      <p className="mt-4 text-body italic text-faded">
        A name. A place. A person. An event. The thinner the thread, the deeper
        the dream.
      </p>

      <div className="mt-10 md:mt-12">
        <GenerateForm />
      </div>

      <div className="mt-14 border-t border-rule pt-6 md:mt-16">
        <p className="meta mb-3">Rules of submission</p>
        <ul className="space-y-1 text-small leading-relaxed text-faded">
          <li>· The archive refuses entries about identifiable living people.</li>
          <li>· Same fragment returns the same dream; the first writing is canonical.</li>
          <li>· Generation takes a few seconds. The signature lands shortly after.</li>
        </ul>
      </div>
    </main>
  );
}
