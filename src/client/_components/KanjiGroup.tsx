export type Character = { kanji: string; translation: string };

type KanjiStyle = "main" | "aux";
type GroupPart = { kanji: string; style: KanjiStyle };

export class KanjiGroup {
  key: string;
  group: GroupPart[];

  constructor(g: string) {
    this.key = g;
    this.group = [{ kanji: g, style: "main" }];
  }

  push(k: string, s: KanjiStyle) {
    this.group.push({ kanji: k, style: s });
  }

  asString() {
    let s = "";
    for (const g of this.group) {
      s += g;
    }
    return s;
  }

  asHTML() {
    let s = "";
    for (const g of this.group) {
      s += `<span class='kanji-${g.style}'>${g.kanji}</span>`;
    }
    return s;
  }
}
