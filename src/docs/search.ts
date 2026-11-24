import MOODS from "./moods.json";

const moods: Record<string, string[]> = MOODS;

// One typo allowed (insert, delete, substitute, swap two neighbours) between a and b.
function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else if (a[i] === b[j + 1] && a[i + 1] === b[j]) { i += 2; j += 2; }
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function wordMatches(word: string, token: string) {
  if (token.startsWith(word)) return true; // "moon" → "moonlit"
  if (word.length >= 4 && word.startsWith(token) && token.length >= 3) return true; // "waves" → "wave"
  return word.length >= 4 && withinOneEdit(word, token); // "nigth" → "night"
}

const tokensOf = (name: string) => [
  ...name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().split(" "),
  ...(moods[name] ?? []).flatMap((t) => [t, ...t.split("-")]),
];

// ponytail: tag + fuzzy match, no embeddings. Misses synonyms nobody tagged ("peaceful ocean evening"
// only works because those words are tags). Upgrade path: build-time embeddings + in-browser model.
export function searchComponents<T extends { name: string }>(items: T[], query: string): T[] {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);
  if (!words.length) return items;
  const scored = items.map((item, order) => {
    const tokens = tokensOf(item.name);
    const score = words.filter((w) => tokens.some((t) => wordMatches(w, t))).length;
    return { item, order, score };
  });
  // drop the long tail: "calm night water" shouldn't list everything tagged just "calm"
  const min = Math.max(1, Math.ceil(Math.max(...scored.map((r) => r.score)) / 2));
  return scored
    .filter((r) => r.score >= min)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((r) => r.item);
}
