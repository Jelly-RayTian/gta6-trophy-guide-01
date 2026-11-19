// Entry point: loads data, wires events, re-renders on change.
import { loadData } from './data.js';
import { loadState, getState, setEarned, setSpoiler, setCount, resetState, exportJson, importJson } from './state.js';
import { filters } from './filters.js';
import { renderSummary } from './summary.js';
import { renderList } from './list.js';
import { renderDetail } from './detail.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const $ = (id) => document.getElementById(id);
let data, selected = null, view = 'trophies';

function render() {
  const { trophies, roadmap } = data;
  renderSummary($('summary'), trophies);
  const n = renderList($('list'), trophies, selected);
  $('shown').textContent = `${n} of ${trophies.length} shown`;
  renderDetail($('detail'), trophies.find((t) => t.id === selected));
  renderRoadmap($('view-roadmap'), roadmap, trophies);
  renderMissables($('view-missables'), trophies);
  $('spoiler').checked = getState().spoiler;
}
function show(v) {
  view = v;
  for (const id of ['trophies', 'roadmap', 'missables']) $('view-' + id).hidden = id !== v;
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
}
function open(id) { selected = id; show('trophies'); filters.kind = 'all'; $('f-kind').value = 'all'; render(); $('detail').scrollIntoView({ block: 'nearest' }); }
const say = (m) => { $('msg').textContent = m; setTimeout(() => ($('msg').textContent = ''), 4000); };

async function init() {
  data = await loadData();
  loadState();
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => show(b.dataset.view)));
  $('search').addEventListener('input', (e) => { filters.q = e.target.value; render(); });
  for (const [id, key] of [['f-kind', 'kind'], ['f-grade', 'grade'], ['f-state', 'state']]) $(id).addEventListener('change', (e) => { filters[key] = e.target.value; render(); });
  $('spoiler').addEventListener('change', (e) => { setSpoiler(e.target.checked); render(); });
  $('list').addEventListener('click', (e) => {
    const cb = e.target.closest('[data-check]');
    if (cb) { setEarned(Number(cb.dataset.check), cb.checked); render(); return; }
    const row = e.target.closest('.row');
    if (row) { selected = Number(row.dataset.id); render(); }
  });
  $('detail').addEventListener('change', (e) => { if (e.target.dataset.count) { setCount(Number(e.target.dataset.count), e.target.value); } });
  document.addEventListener('click', (e) => { const o = e.target.closest('[data-open]'); if (o && view !== 'trophies') open(Number(o.dataset.open)); });
  $('export').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([exportJson()], { type: 'application/json' }));
    a.download = 'leonida-legend-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
    say('Progress exported.');
  });
  $('import').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { importJson(await f.text()); render(); say('Progress imported.'); } catch (err) { say('Import failed: ' + err.message); }
    e.target.value = '';
  });
  $('reset').addEventListener('click', () => { if (confirm('Clear all saved progress?')) { resetState(); render(); } });
  render();
}
init();
