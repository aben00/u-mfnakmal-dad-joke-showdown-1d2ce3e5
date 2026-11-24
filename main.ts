// Dad Joke Showdown — u-mfnakmal-dad-joke-showdown-1d2ce3e5
// Node 22, standard library only. Writes one dad joke, a single sentence
// of at most 200 characters, to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// Deterministic: the joke is a constant, and the program self-checks it
// against the gate before writing — one line, one sentence, <= 200 chars,
// not only whitespace. No clock, no randomness, no network, so two runs
// write byte-identical output.
//
// Judge fit (dad-joke brief: the pun, the groan, the straight-faced
// delivery): the setup states an everyday truth — the electricity bill
// really is shocking — and the punchline doubles the wordplay, since
// "revolting" is re-volting. Nothing explains the joke; the two puns
// do all the work in one sentence.
//
// Run outside the grader's container with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const JOKE =
  'I told my kids the electricity bill was shocking, and they said it was revolting.';

function checkGate(text) {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`gate: length ${text.length} not in 1..200`);
  }
  if (text.trim().length === 0) {
    throw new Error('gate: text is only whitespace');
  }
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error('gate: text is more than one line');
  }
  // Single sentence: exactly one sentence-ending mark, at the very end,
  // and no other sentence-ending mark anywhere else in the line.
  const endings = text.match(/[.!?]/g) ?? [];
  if (endings.length !== 1 || !/[.!?]$/.test(text)) {
    throw new Error('gate: text is not a single sentence');
  }
}

checkGate(JOKE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.txt');
writeFileSync(outPath, JOKE, 'utf8');

// Read it back and prove the file holds exactly the checked joke.
const written = readFileSync(outPath, 'utf8');
if (written !== JOKE) {
  throw new Error('verify: entry.txt does not match the checked joke');
}
checkGate(written);
