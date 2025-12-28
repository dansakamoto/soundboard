import { useState } from "react";
import { AudioHandler } from "./_utils/AudioHandler";
import { isValidNumber } from "./_utils/validators";

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
      return;
    }

    a.playInstance(trigger);

    if (
      chunks.length > 0 &&
      isValidNumber(chunks[chunks.length - 1].group + trigger)
    ) {
      const updated = [...chunks];
      const newGroup = chunks[chunks.length - 1].group + trigger;
      a.loadAudio(newGroup);

      updated[updated.length - 1].group = newGroup;

      setChunks(updated);
    } else {
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
