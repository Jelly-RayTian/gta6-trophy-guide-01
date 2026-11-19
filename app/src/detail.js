// Detail panel: guide, source, grade, kind, missable reason, optional counter.
import { getState, isEarned, setCount } from './state.js';
import { isHidden } from './filters.js';
import { esc, iconHtml, missBadge } from './list.js';

export function renderDetail(el, t) {
  if (!t) { el.innerHTML = '<p class="empty">Click a trophy to see its guide, source and missable status.</p>'; return; }
  if (isHidden(t)) {
    el.innerHTML = `<h2>${iconHtml(t.grade)} ???</h2><div class="meta"><span class="badge b-kind">story</span></div>
      <p>Hidden by the spoiler setting. Turn it off, or earn the trophy, to read its name and guide.</p>`;
    return;
  }
  const n = getState().counts[t.id] || 0;
  el.innerHTML = `<h2>${iconHtml(t.grade)} ${esc(t.name)}</h2>
    <div class="meta"><span class="pill g-${t.grade}" style="border-color:currentColor">${t.grade}</span><span class="badge b-kind">${t.kind}</span>${missBadge(t)}${isEarned(t.id) ? '<span class="badge b-cnt">EARNED</span>' : ''}</div>
    <p><b>Official description:</b> ${esc(t.description)}</p>
    ${t.missable ? `<div class="why"><b>Why it can be missed:</b> ${esc(t.missableReason)}</div>` : '<p class="fine">Not flagged as missable: cumulative or repeatable per the description.</p>'}
    ${t.count ? `<div class="ctr">Progress: <input type="number" min="0" max="${t.count}" value="${n}" data-count="${t.id}" aria-label="Progress count"> / ${t.count}</div>` : ''}
    <p><b>Guide:</b> ${esc(t.guide)}</p>
    <div class="src"><b>Source:</b> ${esc(t.source)}</div>`;
}
