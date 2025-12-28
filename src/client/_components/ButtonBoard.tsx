import { characters } from "../_data/characters";

type TapHandler = (s: string) => void;

export default function ButtonBoard({ handleTap }: { handleTap: TapHandler }) {
  const buttons = characters.map((char) => (
    <button
      key={"kanjigrid-" + char.kanji}
      className="p-1"
      onPointerDown={() => handleTap(char.kanji)}
      style={{ touchAction: "manipulation" }}
    >
      {char.kanji}
    </button>
  ));

  return (
    <div className="flex flex-col">
      <div className="text-6xl flex justify-center">{buttons}</div>
      <button
        className="text-3xl"
        onPointerDown={() => handleTap("play")}
        style={{ touchAction: "manipulation" }}
      >
        Play
      </button>
    </div>
  );
}
