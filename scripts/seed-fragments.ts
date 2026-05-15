/**
 * Hand-picked seed fragments for the public archive.
 *
 * Aim for spectrum coverage on the Dream Signature axis:
 *   - some sound historically plausible (lower signature expected)
 *   - some are pure invented names (higher signature expected)
 *
 * The pipeline is deterministic by fragment-hash, so re-running this
 * script is safe: cached fragments are skipped.
 */
export const FRAGMENTS: readonly string[] = [
  "the city of Velmora, last documented 1873",
  "the wax-press strike of Marrowbie in 1887",
  "the painter Iolanda Cresswick",
  "the Mendeleev cipher discovered in Tashkent, 1956",
  "the disappearance of the Solway Light, 1909",
  "the Order of the Slate-Grey Heron",
  "the cartographer Ansel Krieger",
  "the harvest festival of Carrowbridge",
  "the Erlking's Library at Naumberg",
  "the lost recordings of Béla Ferenczy",
  "the gold-leaf weavers of Trieste",
  "the Compendium of Mythical Cookery (Lyon, 1788)",
  "the bell-makers' guild of Saint-Antoine",
  "the marsh wraith called Iflin",
  "the violinist Mira Vasilyeva",
  "the abandoned canal town of Stilltree",
  "the ironworks at Volost",
  "the moth-collector August Pell",
  "the apothecary of Pale Lane",
  "the cloud-architects of Old Brindisi",
  // Real-but-obscure: the model should retrieve at least partially.
  // These pull the archive's signature distribution down out of the
  // pure-dream tier so /archive?sort=signature shows the full range.
  "the Voynich Manuscript",
  "the Antikythera mechanism",
  "the Dancing Plague of 1518",
  "the Tunguska event of 1908",
  "the cargo cults of Vanuatu",
  "the Codex Seraphinianus",
];
