type KanjiStyle = "main" | "aux";
type GroupPart = { key: string; kanji: string; style: KanjiStyle };

let keyItr = 0;

export default class KanjiGroup {
  key: string;
  segments: GroupPart[];

  constructor(g: string) {
    this.key = "grouping-" + keyItr++;
    this.segments = [{ key: `segment-${keyItr++}`, kanji: g, style: "main" }];
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
}
