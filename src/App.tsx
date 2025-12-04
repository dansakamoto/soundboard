import { useEffect } from "react";

type Character = { kanji: string; file: string; audio?: AudioBuffer };
const characters: Character[] = [
  { kanji: "一", file: "audio/1.mp3" },
  { kanji: "二", file: "audio/2.mp3" },
  { kanji: "三", file: "audio/3.mp3" },
  { kanji: "四", file: "audio/4.mp3" },
  { kanji: "五", file: "audio/5.mp3" },
  { kanji: "六", file: "audio/6.mp3" },
  { kanji: "七", file: "audio/7.mp3" },
  { kanji: "八", file: "audio/8.mp3" },
  { kanji: "九", file: "audio/9.mp3" },
  { kanji: "十", file: "audio/10.mp3" },
  { kanji: "百", file: "audio/100.mp3" },
  { kanji: "千", file: "audio/1000.mp3" },
  { kanji: "万", file: "audio/10000.mp3" },
  { kanji: "億", file: "audio/100000000.mp3" },
  {
    kanji: "兆",
    file: "audio/1000000000000.mp3",
  },
];

let audioCtx: AudioContext;

function App() {
  useEffect(() => {
    audioCtx = new AudioContext();

    for (const char of characters) {
      fetch(char.file).then((res) => {
        res.arrayBuffer().then((res) => {
          audioCtx.decodeAudioData(res).then((res) => {
            char.audio = res;
          });
        });
      });
    }
  });

  const board = characters.map((char) => (
    <button
      key={char.kanji}
      className="p-1"
      onPointerDown={() => {
        if (char.audio) {
          const source = audioCtx.createBufferSource();
          source.buffer = char.audio;
          source.connect(audioCtx.destination);
          source.start();
        }
      }}
      style={{ touchAction: "manipulation" }}
    >
      {char.kanji}
    </button>
  ));

  return <main className="text-6xl">{board}</main>;
}

export default App;
