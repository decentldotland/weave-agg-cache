import Arweave from "arweave";
import axios from "axios";

export const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60000,
  logging: false,
});

export async function decodeTransaction(txid) {
  try {
    const data = await arweave.transactions.getData(txid, {
      decode: true,
      string: true,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getTxStatus(txid) {
  try {
    const res = await arweave.transactions.getStatus(txid);
    const status = res?.status?.toString();
    res.decodable = status.startsWith("2");

    return res;
  } catch (error) {
    console.log(error);
  }
}

async function reseed(txId) {
  try {
    const {data} = await arweave.api.get(`/${txId}`, {responseType: "arraybuffer"});
    console.log(`${data.length} bytes found in arweave.net cache`);

    const uploader = await arweave.transactions.getUploader(txId, data);
    while (!uploader.isComplete) {
      await uploader.uploadChunk()
      console.log(`Status: ${uploader.lastResponseStatus}`)
      console.log(`Chunk uploaded (${uploader.uploadedChunks}/${uploader.totalChunks})`)
    }
    console.log("Data has been reseeded")
  } catch (err) {
    console.log('Reseeding failed')
    console.log(err)
  }
}

export async function getBundledData(txid) {
  try {
    const res = (await axios.get(`https://arweave.net/${txid}`))?.data;
    return res;
  } catch(error) {
    console.log(error)
  }
}

export async function sleep(blocks) {
      // 1 Arweave network block time is ~2min
      return new Promise(resolve => setTimeout(resolve, blocks * 120 * 1000));
   }
