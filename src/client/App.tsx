import { useState } from "react";
import { AudioHandler } from "./_utils/AudioHandler";
import { isValidNumber } from "./_utils/validators";
import { auxPost, auxPre, combinations, addIchiMod } from "./_data/characters";
import PhraseViewer from "./_components/PhraseViewer";
import ButtonBoard from "./_components/ButtonBoard";
import KanjiGroup, { type KanjiStyle } from "./_components/KanjiGroup";

const a = new AudioHandler();

export interface TapProps {
  trigger: string;
  color?: number;
}

export default function App() {
  const [chunks, setChunks] = useState<KanjiGroup[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInterrupting, setIsInterrupting] = useState(false);

  function handleTap(p: TapProps) {
    const trigger = p.trigger;
    const color = p.color;

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

    if (chunks.length > 0) {
      const latest = chunks[chunks.length - 1].asString();

      if (isValidNumber(latest + trigger)) {
        updateLastChunk(trigger, false, color);
      } else if (isValidNumber(latest + addIchiMod(trigger))) {
        updateLastChunk(trigger, true, color);
      } else if (trigger === "円" && isValidNumber(latest)) {
        updateLastChunk(trigger, false, color);
      } else if (combinations.find(({ kanji }) => kanji === latest + trigger)) {
        updateLastChunk(trigger, false, color);
      } else {
        startNewChunk(trigger, color);
      }
    } else {
      startNewChunk(trigger, color);
    }
  }

  function startNewChunk(trigger: string, color?: number) {
    const kg = new KanjiGroup();

    if (trigger in auxPre) {
      kg.push(auxPre[trigger], "aux");
    }

    const style = color !== null ? `theme-${color}` : "default";

    kg.push(trigger, style as KanjiStyle);
    if (trigger in auxPost) {
      kg.push(auxPost[trigger], "aux");
    }

    a.loadAudio(kg.asString());

    setChunks([...chunks, kg]);
  }

  function updateLastChunk(trigger: string, checkAux: boolean, color?: number) {
    const updatedChunks = [...chunks];
    const lastChunk = updatedChunks[updatedChunks.length - 1];

    const style = color !== null ? `theme-${color}` : "default";

    if (checkAux && trigger in auxPre) {
      lastChunk.push(auxPre[trigger], "aux");
    }
    lastChunk.push(trigger, style as KanjiStyle);
    if (checkAux && trigger in auxPost) {
      lastChunk.push(auxPost[trigger], "aux");
    }

    a.loadAudio(lastChunk.asString());

    updatedChunks[updatedChunks.length - 1] = lastChunk;
    setChunks(updatedChunks);
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
