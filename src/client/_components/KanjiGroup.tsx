export type KanjiStyle =
  | "default"
  | "aux"
  | "theme-0"
  | "theme-1"
  | "theme-2"
  | "theme-3"
  | "theme-4";
type GroupPart = { key: string; kanji: string; style: KanjiStyle };

let keyItr = 0;
function uniqueKey() {
  return keyItr++;
}

export default class KanjiGroup {
  key: string;
  segments: GroupPart[] = [];

  constructor() {
    this.key = "grouping-" + uniqueKey();
  }

  pop() {
    this.segments.pop();
  }

  push(k: string, s: KanjiStyle) {
    this.segments.push({ key: `segment-${uniqueKey()}`, kanji: k, style: s });
  }

  asString() {
    let s = "";
    for (const g of this.segments) {
      s += g.kanji;
    }
    return s;
  }

  omitAux() {
    let s = "";
    for (const g of this.segments) {
      if (g.style !== "aux") s += g.kanji;
    }
    return s;
  }
}
