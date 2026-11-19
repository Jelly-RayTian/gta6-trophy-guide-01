// Merges our authored guide data onto the official trophy list (names, descriptions, grades stay byte-identical).
// Run: node tools/build-data.mjs   (reads ref/kit/starter's list, writes app/data/trophies.json and app/data/roadmap.json)
import { readFileSync, writeFileSync } from 'node:fs';

const official = JSON.parse(readFileSync(new URL('../ref/kit/starter/app/data/trophies.json', import.meta.url), 'utf8'));

const SRC_LIST = 'Official PS5 trophy list (PlayStation), as listed by Exophase and PSNProfiles: name, description and grade.';
const SRC_DESC = ' Method and missable risk: reasoned from the official description only; GTA VI has no published walkthrough, so no locations or steps are asserted.';

// id: [kind, missable, count|null, guide, missableReason|null]
const D = {
  1: ['story', false, null,
    'The platinum pops by itself once the other 54 trophies are earned, so there is nothing separate to do. Use the Roadmap view to order the work: story first, then collectibles, activities and cleanup. Any missable trophy you skip makes this one wait until you recover it.', null],
  2: ['story', false, null,
    'This is the opening mission named in the description, Gone Fishing, so it unlocks within your first session. It is the first story trophy and comes before any chapter trophy. It is on the list as a plain mission completion with no condition attached.', null],
  3: ['story', false, null,
    'Unlocks when the story reaches the end of Chapter 1; the description gives no other condition. Play the missions in order and it arrives on its own. If the game lets you replay missions this is not at risk, but the list does not say, so watch for chapter-bound side trophies as you go.', null],
  4: ['story', false, null,
    'Awarded for completing Chapter 2, the second story chapter. Nothing beyond finishing the chapter is stated. Note the name contains asterisks exactly as PlayStation publishes it: T**s Ass Drug Money.', null],
  5: ['story', false, null,
    'Awarded for completing Chapter 3. It follows Chapter 2 in order, so it is a pure story-progress trophy. The description sets no extra requirement.', null],
  6: ['story', false, null,
    'Awarded for completing Chapter 4. Chapters 1 to 4 give one bronze each; the final mission is a separate gold that comes later. It needs only story progress per the description.', null],
  7: ['story', false, null,
    'One of the two golds: it unlocks on the final mission, the end of the main story. Because it is the last story beat it is a good place to keep a manual save before you start it, in case the list later turns out to tie choice-based trophies to it. The description itself adds no condition.', null],
  8: ['story', false, null,
    'Complete the story mission Breakfast Run; the description asks for nothing else. It is a named mission, not a chapter ending, so it falls inside the main story. Finish it as it comes up and this unlocks.', null],
  9: ['story', false, null,
    'Complete the mission called The Cartel Heist. The description gives only the mission name, so treat it as a story-order trophy and clear it as the plot reaches it. Heists are one-off set pieces, so avoid abandoning it midway.', null],
  10: ['story', false, null,
    'Complete the mission Child\'s Play. This is a named story mission and unlocks on completion with no other condition stated. Do it in normal story order.', null],
  11: ['story', false, null,
    'Complete the mission Headliners. Only the mission name is given by the official description, so it is earned by normal story play. The name DWNFALL is spelled exactly as listed.', null],
  12: ['story', false, null,
    'Complete the mission VCIA Takedown. VCIA also appears in the Catch Me If You Can trophy, so the same location may matter twice. The description requires only completing the mission.', null],
  13: ['story', false, null,
    'Complete the mission Operation Savage Glory. It is a named story mission and unlocks on completion; no extra condition appears in the description. Do it as the story offers it.', null],
  14: ['activities', false, null,
    'Attain 100% Completion: the second gold, and the long end-game one. Per the description the game tracks a completion percentage, so this is the cleanup trophy to chase after the story and the other trophies. We cannot say what the percentage counts, so check the in-game completion screen once it is available.', null],
  15: ['collectibles', false, 250,
    'Complete 250 Stunts. It is a cumulative count, so it is not tied to any one moment and cannot be permanently missed. Use the counter in the detail panel to log your running total; a large count like this is best chipped away at between story missions.', null],
  16: ['activities', false, null,
    'Try each type of activity once. This is a variety trophy: open the activities list in-game, try one of every kind and it unlocks. It pairs naturally with the other activity trophies (Shooting Range, drone races, races, fishing, arcade), so do them together in the activities stage.', null],
  17: ['activities', false, 42,
    'Earn a gold medal in every Shooting Range challenge. The competition rules cite 42 as the count PlayStation tracks for this trophy, while the official description just says all of them. Retry challenges until each reads gold, there is no one-shot condition.', null],
  18: ['activities', false, null,
    'Win a Top Fun drone race at every location. That means one win per location, not repeated wins at one place. Visit each Top Fun location you discover and win its drone race; it is a free-roam activity you can return to.', null],
  19: ['activities', false, 20,
    'Win 20 different races. The word "different" matters: repeating one race does not count, so spread your wins over twenty distinct events. It is a cumulative free-roam trophy and not missable.', null],
  20: ['activities', false, null,
    'Beat Cal in a fishing challenge. Cal is named in the description, so look for the fishing challenge that involves him. It is an activity win and can be retried if you lose.', null],
  21: ['activities', false, null,
    'Complete an arcade game: any one counts, the description does not name a specific cabinet. Play an arcade cabinet to its end. It is a quick, low-risk trophy to take during the activities stage.', null],
  22: ['story', true, null,
    'Complete the final mission for Andy. "Final mission" means the last mission of Andy\'s own strand, so you must progress that strand to its end. Strand-specific finales can be time-limited or choice-linked, so it is flagged as a precaution.',
    'Tied to the end of one character\'s strand, which can be closed off by story progress; the list does not say it is replayable.'],
  23: ['story', true, null,
    'Complete the final mission for Kenton: the last mission in his strand. Begin his missions when they open and keep going until the finale. Flagged because it is tied to one character\'s storyline rather than a free-roam count.',
    'Tied to the end of one character\'s strand; can be locked by story progress.'],
  24: ['story', true, null,
    'Complete the final mission for Billy. As with the other character finales, it needs you to follow his strand through to its last mission. The description gives no deadline, but a one-character storyline is the kind of thing that can close.',
    'Tied to the end of one character\'s strand; can be locked by story progress.'],
  25: ['collectibles', true, 8,
    'Complete 8 mission strands for strangers across the state of Leonida. Each strand is a chain of missions with one stranger, so you need eight separate chains finished. Because strands can be tied to story timing, start them early and keep a tally with the counter.',
    'Stranger strands may expire or lock as the story advances; the list gives no replay promise.'],
  26: ['story', true, null,
    'Complete the final mission for Randy, the last mission of his strand. Pursue his missions to the end whenever they unlock. Flagged because character finales are tied to a particular storyline.',
    'Tied to the end of one character\'s strand; can be locked by story progress.'],
  27: ['story', true, null,
    'Complete the final mission for Tyrone: the last mission in his strand. Start his chain when it appears and follow it through. Treated as missable for the same reason as the other character finales.',
    'Tied to the end of one character\'s strand; can be locked by story progress.'],
  28: ['collectibles', false, null,
    'Meditate at every spot across Leonida. This is a collection: each meditation spot must be visited, and the description says every spot, not a number. Spots are free-roam, so you can come back to them at any time.', null],
  29: ['activities', true, null,
    'Hunt a unique animal for Bret. The "for Bret" part suggests a mission or request from the character Bret, and the animal is described as unique, so it is probably a one-off target. Take the request as soon as it appears.',
    'A one-off unique animal tied to a named character\'s request.'],
  30: ['collectibles', false, 3,
    'Complete 3 Collectible Card sets. Collect cards until three whole sets are filled. It is cumulative and free-roam, so it cannot be locked out; log each finished set with the counter.', null],
  31: ['collectibles', false, 100,
    'WAiNK It at 100 locations. WAiNK is the game\'s own action name, so read the description literally: use it at 100 distinct places. It is a long cumulative count suited to free-roam, with the counter to log progress.', null],
  32: ['activities', false, 50,
    'Complete 50 Challenges. Challenges are the game\'s repeatable objectives, and this trophy needs fifty completions in total. It accumulates across the whole playthrough, so just keep an eye on the count.', null],
  33: ['activities', true, null,
    'Lose a 4 star Wanted Level with your partner and escape the heat. You need the partner alongside you, and a 4 star level reached, then to shake the police with them. Because partner availability may depend on story progress, try it as soon as a partner is with you.',
    'Needs your partner present, which may only be possible at some points in the story.'],
  34: ['activities', true, 3,
    'Rob 3 shops back-to-back with your partner without losing your Wanted Level. Three robberies in a row with the partner, and the Wanted Level must hold between them, so plan a route of nearby shops. It needs the partner like Hot Together does, so it is flagged as a precaution.',
    'Needs your partner present, which may only be possible at some points in the story.'],
  35: ['collectibles', false, 100,
    'Discover 100 vehicles. This is a collection count: you find vehicles, and each new model counts. It is cumulative and free-roam, so it cannot be missed, only slow.', null],
  36: ['activities', false, 5,
    'Take down 5 enemies in a single use of Combat Focus. Activate Combat Focus once and drop five enemies before it ends. Do it in any gunfight with several enemies; if you fall short, retry.', null],
  37: ['activities', true, null,
    'Make an unscheduled departure at VCIA. The airport is named in the description and "unscheduled" implies leaving without a flight, probably in an aircraft you should not have. The exact method is not in the description, so check in-game hints; it may depend on being able to reach the airport in free-roam.',
    'A one-off stunt event at a named location; method not stated.'],
  38: ['activities', true, null,
    'The description is a joke: "Kinda hot in these Rhinos". Rhino is a tank in the series, so it likely involves a tank, but the list gives no method. We make no claim about how; treat it as a hidden-event trophy and watch for a tank encounter.',
    'Cryptic description; no stated method, so it may be tied to a specific event.'],
  39: ['activities', false, null,
    'Rob a jewelry store without being detected. Stealth is the requirement: no one may notice you during the robbery. Retry if alarms trigger; the store is a free-roam target.', null],
  40: ['activities', false, 5,
    'Rob 5 Bank Vaults and escape. Each counts only when you also get away, so a failed escape does not count. Keep the counter for your successes; it is cumulative.', null],
  41: ['activities', false, null,
    'Rob an Armored Truck and escape. One robbery, and you must also get away. Armored trucks are a free-roam target, so it can be retried.', null],
  42: ['collectibles', false, null,
    'Explore all of Leonida. This is the broad exploration trophy: the description gives no breakdown, so it is likely tracked by the map. Roam the whole state and check the map for undiscovered areas.', null],
  43: ['activities', false, null,
    'Rob an Illegal Operation belonging to each gang. One operation per gang, so you need to learn which gangs exist. Do one for each; repeats of the same gang do not help.', null],
  44: ['activities', true, null,
    'Enjoy a cocktail with a view on Ocean Beach. Ocean Beach is the location; drink a cocktail while looking at the view. The exact spot or sequence is not in the description. The name hints at the opening, so try early.',
    'The name hints at an early-game moment; the list gives no timing.'],
  45: ['activities', true, null,
    'Smash your way out of a vehicle showroom in classic style. Try breaking out of a showroom in a vehicle rather than walking out. The description does not say which showroom or when, so try it once the showrooms are open.',
    'A one-off stunt event at a showroom; the list gives no timing.'],
  46: ['activities', true, null,
    'Follow-through at the Kolt & Associates\' bowling alley: the description is a pun and points to bowling at that venue. Bowl at the Kolt & Associates alley. The location might be part of a story mission, so try it when it first opens.',
    'Location may be tied to a story mission; method not stated.'],
  47: ['activities', true, null,
    'The description, "A partnership with mass appeal", is cryptic. It probably relates to the partner, but the list does not say how. We cannot offer a method; treat it as a hidden trophy tied to your partnership.',
    'Cryptic description; likely tied to a story or partner event.'],
  48: ['story', true, null,
    '"Choices made (for better or worse)" suggests a story choice. This is flagged as missable because a decision can usually only be made once in a playthrough. Make a save before major story decisions so that you can reload.',
    'Appears to depend on a story decision, which may be unrepeatable.'],
  49: ['story', true, null,
    '"Second time\'s the charm" suggests a retry of something, or a second attempt at an event. The list does not say what. We treat it as a one-off event and flag it as missable.',
    'Cryptic; likely a one-off event.'],
  50: ['story', true, null,
    '"What the hell just happened?" is a cryptic description of what sounds like a strange event. We cannot say what; it may be a one-off story or world event. Keep an eye out for an unusual occurrence.',
    'Cryptic; probably a one-off event.'],
  51: ['activities', true, null,
    'Bowl \'em over with a melee drive-by: a drive-by with a melee weapon, probably at bowling pins or a bowling alley. It likely ties to the Kolt & Associates bowling alley, but the list does not say so. Try it after you find the alley.',
    'Possibly tied to the bowling alley location; method not stated.'],
  52: ['activities', false, 250000,
    'Earn $250,000 laundering Marked Bills through your contacts. This is a cumulative money total. Marked Bills are the dirty cash; launder them through the contacts. Use the counter to track dollars.', null],
  53: ['activities', false, 100000,
    'Spend $100,000 across all shops. This is a cumulative spend total across any shop. Buy things you want anyway until it adds up.', null],
  54: ['collectibles', false, null,
    'Purchase all garage properties. Buy every garage property, which needs cash. Do it once you have money; it is not time-limited per the description.', null],
  55: ['activities', false, 10,
    'Register 10 vehicles to the Scooter Bros app. Ten registrations in total. It is a cumulative count; register vehicles as you acquire them.', null],
};

