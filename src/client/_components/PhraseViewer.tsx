import { useEffect } from "react";

import getTranslation from "../_utils/getTranslation";

import type { KanjiGroup } from "../types";

export default function PhraseViewer({
  chunks,
  isPlaying,
  interrupting,
}: {
  chunks: KanjiGroup[];
  isPlaying: boolean;
  interrupting: boolean;
}) {
  useEffect(() => {
    if (isPlaying) {
      const v = document.getElementById("viewer");
      const c = v !== null ? v.firstElementChild : null;
      if (c !== null) c.scrollIntoView({ behavior: "smooth", inline: "start" });
    } else {
      const v = document.getElementById("viewer");
      const c = v !== null ? v.lastElementChild : null;
      if (c !== null) c.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  });

  const baseStyle = "p-2 m-1 text-6xl text-nowrap";

  const phraseList =
    chunks.length > 0 ? (
      chunks.map((s) => (
        <li
          key={s.key}
          className={
            isPlaying ? baseStyle + " first:text-fuchsia-700" : baseStyle
          }
        >
          {s.group}
        </li>
      ))
    ) : (
      <li className={baseStyle}>&nbsp;</li>
    );

  const translation =
    interrupting === true
      ? "stopping..."
      : chunks.length === 0
        ? ""
        : isPlaying
          ? getTranslation(chunks[0].group)
          : getTranslation(chunks[chunks.length - 1].group);

  return (
    <div className="h-1/6 mt-10 flex flex-col justify-evenlyr">
      <ul id="viewer" className="flex justify-center overflow-hidden">
        {phraseList}
      </ul>
      <div className="flex justify-center text-3xl">{translation}</div>
    </div>
  );
}
