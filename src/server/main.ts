import express from "express";
import ViteExpress from "vite-express";
import getAudio from "./routes/getAudio";
import initAudio from "./utils/initAudio";

initAudio();

const port = 3000;
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
ViteExpress.listen(app, port, () => {
  console.log(`Soundboard running at port ${port}`);
});

app.post("/getAudio", getAudio);
