import bigKanji2number from "../../utils/bigKanji2number";
import { characters, combinations } from "../_data/characters";
import { isValidNumber } from "./validators";

const numFormatter = new Intl.NumberFormat("en-US");

const translations: Record<string, string> = {};

for (const c of [...characters, ...combinations]) {
  translations[c.kanji] = c.translation;
}

export default function getTranslation(s: string) {
  if (s in translations) return translations[s];
  if (isValidNumber(s)) return numFormatter.format(bigKanji2number(s));
  return "";
}