const trophies = official.trophies.map((t) => {
  const d = D[t.id];
  if (!d) throw new Error('missing data for ' + t.id);
  const [kind, missable, count, guide, why] = d;
  const out = { ...t, kind, missable, spoiler: t.id >= 2 && t.id <= 13 };
  if (count) out.count = count;
  out.guide = guide;
  out.source = SRC_LIST + SRC_DESC;
  if (missable) out.missableReason = why;
  return out;
});

const n = (id) => official.trophies.find((t) => t.id === id).name;
const stage = (title, note, ids) => ({ title, note, trophies: ids.map(n) });
const roadmap = {
  intro: 'Order built from the official trophy descriptions only. The list does not give mission order, so named missions are grouped, not sequenced.',
  stages: [
    stage('1. Prologue', 'The opening mission.', [2]),
    stage('2. Story chapters 1 to 4', 'Chapter trophies, in chapter order.', [3, 4, 5, 6]),
    stage('3. Named story missions', 'These land inside the chapters; do them as the story offers them.', [8, 9, 10, 11, 12, 13]),
    stage('4. Story choices and strange events', 'Missable and cryptic: save before big decisions.', [48, 49, 50, 47]),
    stage('5. Character strands and strangers', 'Finish each strand while it is open.', [22, 23, 24, 26, 27, 25, 29]),
    stage('6. Story-linked one-offs', 'Missable moments and partner trophies.', [44, 45, 46, 51, 37, 38, 33, 34]),
    stage('7. Final mission', 'The end of the main story, the second gold.', [7]),
    stage('8. Collectibles with counts', 'Free-roam counts; use the counters.', [28, 30, 31, 35, 15, 42]),
    stage('9. Activities', 'Variety, medals, races and wins.', [16, 17, 18, 19, 20, 21, 32, 36]),
    stage('10. Crime and money', 'Robberies and totals.', [39, 40, 41, 43, 52, 53, 54, 55]),
    stage('11. Cleanup and platinum', '100% completion, then the platinum.', [14, 1]),
  ],
};
const seen = roadmap.stages.flatMap((s) => s.trophies);
if (new Set(seen).size !== 55) throw new Error('roadmap covers ' + new Set(seen).size);

writeFileSync(new URL('../app/data/trophies.json', import.meta.url), JSON.stringify({ ...official, trophies }, null, 1));
writeFileSync(new URL('../app/data/roadmap.json', import.meta.url), JSON.stringify(roadmap, null, 1));
console.log('wrote', trophies.length, 'trophies,', roadmap.stages.length, 'stages');
