import { characters } from "../_data/characters";
import type { TapProps } from "../App";

type TapHandler = (p: TapProps) => void;

export default function ButtonBoard({
  handleTap,
  isPlaying,
}: {
  handleTap: TapHandler;
  isPlaying: boolean;
}) {
  const buttons = characters.map((char) => (
    <button
      key={"kanjigrid-" + char.kanji}
      className={`p-3 h-1/5 theme-${char.color}`}
      onPointerDown={() =>
        handleTap({ trigger: char.kanji, color: char.color })
      }
      style={{ touchAction: "manipulation" }}
    >
      {char.kanji}
    </button>
  ));

  const playbackButton = isPlaying ? (
    <button
      className="text-5xl"
      onPointerDown={() => handleTap({ trigger: "stop" })}
      style={{ touchAction: "manipulation" }}
    >
      ◼
    </button>
  ) : (
    <button
      className="text-6xl"
      onPointerDown={() => handleTap({ trigger: "play" })}
      style={{ touchAction: "manipulation" }}
    >
      ▶
    </button>
  );

  return (
    <div className="flex flex-col h-1/2 m-10">
      <div className="text-6xl flex flex-col flex-wrap-reverse content-center h-full">
        {buttons}
      </div>
      {playbackButton}
    </div>
  );
}
