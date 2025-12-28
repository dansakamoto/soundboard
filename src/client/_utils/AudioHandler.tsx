import { characters } from "../_data/characters";

import type { KanjiGroup } from "../types";

let keyItr = 0;
const bufferAllowance = 1000;
export class AudioHandler {
  constructor() {
    this.setupAudio();
  }

  loadedAudio: Record<string, AudioBuffer> = {};
  audioContext = new AudioContext();
  currentlyPlaying = "";
  waitRemaining = bufferAllowance;

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
    if (queue.length === 0) {
      this.currentlyPlaying = "";
    } else if (this.loadedAudio[queue[0].group]) {
      this.currentlyPlaying = queue[0].key;
      const source = this.audioContext.createBufferSource();
      source.buffer = this.loadedAudio[queue[0].group];
      source.connect(this.audioContext.destination);
      source.onended = () => {
        callback(queue.slice(1));
        this.playQueue(queue.slice(1), callback);
      };
      source.start();
    } else if (this.waitRemaining > 0) {
      this.waitRemaining -= 200;
      setTimeout(() => {
        this.playQueue(queue, callback);
      }, 200);
    } else {
      this.waitRemaining = bufferAllowance;
      const explodedGroup = [];
      for (const c of queue[0].group) {
        explodedGroup.push({
          key: "exploded-" + keyItr++,
          group: c,
        });
      }
      const newQueue = [...explodedGroup, ...queue.slice(1)];
      callback(newQueue);
      this.playQueue(newQueue, callback);
    }
  }
}
