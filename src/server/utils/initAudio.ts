import fs from "fs";
import * as googleTTS from "google-tts-api";
import { kanji2number } from "@geolonia/japanese-numeral";
import fetch from "node-fetch";

import { characters } from "../../client/_data/characters";

const highNums = ["万", "億", "兆"];

export default async function initAudio() {
  for (const c of characters) {
    const path = "public/audio/core/" + c.kanji + ".mp3";

    const k = !highNums.includes(c.kanji)
      ? kanji2number(c.kanji).toString()
      : c.kanji;

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
