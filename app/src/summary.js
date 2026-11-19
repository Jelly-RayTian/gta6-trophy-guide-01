// Progress summary: count, percent, per-grade counts, bar.
import { isEarned } from './state.js';

export function renderSummary(el, trophies) {
  const done = trophies.filter((t) => isEarned(t.id));
  const pct = Math.round((done.length / trophies.length) * 100);
  const grades = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = trophies.filter((t) => t.grade === g);
    const n = all.filter((t) => isEarned(t.id)).length;
    return `<span class="pill g-${g}" style="border-color:currentColor">${g} ${n}/${all.length}</span>`;
  }).join(' ');
  el.innerHTML = `<span class="big">${done.length}/${trophies.length} · ${pct}%</span>
    <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>${grades}`;
}
