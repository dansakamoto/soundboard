import { characters, ichiMods, issenException } from "../../_data/characters";

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
      this.resetLoadingTimeout();
    } else if (this.audioReady(queue[0])) {
      const source = this.playSound(queue[0]);
      source.onended = () => {
        callback(queue.slice(1));
        this.playQueue(queue.slice(1), callback);
      };
      source.start();
      this.resetLoadingTimeout();
    } else {
      if (this.loadTimerRunning()) {
        setTimeout(() => {
          this.playQueue(queue, callback);
        }, 200);
      } else {
        const explodedGroup = [];
        for (const c of queue[0].asString()) {
          if (c in this.loadedAudio) {
            const k = new KanjiGroup();
            k.push(c, "default");
            explodedGroup.push(k);
          }
        }
        const newQueue = [...explodedGroup, ...queue.slice(1)];
        callback(newQueue);
        this.playQueue(newQueue, callback);
      }
    }
  }

  cancelPlayback() {
    this.interrupt = true;
  }

  resetLoadingTimeout() {
    this.waitRemaining = bufferAllowance;
  }

  loadTimerRunning() {
    if (this.waitRemaining > 0) {
      this.waitRemaining -= 200;
      return true;
    } else {
      this.resetLoadingTimeout();
      return false;
    }
  }

  audioReady(kg: KanjiGroup) {
    return kg.asString() in this.loadedAudio;
  }

  playSound(kg: KanjiGroup) {
    this.currentlyPlaying = kg.key;
    const source = this.audioContext.createBufferSource();
    source.buffer = this.loadedAudio[kg.asString()];
    source.connect(this.audioContext.destination);
    return source;
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
