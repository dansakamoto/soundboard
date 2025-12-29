import getTranslation from "../_utils/getTranslation";

import type { KanjiGroup } from "../types";

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
      <li className="p-2 m-1 text-6xl">&nbsp;</li>
    );

  const translation =
    chunks.length === 0
      ? ""
      : isPlaying
      ? getTranslation(chunks[0].group)
      : getTranslation(chunks[chunks.length - 1].group);

  return (
    <div className="h-1/6 mt-10 flex flex-col justify-evenlyr">
      <ul id="viewer" className="flex justify-center">
        {phraseList}
      </ul>
      <div className="flex justify-center text-3xl">{translation}</div>
    </div>
  );
}
