import { characters } from "../_data/characters";

import type { KanjiGroup } from "../types";

const numFormatter = new Intl.NumberFormat("en-US");
const translations: Record<string, string> = {};

for (const c of characters) {
  if (typeof c.translation === "number")
    translations[c.kanji] = numFormatter.format(c.translation);
  else translations[c.kanji] = c.translation;
}

export default function PhraseViewer({
  chunks,
  isPlaying,
}: {
  chunks: KanjiGroup[];
  isPlaying: boolean;
}) {
  const phraseList =
    chunks.length > 0 ? (
      chunks.map((s) => (
        <li
          key={s.key}
          className={
            isPlaying
              ? "p-2 m-1 text-6xl first:text-fuchsia-700"
              : "p-2 m-1 text-6xl"
          }
        >
          {s.group}
        </li>
      ))
    ) : (
      <div className="p-2 m-1 text-3xl">&nbsp;</div>
    );

  let translation = "";
  if (chunks.length > 0) {
    if (isPlaying) translation = translations[chunks[0].group];
    else translation = translations[chunks[chunks.length - 1].group];
  }

  return (
    <div className="h-1/5 flex flex-col justify-evenly">
      <ul id="viewer" className="flex">
        {phraseList}
      </ul>
      <div className="flex justify-center text-3xl">{translation}</div>
    </div>
  );
}
