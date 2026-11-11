export const fortuneCookieStorageKey = 'biscoito-da-discordia:cycle:v1';

type Cycle = { remaining: string[]; used: string[] };
type CycleStorage = Pick<Storage, 'getItem' | 'setItem'>;

function shuffle(ids: readonly string[], random: () => number) {
  const order = [...ids];
  for (let index = order.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [order[index], order[other]] = [order[other], order[index]];
  }
  return order;
}

function isIdList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(id => typeof id === 'string');
}

export function createFortuneDrawer(
  getStorage: () => CycleStorage = () => window.localStorage,
  random = Math.random,
) {
  let cycle: Cycle = {remaining: [], used: []};
  let hasUnsavedDraws = false;

  return function draw(ids: readonly string[]): string | undefined {
    if (ids.length === 0) return;

    if (!hasUnsavedDraws) {
      try {
        const saved = JSON.parse(getStorage().getItem(fortuneCookieStorageKey) ?? 'null');
        if (isIdList(saved?.remaining) && isIdList(saved?.used)) cycle = saved;
      } catch {
        // Continue with the current cycle when storage is unavailable or invalid.
      }
    }

    const available = new Set(ids);
    const used = new Set(cycle.used);
    const remaining = [...new Set(cycle.remaining)].filter(id => available.has(id) && !used.has(id));
    const queued = new Set(remaining);
    remaining.push(...shuffle(ids.filter(id => !used.has(id) && !queued.has(id)), random));

    if (remaining.length === 0) {
      remaining.push(...shuffle(ids, random));
      if (remaining.length > 1 && remaining[0] === cycle.used[cycle.used.length - 1]) {
        const other = 1 + Math.floor(random() * (remaining.length - 1));
        [remaining[0], remaining[other]] = [remaining[other], remaining[0]];
      }
      cycle = {remaining, used: []};
    } else {
      cycle = {remaining, used: cycle.used};
    }

    const next = cycle.remaining.shift()!;
    cycle.used.push(next);
    try {
      getStorage().setItem(fortuneCookieStorageKey, JSON.stringify(cycle));
      hasUnsavedDraws = false;
    } catch {
      hasUnsavedDraws = true;
    }
    return next;
  };
}
