import * as googleTTS from "google-tts-api";
import { kanji2number } from "@geolonia/japanese-numeral";
import fs from "fs";

import type { Request, Response } from "express";

const apiExceptions = ["十一", "二兆"];
const fsLogging = false;

export default async function getAudio(req: Request<string>, res: Response) {
  const serverPath = "downloads/ja/" + req.body.text + ".b64";

  if (fs.existsSync(serverPath)) {
    if (fsLogging) console.log("File found, sending from local");
    fs.readFile(serverPath, "base64", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send({ type: "data", audioData: data });
    });

    return;
  }

  if (fsLogging) console.log("File not found, requesting from API");

  const t = req.body.text;
  const num = !apiExceptions.includes(t) ? kanji2number(t) : t;

  const audioData = await googleTTS.getAudioBase64(num.toString(), {
    lang: "ja",
    slow: false,
    host: "https://translate.google.com",
  });

  res.send({ type: "data", audioData: audioData });

  fs.writeFile(serverPath, audioData, "base64", (err) => {
    if (err) console.error(err);
  });
}
