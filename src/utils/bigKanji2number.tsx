import { kanji2number } from "@geolonia/japanese-numeral";

export default function bigKanji2number(k: string) {
  const i = kanji2number(k);

  let kSlice;
  if (k.includes("万")) {
    kSlice = kanji2number(k.slice(k.indexOf("万") + 1));
  } else if (k.includes("億")) {
    kSlice = kanji2number(k.slice(k.indexOf("億") + 1));
  } else if (k.includes("兆")) {
    kSlice = kanji2number(k.slice(k.indexOf("兆") + 1));
  } else return i;

  kSlice = BigInt(kSlice);
  const n = BigInt(i);

  const nSlice = n % BigInt(10000);

  if (kSlice === nSlice) return n;
  else if (nSlice === BigInt(0)) {
    return n - BigInt(1);
  } else return n - nSlice + kSlice;
}
