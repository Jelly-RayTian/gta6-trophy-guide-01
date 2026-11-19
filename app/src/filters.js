// Filtering and spoiler logic: kind / grade / earned state / text search.
import { getState, isEarned } from './state.js';

export const filters = { kind: 'all', grade: 'all', state: 'all', q: '' };

// A story trophy's name/description/guide are hidden while the setting is on and it is not earned.
export const isHidden = (t) => getState().spoiler && t.spoiler && !isEarned(t.id);

export function matches(t) {
  if (filters.kind === 'missable' ? !t.missable : filters.kind !== 'all' && t.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
  if (filters.state === 'done' && !isEarned(t.id)) return false;
  if (filters.state === 'todo' && isEarned(t.id)) return false;
  const q = filters.q.trim().toLowerCase();
  if (q) {
    if (isHidden(t)) return false; // do not leak hidden text through search
    if (!(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
  }
  return true;
}
