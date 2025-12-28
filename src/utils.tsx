import { characters } from "./_data/characters";

import type { KanjiGroup } from "./types";

export class AudioHandler {
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

export function isValidGroup(s: string) {
  return isValidNumber(s);
}

function isValidNumber(s: string) {
  const validSteps = ["兆", "億", "万"];
  let test = "";

  if (s === "") return false;

  for (const c of s) {
    if (validSteps.includes(c)) {
      if (test === "" || !isValidSmallChunk(test)) return false;

      test = "";

      while (validSteps[0] !== c) validSteps.shift();
      validSteps.shift();
    } else {
      test += c;
    }
  }

  if (test === "") return true;

  return isValidSmallChunk(test);
}

function isValidSmallChunk(s: string) {
  let singleValid = true;
  const validDigits = ["二", "三", "四", "五", "六", "七", "八", "九"];
  const validSteps = ["千", "百", "十"];

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (c === "一") {
      if (i === s.length - 1) return true;
      return false;
    }

    if (validDigits.includes(c)) {
      if (!singleValid) return false;

      singleValid = false;
      continue;
    }

    if (validSteps.includes(c)) {
      singleValid = true;
      while (validSteps[0] !== c) validSteps.shift();
      validSteps.shift();
      continue;
    }

    return false;
  }

  return true;
}
