import {
  getArdrive,
  getMirrorXyz,
  getArtByCity,
  getMetaweave,
} from "./weave-agg.js";
import NodeCache from "node-cache";
import base64url from "base64url";

const cacheObj = new NodeCache();

export async function cache() {
  try {
    const data = await fetchProtocols();
    cacheObj.set("protocols", base64url(JSON.stringify(data)));
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getProtocols() {
  try {
    if (!cacheObj.has("protocols")) {
      // "{}" in base64url
      return "e30";
    }

    return cacheObj.get("protocols");
  } catch (error) {
    console.log(error);
  }
}

async function fetchProtocols() {
  try {
    const mirror = await getMirrorXyz();
    const ardrive = await getArdrive();
    const abc = await getArtByCity();
    const permatweets = await getMetaweave();

    return {
      mirror,
      ardrive,
      abc,
      permatweets,
    };
  } catch (error) {
    console.log(error);
  }
}
