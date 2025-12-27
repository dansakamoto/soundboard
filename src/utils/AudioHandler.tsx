import { characters } from "../data/characters";

import type { KanjiGroup } from "../types/KanjiGroup";

export default class AudioHandler {
  constructor() {
    this.setupAudio();
  }

  loadedAudio: Record<string, AudioBuffer> = {};
  audioContext = new AudioContext();
  currentlyPlaying = "";

  async setupAudio() {
    for (const char of characters) {
      const data = await fetch(char.file);
      const arrayBuffer = await data.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.loadedAudio[char.kanji] = audioBuffer;
    }
  }
  playInstance(kanji: string) {
    if (this.loadedAudio[kanji]) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.loadedAudio[kanji];
      source.connect(this.audioContext.destination);
      source.start();
    }
  }

  playQueue(
    queue: KanjiGroup[],
    setChunks: (kg: KanjiGroup[]) => void,
    setTranslation: (s: string) => void
  ) {
    if (queue.length > 0 && this.loadedAudio[queue[0].kanjiGroup]) {
      this.currentlyPlaying = queue[0].key;
      setTranslation(queue[0].translation);
      const source = this.audioContext.createBufferSource();
      source.buffer = this.loadedAudio[queue[0].kanjiGroup];
      source.connect(this.audioContext.destination);
      source.onended = () => {
        setChunks(queue.slice(1));
        this.playQueue(queue.slice(1), setChunks, setTranslation);
      };
      source.start();
    } else {
      this.currentlyPlaying = "";
      setTranslation("");
    }
  }
}
