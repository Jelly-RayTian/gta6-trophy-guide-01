// Renders the checklist rows.
import { isEarned } from './state.js';
import { isHidden, matches } from './filters.js';

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const iconHtml = (g) => `<span class="icon i-${g}" title="${g}">${{ platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' }[g]}</span>`;
export const missBadge = (t) => (t.missable ? '<span class="badge b-miss" title="Can be missed">MISSABLE</span>' : '');

export function renderList(ul, trophies, selectedId) {
  const shown = trophies.filter(matches);
  ul.innerHTML = shown.map((t) => {
    const hid = isHidden(t);
    return `<li class="row ${isEarned(t.id) ? 'done' : ''} ${t.id === selectedId ? 'sel' : ''}" data-id="${t.id}">
      <input type="checkbox" data-check="${t.id}" ${isEarned(t.id) ? 'checked' : ''} aria-label="Earned: ${hid ? 'hidden trophy' : esc(t.name)}">
      ${iconHtml(t.grade)}
      <div><h3>${hid ? '???' : esc(t.name)}${missBadge(t)}<span class="badge b-kind">${t.kind}</span>${t.count ? `<span class="badge b-cnt">${t.count}</span>` : ''}</h3>
      <p>${hid ? 'Hidden until earned (spoiler setting on)' : esc(t.description)}</p></div></li>`;
  }).join('') || '<li class="empty">No trophies match these filters.' + (filters_kindOnline() ? ' The official list has no online trophies.' : '') + '</li>';
  return shown.length;
}
import { filters } from './filters.js';
const filters_kindOnline = () => filters.kind === 'online';
