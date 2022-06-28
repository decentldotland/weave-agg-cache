import { cache, getProtocols } from "./utils/cache.js";
import { sleep } from "./utils/arweave.js";
import base64url from "base64url";
import express from "express";
import cors from "cors";

const app = express();

const port = process.env.PORT || 2023;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/protocols", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const encodedState = await getProtocols();
  const jsonRes = JSON.parse(base64url.decode(encodedState));
  res.send(jsonRes);
});

app.listen(port, async () => {
  while (true) {
    await cache();
    await sleep(15);
    console.log(`listening at PORT: ${port}`);
  }
});
