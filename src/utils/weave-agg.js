import { getWeaveAggregator } from "weave-aggregator";
import { decodeTransaction, getTxStatus, getBundledData } from "./arweave.js";

export async function getArdrive() {
  try {
    const feed = [];
    const res = await getWeaveAggregator("ardrive");
    for (const tx of res) {
      try {
        const txData = await getBundledData(tx.metadata);
        const driveObj = JSON.parse(JSON.stringify(txData));
        tx.name = driveObj.name;

        feed.push(tx);
      } catch (error) {
        continue;
      }
    }
    console.log(feed);
    return feed;
  } catch (error) {
    console.log(error);
  }
}

export async function getMirrorXyz() {
  try {
    const feed = [];
    const res = await getWeaveAggregator("mirror-xyz");
    for (const tx of res) {
      try {
        const txData = await decodeTransaction(tx.id);
        const blogObj = JSON.parse(txData);

        const blog = {
          bid: tx.id,
          title: blogObj.content.title,
          timestamp: blogObj.content.timestamp,
          poster: blogObj.authorship.contributor,
        };

        feed.push(blog);
      } catch (error) {
        continue;
      }
    }
    console.log(feed);
    return feed;
  } catch (error) {
    console.log(error);
  }
}

export async function getArtByCity() {
  try {
    const feed = [];
    const res = await getWeaveAggregator("art-by-city");

    for (const tx of res) {
      try {
        const txData = await getBundledData(tx.id);
        const artObj = JSON.parse(JSON.stringify(txData));

        const art = {
          aid: tx.id,
          title: artObj?.title,
          desc: artObj?.description,
          slug: artObj?.slug,
          creator: artObj?.creator,
          creationDate: artObj?.published,
          image: `https://arweave.net/${artObj?.images?.[0]?.["preview"]}`,
        };
        feed.push(art);
      } catch (error) {
        continue;
      }
    }
    console.log(feed);
    return feed;
  } catch (error) {
    console.log(error);
  }
}
