// Tracker state: earned trophies, counters and settings, persisted in localStorage; export/import as JSON.
const KEY = 'leonida-legend-v1';
const blank = () => ({ earned: {}, counts: {}, spoiler: false });
let state = blank();

export function loadState() {
  try { state = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { state = blank(); }
  return state;
}
export const getState = () => state;
export function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
export const isEarned = (id) => !!state.earned[id];
export function setEarned(id, on) { if (on) state.earned[id] = true; else delete state.earned[id]; save(); }
export function setCount(id, n) { state.counts[id] = Math.max(0, Number(n) || 0); save(); }
export function setSpoiler(on) { state.spoiler = !!on; save(); }
export function resetState() { state = blank(); save(); }

export function exportJson() {
  return JSON.stringify({ app: 'leonida-legend', version: 1, exportedAt: new Date().toISOString(), ...state }, null, 1);
}
export function importJson(text) {
  const d = JSON.parse(text);
  if (d.app !== 'leonida-legend' || typeof d.earned !== 'object' || d.earned === null) throw new Error('Not a Leonida Legend progress file');
  state = { earned: d.earned, counts: d.counts && typeof d.counts === 'object' ? d.counts : {}, spoiler: !!d.spoiler };
  save();
}
