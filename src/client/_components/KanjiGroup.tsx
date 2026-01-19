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

export default class KanjiGroup {
  key: string;
  segments: GroupPart[] = [];

  constructor() {
    this.key = "grouping-" + keyItr++;
  }

  push(k: string, s: KanjiStyle) {
    this.segments.push({ key: `segment-${keyItr++}`, kanji: k, style: s });
  }

  asString() {
    let s = "";
    for (const g of this.segments) {
      s += g.kanji;
    }
    return s;
  }

  kanjiOnly() {
    let s = "";
    for (const g of this.segments) {
      if (g.style !== "aux") s += g.kanji;
    }
    return s;
  }
}
