// Loads the trophy list and roadmap from app/data (plain JSON, no network).
export async function loadData() {
  const [t, r] = await Promise.all([fetch('data/trophies.json'), fetch('data/roadmap.json')]);
  const trophies = (await t.json()).trophies;
  const roadmap = await r.json();
  return { trophies, roadmap };
}
