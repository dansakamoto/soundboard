type Character = {
  kanji: string;
  translation: string;
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
  { kanji: "目", translation: "👁️ eye" },
  { kanji: "口", translation: "👄 mouth" },
  { kanji: "耳", translation: "👂 ear" },
  { kanji: "手", translation: "👋 hand" },
  { kanji: "足", translation: "🦶 foot" },
  { kanji: "火", translation: "🔥 fire" },
  { kanji: "水", translation: "💧 water" },
  { kanji: "木", translation: "🌳 tree" },
  { kanji: "日", translation: "☀️ sun" },
  { kanji: "空", translation: "sky" },
  { kanji: "山", translation: "⛰️ mountain" },
  { kanji: "川", translation: "river" },
  { kanji: "森", translation: "forest" },
  { kanji: "花", translation: "🌷 flower" },
  { kanji: "坂", translation: "hill" },
  { kanji: "風", translation: "wind" },
  { kanji: "本", translation: "📘 book" },
  { kanji: "車", translation: "🚙 car" },
  { kanji: "円", translation: "yen" },
  { kanji: "家", translation: "🏠 house" },
  { kanji: "電", translation: "electric" },
  { kanji: "色", translation: "color" },
  { kanji: "青", translation: "blue" },
  { kanji: "赤", translation: "red" },
  { kanji: "夜", translation: "evening" },
  { kanji: "朝", translation: "morning" },
  { kanji: "鳥", translation: "🦜 bird" },
  { kanji: "犬", translation: "🐶 dog" },
  { kanji: "猫", translation: "🐈 cat" },
  { kanji: "馬", translation: "🐴 horse" },
  { kanji: "大", translation: "big" },
];

for (let i = 0; i < characters.length; i++) {
  characters[i].color = Math.floor(i / 5) % 5;
}

export const ichiMods = {
  万: "一万",
  億: "一億",
  兆: "一兆",
};

export const issenException = "一千";

export const auxPre: Record<string, string> = {
  万: "一",
  億: "一",
  兆: "一",
};

export const auxPost: Record<string, string> = {
  大: "きい",
};

export const combinations: Character[] = [
  { kanji: "大きい", translation: "big" },
];
