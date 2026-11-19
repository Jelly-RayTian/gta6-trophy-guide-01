// Leonida Legend build entry (Node 22, standard library only).
// The guide is the static app/ folder; this program stages it for hand-in: it copies app/ and screenshots/ into the
// output directory and writes dossier.json with the vendored make.fun library (vendor/ is the kit's copy, unchanged).
//   MAKEFUN_OUTPUT_DIR=out node main.ts      (the grader uses /output)
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Refuse to hand in a trophy file that lost a guide or a source: a cheap guard before copying anything.
const data = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const bad = data.trophies.filter((t: { guide?: string; source?: string }) => !t.guide?.trim() || !t.source?.trim());
if (data.trophies.length !== 55 || bad.length > 0) {
  console.error(`trophies.json: expected 55 guided, sourced trophies, got ${data.trophies.length} with ${bad.length} lacking one`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const caps = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 };
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, caps));
console.log(`handed in ${data.trophies.length} trophies to ${outDir}`);
