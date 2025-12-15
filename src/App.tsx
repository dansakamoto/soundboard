import { useState } from "react";

type Character = { kanji: string; num: number; file: string };
const characters: Character[] = [
  { kanji: "一", num: 1, file: "audio/1.mp3" },
  { kanji: "二", num: 2, file: "audio/2.mp3" },
  { kanji: "三", num: 3, file: "audio/3.mp3" },
  { kanji: "四", num: 4, file: "audio/4.mp3" },
  { kanji: "五", num: 5, file: "audio/5.mp3" },
  { kanji: "六", num: 6, file: "audio/6.mp3" },
  { kanji: "七", num: 7, file: "audio/7.mp3" },
  { kanji: "八", num: 8, file: "audio/8.mp3" },
  { kanji: "九", num: 9, file: "audio/9.mp3" },
  { kanji: "十", num: 10, file: "audio/10.mp3" },
  { kanji: "百", num: 100, file: "audio/100.mp3" },
  { kanji: "千", num: 1000, file: "audio/1000.mp3" },
  { kanji: "万", num: 10000, file: "audio/10000.mp3" },
  { kanji: "億", num: 100000000, file: "audio/100000000.mp3" },
  {
    kanji: "兆",
    num: 1000000000000,
    file: "audio/1000000000000.mp3",
  },
];

const phraseAudio: Record<string, AudioBuffer> = {};

let keyItr = 0;

const audioCtx = new AudioContext();
setupAudio();

type Phrase = { key: number; word: string; translation: string };

let playback = false;

async function setupAudio() {
  for (const char of characters) {
    const data = await fetch(char.file);
    const arrayBuffer = await data.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    phraseAudio[char.kanji] = audioBuffer;
  }
}

function App() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [translation, setTranslation] = useState("");
  const [currentlyPlaying, setCurrentlyPlayting] = useState(-1);

  const buttons = characters.map((char) => (
    <button
      key={char.kanji}
      className="p-1"
      onPointerDown={() => {
        if (playback) return;

        setPhrases([
          ...phrases,
          { key: keyItr, word: char.kanji, translation: char.num.toString() },
        ]);
        setTranslation(char.num.toString());
        keyItr++;

        if (phraseAudio[char.kanji]) {
          const source = audioCtx.createBufferSource();
          source.buffer = phraseAudio[char.kanji];
          source.connect(audioCtx.destination);
          source.start();
        }
      }}
      style={{ touchAction: "manipulation" }}
    >
      {char.kanji}
    </button>
  ));

  const phraseList =
    phrases.length > 0 ? (
      phrases.map((s) => (
        <li
          key={s.key}
          className={
            "p-2 m-1 text-6xl " +
            (s.key === currentlyPlaying ? "text-amber-300" : "")
          }
        >
          {s.word}
        </li>
      ))
    ) : (
      <div className="p-2 m-1 text-3xl">&nbsp;</div>
    );

  function beginPlayback() {
    if (!playback) {
      playback = true;
      playPhrases(phrases);
    }
  }

  function endPlayback() {
    playback = false;
    setPhrases([]);
    setTranslation("");
  }

  function playPhrases(queue: Phrase[]) {
    if (queue.length > 0 && phraseAudio[queue[0].word]) {
      setCurrentlyPlayting(queue[0].key);
      setTranslation(queue[0].translation);
      const source = audioCtx.createBufferSource();
      source.buffer = phraseAudio[queue[0].word];
      source.connect(audioCtx.destination);
      source.onended = () => {
        setPhrases(queue.slice(1));
        playPhrases(queue.slice(1));
      };
      source.start();
    } else {
      endPlayback();
    }
  }

  return (
    <main className="flex h-screen w-screen flex-col">
      <div className="h-1/5 flex flex-col justify-evenly">
        <ul id="viewer" className="flex justify-end">
          {phraseList}
        </ul>
        <div className="flex justify-center text-3xl">{translation}</div>
      </div>
      <div className="flex flex-col">
        <div className="text-6xl flex justify-center">{buttons}</div>
        <button
          className="text-3xl"
          onPointerDown={beginPlayback}
          style={{ touchAction: "manipulation" }}
        >
          Play
        </button>
      </div>
    </main>
  );
}

export default App;
