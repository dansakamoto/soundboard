import { characters, ichiMods, issenException } from "../_data/characters";

import KanjiGroup from "../_components/KanjiGroup";

const bufferAllowance = 1000;
export class AudioHandler {
  constructor() {
    this.setupAudio();
  }

  loadedAudio: Record<string, AudioBuffer> = {};
  audioContext = new AudioContext();
  currentlyPlaying = "";
  waitRemaining = bufferAllowance;
  interrupt = false;

  async setupAudio() {
    const toLoad = [...Object.values(ichiMods), issenException];
    for (const c of characters) toLoad.push(c.kanji);

    for (const x of toLoad) {
      const data = await fetch("audio/ja/" + x + ".mp3");
      const arrayBuffer = await data.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.loadedAudio[x] = audioBuffer;
    }
  }

  async loadAudio(s: string) {
    if (!(s in this.loadedAudio)) {
      const TTS = await fetch("/getAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: s }),
      });

      const res = await TTS.json();

      if (res.type === "data") {
        const arrayBuffer = base64ToArrayBuffer(res.audioData);
        const audioBuffer =
          await this.audioContext.decodeAudioData(arrayBuffer);
        this.loadedAudio[s] = audioBuffer;
      } else {
        const data = await fetch(res.url);
        const arrayBuffer = await data.arrayBuffer();
        const audioBuffer =
          await this.audioContext.decodeAudioData(arrayBuffer);
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
    if (this.interrupt === true) {
      this.currentlyPlaying = "";
      callback([]);
      this.interrupt = false;
      return;
    }

    if (queue.length === 0) {
      this.currentlyPlaying = "";
    } else if (this.loadedAudio[queue[0].asString()]) {
      this.currentlyPlaying = queue[0].key;
      const source = this.audioContext.createBufferSource();
      source.buffer = this.loadedAudio[queue[0].asString()];
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
      for (const c of queue[0].asString()) {
        const k = new KanjiGroup();
        k.push(c, "default");
        explodedGroup.push(k);
      }
      const newQueue = [...explodedGroup, ...queue.slice(1)];
      callback(newQueue);
      this.playQueue(newQueue, callback);
    }
  }

  cancelPlayback() {
    this.interrupt = true;
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
