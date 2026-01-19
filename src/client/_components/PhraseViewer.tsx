import { useEffect } from "react";
import getTranslation from "../_utils/getTranslation";
import KanjiGroup from "./KanjiGroup";
import "./PhraseViewer.css";

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
      v?.scroll({
        top: 100,
        left: -1000,
        behavior: "smooth",
      });
      const c = v ? v.firstElementChild : null;
      c?.scrollIntoView({
        behavior: "smooth",
        inline: "end",
        block: "end",
      });
    } else {
      const v = document.getElementById("viewer");
      const c = v ? v.lastElementChild : null;
      c?.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  });

  const baseStyle = "p-4 border-3 border-white text-6xl text-nowrap";

  const phraseList =
    chunks.length > 0 ? (
      chunks.map((c) => (
        <li
          key={c.key}
          className={isPlaying ? baseStyle + " playing" : baseStyle}
        >
          {c.segments.map((s) => (
            <span key={s.key} className={s.style}>
              {s.kanji}
            </span>
          ))}
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
          ? getTranslation(chunks[0].asString())
          : getTranslation(chunks[chunks.length - 1].asString());

  return (
    <div className="h-1/5 mt-10 flex flex-col justify-evenly">
      <div className="flex justify-center">
        <ul id="viewer" className="flex overflow-hidden">
          {phraseList}
        </ul>
      </div>
      <div id="translation" className="flex justify-center text-3xl">
        {translation}
      </div>
    </div>
  );
}
