import { decodeTransaction } from "./arweave.js";

export async function getPermatweetBody(txid) {
  try {
    const txData = JSON.parse(await decodeTransaction(txid));

    const START = `https://`.length;
    const tweet_url_start = txData?._data?.text.indexOf(`https://`);
    const tweet_url_end = txData?._data?.text.indexOf(`\n\n`);

    const tweet_url = txData?._data?.text.slice(tweet_url_start, tweet_url_end);

    return tweet_url;
  } catch (error) {
    console.log(error);
  }
}
