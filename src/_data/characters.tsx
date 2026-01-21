type Character = {
  kanji: string;
  translation: string;
  type?: ("scalable" | "colorable")[];
  color?: number;
};

export const characters: Character[] = [
  { kanji: "一", translation: "1" },
  { kanji: "二", translation: "2" },
  { kanji: "三", translation: "3" },
  { kanji: "四", translation: "4" },
  { kanji: "五", translation: "5" },
  { kanji: "六", translation: "6" },
  { kanji: "七", translation: "7" },
  { kanji: "八", translation: "8" },
  { kanji: "九", translation: "9" },
  { kanji: "十", translation: "10" },
  { kanji: "百", translation: "100" },
  { kanji: "千", translation: "1,000" },
  { kanji: "万", translation: "10,000" },
  { kanji: "億", translation: "100,000,000" },
  {
    kanji: "兆",
    translation: "1,000,000,000,000",
  },
  { kanji: "目", translation: "👁️ eye 👁️", type: ["scalable", "colorable"] },
  { kanji: "口", translation: "👄 mouth 👄", type: ["scalable", "colorable"] },
  { kanji: "耳", translation: "👂 ear 👂", type: ["scalable", "colorable"] },
  { kanji: "手", translation: "👋 hand 👋", type: ["scalable", "colorable"] },
  { kanji: "足", translation: "🦶 foot 🦶", type: ["scalable", "colorable"] },
  { kanji: "火", translation: "🔥 fire 🔥", type: ["colorable"] },
  { kanji: "水", translation: "💧 water 💧", type: ["colorable"] },
  { kanji: "木", translation: "🌳 tree 🌳", type: ["scalable", "colorable"] },
  { kanji: "日", translation: "☀️ sun ☀️" },
  { kanji: "空", translation: "sky" },
  { kanji: "山", translation: "⛰️ mountain ⛰️" },
  { kanji: "川", translation: "river" },
  { kanji: "森", translation: "forest" },
  { kanji: "花", translation: "🌷 flower 🌷", type: ["scalable", "colorable"] },
  { kanji: "坂", translation: "hill" },
  { kanji: "風", translation: "💨 wind 💨" },
  { kanji: "本", translation: "📘 book 📘", type: ["scalable", "colorable"] },
  { kanji: "車", translation: "🚙 car 🚙", type: ["scalable", "colorable"] },
  { kanji: "円", translation: "yen" },
  { kanji: "家", translation: "🏠 house 🏠", type: ["scalable", "colorable"] },
  { kanji: "電", translation: "⚡️ electric ⚡️" },
  { kanji: "色", translation: "🌈 color 🌈" },
  { kanji: "青", translation: "🔵 blue 🔵" },
  { kanji: "赤", translation: "🔴 red 🔴" },
  { kanji: "夜", translation: "🌃 evening 🌃" },
  { kanji: "朝", translation: "🌅 morning 🌅" },
  { kanji: "鳥", translation: "🦜 bird 🦜", type: ["scalable", "colorable"] },
  { kanji: "犬", translation: "🐶 dog 🐶", type: ["scalable", "colorable"] },
  { kanji: "猫", translation: "🐈 cat 🐈", type: ["scalable", "colorable"] },
  { kanji: "馬", translation: "🐴 horse 🐴", type: ["scalable", "colorable"] },
  { kanji: "大", translation: "big" },
  { kanji: "小", translation: "small" },
  { kanji: "母", translation: "mom", type: ["scalable", "colorable"] },
  { kanji: "父", translation: "dad", type: ["scalable", "colorable"] },
  { kanji: "卵", translation: "🍳 egg 🥚", type: ["scalable", "colorable"] },
];

for (let i = 0; i < characters.length; i++) {
  characters[i].color = Math.floor(i / 5) % 5;
}

export const ichiMods = {
  万: "一万",
  億: "一億",
  兆: "一兆",
};

export function addIchiMod(s: string) {
  for (const [k, v] of Object.entries(ichiMods)) s = s.replace(k, v);
  return s;
}

export const issenException = "一千";

export const auxPre: Record<string, string> = {
  万: "一",
  億: "一",
  兆: "一",
};

export const auxPost: Record<string, string> = {
  大: "きい",
  小: "さい",
};

export const combinations: Character[] = [
  { kanji: "大きい", translation: "big" },
  { kanji: "小さい", translation: "small" },
  { kanji: "電車", translation: "🚂 train 🚂" },
  { kanji: "坂本", translation: "sakamoto" },
  { kanji: "日本", translation: "🇯🇵 japan 🗾" },
];

/*
Account for combinations with size adjectives when preparing
possible translations and audio files
*/
for (const x of [
  ["大きな", "big "],
  ["小さな", "small "],
]) {
  for (const y of characters) {
    if (y.type !== undefined && y.type.includes("scalable")) {
      combinations.push({
        kanji: `${x[0]}${y.kanji}`,
        translation: `${x[1]} ${y.translation}`,
      });
    }
  }
}

/*
Account for combinations with color adjectives when preparing
possible translations and audio files
*/
for (const x of [
  ["青い", "blue "],
  ["赤い", "red "],
]) {
  for (const y of characters) {
    if (y.type !== undefined && y.type.includes("colorable")) {
      combinations.push({
        kanji: `${x[0]}${y.kanji}`,
        translation: `${x[1]} ${y.translation}`,
      });
    }
  }
}

const scalable = [];
for (const c of characters) {
  if (c.type !== undefined && c.type.includes("scalable")) {
    scalable.push(c.kanji);
  }
}

const colorable = [];
for (const c of characters) {
  if (c.type !== undefined && c.type.includes("colorable")) {
    colorable.push(c.kanji);
  }
}

export interface mutationRules {
  matches: string[];
  deletions: number;
  newChars: string;
}
export const mutations: Record<string, mutationRules> = {
  大きい: {
    matches: scalable,
    deletions: 1,
    newChars: "な",
  },
  小さい: {
    matches: scalable,
    deletions: 1,
    newChars: "な",
  },
  赤: {
    matches: colorable,
    deletions: 0,
    newChars: "い",
  },
  青: {
    matches: colorable,
    deletions: 0,
    newChars: "い",
  },
};
