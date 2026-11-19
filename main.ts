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

interface Trophy {
  id: number;
  name: string;
  description: string;
  grade: string;
  guide: string;
  source: string;
  missable?: boolean;
}

const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

function fail(message: string): never {
  console.error(`data check failed: ${message}`);
  process.exit(1);
}

// The data files are authored by hand, so refuse to hand in anything missing or malformed before copying a byte.
function readData(file: string): any {
  const path = join(here, 'app', 'data', file);
  if (!existsSync(path)) fail(`app/data/${file} is missing`);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    return fail(`app/data/${file} is not valid JSON (${(err as Error).message})`);
  }
}

const data = readData('trophies.json');
const roadmap = readData('roadmap.json');
if (!Array.isArray(data.trophies)) fail('trophies.json has no "trophies" array');
if (!Array.isArray(roadmap.stages)) fail('roadmap.json has no "stages" array');

const trophies: Trophy[] = data.trophies;
const names = new Set<string>();
trophies.forEach((t, i) => {
  const label = `trophies.json entry ${i + 1}${typeof t?.name === 'string' ? ` (${t.name})` : ''}`;
  for (const field of ['name', 'description', 'grade', 'guide', 'source'] as const) {
    if (typeof t?.[field] !== 'string' || t[field].trim() === '') fail(`${label} lacks a ${field}`);
  }
  if (!GRADES.includes(t.grade)) fail(`${label} has unknown grade "${t.grade}"`);
  if (names.has(t.name)) fail(`${label} duplicates a trophy name`);
  names.add(t.name);
});
if (trophies.length !== 55) fail(`expected 55 trophies, got ${trophies.length}`);

for (const stage of roadmap.stages) {
  for (const name of stage.trophies ?? []) {
    if (!names.has(name)) fail(`roadmap stage "${stage.title}" lists "${name}", which is not a trophy`);
  }
}

// Summary of what is being handed in: totals first, then each grade in tracker order (missable noted only when present).
const missableTotal = trophies.filter((t) => t.missable).length;
const byGrade = GRADES.map((g) => {
  const all = trophies.filter((t) => t.grade === g);
  const missable = all.filter((t) => t.missable).length;
  return `${g} ${all.length}${missable > 0 ? ` (${missable} missable)` : ''}`;
}).join(', ');
const summary = `${trophies.length} trophies, ${missableTotal} missable: ${byGrade}`;

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const caps = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 };
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, caps));
console.log(`handed in ${trophies.length} trophies to ${outDir}`);
console.log(`summary: ${summary}`);
