// Roadmap view (ordered stages) and Missables view (every missable with its reason).
import { isEarned } from './state.js';
import { isHidden } from './filters.js';
import { esc, iconHtml, missBadge } from './list.js';

export function renderRoadmap(el, roadmap, trophies) {
  const by = new Map(trophies.map((t) => [t.name, t]));
  el.innerHTML = `<p class="fine">${esc(roadmap.intro)}</p>` + roadmap.stages.map((s) => {
    const ts = s.trophies.map((n) => by.get(n));
    const done = ts.filter((t) => isEarned(t.id)).length;
    return `<div class="stage"><h3>${esc(s.title)} <span class="count">${done}/${ts.length}</span></h3><p>${esc(s.note)}</p>
      <ul>${ts.map((t) => `<li class="chip ${isEarned(t.id) ? 'done' : ''}" data-open="${t.id}">${iconHtml(t.grade)} ${isHidden(t) ? '???' : esc(t.name)}${missBadge(t)}</li>`).join('')}</ul></div>`;
  }).join('');
}

export function renderMissables(el, trophies) {
  const list = trophies.filter((t) => t.missable);
  el.innerHTML = `<p class="fine">${list.length} trophies are flagged. The list does not state which can be locked out, so each flag is reasoned from the official description: character-strand finales, one-off events, partner trophies and cryptic descriptions. Click one to open it.</p>` +
    list.map((t) => `<div class="mrow" data-open="${t.id}"><h3>${iconHtml(t.grade)} ${isHidden(t) ? '???' : esc(t.name)} ${missBadge(t)}</h3>
      <p>${isHidden(t) ? 'Hidden by spoiler setting.' : esc(t.description)}</p><p class="why"><b>Why:</b> ${esc(t.missableReason)}</p></div>`).join('');
}
