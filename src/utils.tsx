import { characters } from "./_data/characters";

import type { KanjiGroup } from "./types";

export default class AudioHandler {
  constructor() {
    this.setupAudio();
  }

  loadedAudio: Record<string, AudioBuffer> = {};
  audioContext = new AudioContext();
  currentlyPlaying = "";

  async setupAudio() {
    for (const char of characters) {
      const data = await fetch("audio/core/" + char.kanji + ".mp3");
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

  playQueue(queue: KanjiGroup[], callback: (kg: KanjiGroup[]) => void) {
    if (queue.length > 0 && this.loadedAudio[queue[0].group]) {
      this.currentlyPlaying = queue[0].key;
      const source = this.audioContext.createBufferSource();
      source.buffer = this.loadedAudio[queue[0].group];
      source.connect(this.audioContext.destination);
      source.onended = () => {
        callback(queue.slice(1));
        this.playQueue(queue.slice(1), callback);
      };
      source.start();
    } else {
      this.currentlyPlaying = "";
    }
  }
}
