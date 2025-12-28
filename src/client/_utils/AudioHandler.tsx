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

  async loadAudio(s: string) {
    if (!(s in this.loadAudio)) {
      const TTS = await fetch("/getAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: s }),
      });

      const res = await TTS.json();
      //console.log(TTSResult.url);

      if (res.type === "data") {
        const arrayBuffer = base64ToArrayBuffer(res.audioData);
        const audioBuffer = await this.audioContext.decodeAudioData(
          arrayBuffer
        );
        this.loadedAudio[s] = audioBuffer;
      } else {
        const data = await fetch(res.url);
        const arrayBuffer = await data.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(
          arrayBuffer
        );
        this.loadedAudio[s] = audioBuffer;
      }
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

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
