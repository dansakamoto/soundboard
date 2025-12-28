import * as googleTTS from "google-tts-api";
import { kanji2number } from "@geolonia/japanese-numeral";
import fetch from "node-fetch";
import fs from "fs";

import type { Request, Response } from "express";

export default async function getAudio(req: Request<string>, res: Response) {
  const clientPath = "audio/downloaded/" + req.body.text + ".mp3";
  const serverPath = "public/" + clientPath;

  if (fs.existsSync(serverPath)) {
    res.send({ type: "url", url: clientPath });
    return;
  }

  const num = kanji2number(req.body.text);

  const audioData = await googleTTS.getAudioBase64(num.toString(), {
    lang: "ja",
    slow: false,
    host: "https://translate.google.com",
  });

  res.send({ type: "data", audioData: audioData });

  const url = googleTTS.getAudioUrl(num.toString(), {
    lang: "ja",
    slow: false,
    host: "https://translate.google.com",
  });

  const mp3 = await fetch(url);

  const fileStream = fs.createWriteStream(serverPath);
  if (mp3.body) {
    mp3.body.pipe(fileStream);
  }
}
