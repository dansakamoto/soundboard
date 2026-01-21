/* 
  Disabled / Archived as a startup function
  Potentially reconfigurable as an occasionally
  manually run utility
*/

import fs from "fs";
import * as googleTTS from "google-tts-api";
import { kanji2number } from "@geolonia/japanese-numeral";
import fetch from "node-fetch";

import { characters, ichiMods, issenException } from "../../_data/characters";

const highNums = Object.keys(ichiMods).concat([issenException]);

const list = Object.values(ichiMods).concat([issenException]);
for (const c of characters) {
  list.push(c.kanji);
}

export default async function initAudio() {
  for (const c of list) {
    const path = "public/audio/core/" + c + ".mp3";

    const k = !highNums.includes(c) ? kanji2number(c).toString() : c;

    if (!fs.existsSync(path)) {
      const url = googleTTS.getAudioUrl(k, {
        lang: "ja",
        slow: false,
        host: "https://translate.google.com",
      });

      const res = await fetch(url);

      const fileStream = fs.createWriteStream(path);
      new Promise((resolve, reject) => {
        if (res.body) {
          res.body.pipe(fileStream);
          res.body.on("end", () => resolve("it worked"));
          fileStream.on("error", reject);
        }
      });
    }
  }
}
