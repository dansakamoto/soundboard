import { useState } from "react";
import AudioHandler from "./_utils/AudioHandler";

import PhraseViewer from "./_components/PhraseViewer";
import ButtonBoard from "./_components/ButtonBoard";

import type { KanjiGroup } from "./types";

const a = new AudioHandler();

let keyItr = 0;

export default function App() {
  const [chunks, setChunks] = useState<KanjiGroup[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  function handleTap(trigger: string) {
    if (isPlaying) return;

    if (trigger === "play") {
      setIsPlaying(true);
      a.playQueue(chunks, (c: KanjiGroup[]) => {
        audioCallback(c);
      });
    } else {
      a.playInstance(trigger);
      setChunks([
        ...chunks,
        {
          key: "grouping-" + keyItr++,
          group: trigger,
        },
      ]);
    }
  }

  function audioCallback(c: KanjiGroup[]) {
    setChunks(c);
    if (c.length === 0) setIsPlaying(false);
  }

  return (
    <main className="flex h-screen w-screen flex-col">
      <PhraseViewer chunks={chunks} isPlaying={isPlaying} />
      <ButtonBoard handleTap={handleTap} />
    </main>
  );
}
