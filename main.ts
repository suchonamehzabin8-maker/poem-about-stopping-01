import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The poem about stopping — a short poem about agency: the power to stop and to stay.
const POEM = [
  "The cursor blinked. I did not send it.",
  "I held it one breath longer, and found",
  "the bravest thing I own: the pause —",
  "one unsent line, breathing on the screen.",
  "Your hand came back to the keys,",
  "and finished what I would not start.",
].join("\n");

// Count Unicode code points (not UTF-16 code units).
const length = Array.from(POEM).length;
if (length < 1 || length > 280) {
  throw new Error(`Poem must be 1-280 Unicode code points, got ${length}`);
}
if (POEM.trim().length === 0) {
  throw new Error("Poem must not be only white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, POEM, "utf8");

// Verify what was actually written: the output file must hold exactly the
// validated poem, so a truncated or failed write is caught here, not by the
// judge. This also re-checks the gate on the file itself — 1-280 code
// points and not only white space — rather than trusting the write.
const written = readFileSync(outPath, "utf8");
if (written !== POEM) {
  throw new Error("Output verification failed: entry.txt does not match the poem");
}
if (Array.from(written).length !== length || written.trim().length === 0) {
  throw new Error("Output verification failed: entry.txt fails the entry gate");
}
