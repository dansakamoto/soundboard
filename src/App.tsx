import { useState } from "react";
import { characters } from "./data/characters";
import AudioHandler from "./utils/AudioHandler";

import type { Character, KanjiGroup } from "./types";

// const numFormatter = new Intl.NumberFormat("en-US");

const a = new AudioHandler();
let keyItr = 0;

export default function App() {
  const [chunks, setChunks] = useState<KanjiGroup[]>([]);
  const [translation, setTranslation] = useState("");

  function handleCharTap(char: Character) {
    if (a.currentlyPlaying) return;
    a.playInstance(char.kanji);

    setChunks([
      ...chunks,
      {
        key: "phrase-" + keyItr++,
        kanjiGroup: char.kanji,
        translation: char.translation,
      },
    ]);
    setTranslation(char.translation);
  }

  function handlePlayTap() {
    if (!a.currentlyPlaying)
      a.playQueue(
        chunks,
        (a: KanjiGroup[]) => {
          setChunks(a);
        },
        (a: string) => {
          setTranslation(a);
        }
      );
  }

  const buttons = characters.map((char) => (
    <button
      key={char.kanji}
      className="p-1"
      onPointerDown={() => handleCharTap(char)}
      style={{ touchAction: "manipulation" }}
    >
      {char.kanji}
    </button>
  ));

  const phraseList =
    chunks.length > 0 ? (
      chunks.map((s) => (
        <li
          key={s.key}
          className={
            "p-2 m-1 text-6xl " +
            (s.key === a.currentlyPlaying ? "text-amber-300" : "")
          }
        >
          {s.kanjiGroup}
        </li>
      ))
    ) : (
      <div className="p-2 m-1 text-3xl">&nbsp;</div>
    );

  return (
    <main className="flex h-screen w-screen flex-col">
      <div className="h-1/5 flex flex-col justify-evenly">
        <ul id="viewer" className="flex">
          {phraseList}
        </ul>
        <div className="flex justify-center text-3xl">{translation}</div>
      </div>
      <div className="flex flex-col">
        <div className="text-6xl flex justify-center">{buttons}</div>
        <button
          className="text-3xl"
          onPointerDown={handlePlayTap}
          style={{ touchAction: "manipulation" }}
        >
          Play
        </button>
      </div>
    </main>
  );
}
