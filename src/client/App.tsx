import { useState } from "react";
import { AudioHandler } from "./_utils/AudioHandler";
import { isValidNumber } from "./_utils/validators";

import PhraseViewer from "./_components/PhraseViewer";
import ButtonBoard from "./_components/ButtonBoard";
import KanjiGroup from "./_components/KanjiGroup";

const a = new AudioHandler();

export default function App() {
  const [chunks, setChunks] = useState<KanjiGroup[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInterrupting, setIsInterrupting] = useState(false);

  function handleTap(trigger: string) {
    if (isPlaying) {
      if (trigger === "stop") {
        a.cancelPlayback();
        setIsInterrupting(true);
      }

      return;
    }

    if (trigger === "play") {
      if (chunks.length > 0) {
        setIsPlaying(true);
        a.playQueue(chunks, (c: KanjiGroup[]) => {
          audioCallback(c);
        });
      }
      return;
    }

    a.playInstance(trigger);

    if (
      chunks.length > 0 &&
      isValidNumber(chunks[chunks.length - 1].asString() + trigger)
    ) {
      const updated = [...chunks];
      const newGroup = chunks[chunks.length - 1].asString() + trigger;
      a.loadAudio(newGroup);

      updated[updated.length - 1].push(trigger, "main");

      setChunks(updated);
    } else if (
      chunks.length > 0 &&
      isValidNumber(
        chunks[chunks.length - 1].asString() +
          trigger
            .replace("万", "一万")
            .replace("億", "一億")
            .replace("兆", "一兆"),
      )
    ) {
      const updated = [...chunks];

      const triggerMod = trigger
        .replace("万", "一万")
        .replace("億", "一億")
        .replace("兆", "一兆");
      const newGroup = chunks[chunks.length - 1].asString() + triggerMod;

      a.loadAudio(newGroup);

      if (["万", "億", "兆"].includes(trigger)) {
        updated[updated.length - 1].push("一", "aux");
      }
      updated[updated.length - 1].push(trigger, "main");

      setChunks(updated);
    } else {
      const kg = new KanjiGroup();
      if (["万", "億", "兆"].includes(trigger)) {
        kg.push("一", "aux");
      }
      kg.push(trigger, "main");
      setChunks([...chunks, kg]);
    }
  }

  function audioCallback(c: KanjiGroup[]) {
    setChunks(c);
    if (c.length === 0) {
      setIsPlaying(false);
      setIsInterrupting(false);
    }
  }

  return (
    <main className="flex h-screen w-screen flex-col">
      <PhraseViewer
        chunks={chunks}
        isPlaying={isPlaying}
        interrupting={isInterrupting}
      />
      <ButtonBoard handleTap={handleTap} isPlaying={isPlaying} />
    </main>
  );
}
