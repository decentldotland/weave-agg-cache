import { getWeaveAggregator } from "weave-aggregator";
import { getMirrorCover } from "./mirror-helpers.js";
import { getPermatweetBody } from "./metaweave-helpers.js";
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

        const mirror_url = `https://mirror.xyz/${
          blogObj.authorship.contributor
        }/${
          tx.tags.find((tag) => tag.name === "Original-Content-Digest")?.value
        }`;
        const cover_img = await getMirrorCover(mirror_url);

        const blog = {
          bid: tx.id,
          title: blogObj.content.title,
          timestamp: blogObj.content.timestamp,
          poster: blogObj.authorship.contributor,
          mirror_url: mirror_url,
          cover_img: cover_img,
        };
        // `cover_img` with length over than 77 means an error
        if (blog.title !== "mirror" && !!cover_img && cover_img.length < 77) {
          console.log("\n\n\n");
          console.log(blog);
          console.log("\n\n\n");
          feed.push(blog);
        }
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
          timestamp: tx?.timestamp,
          image: `https://arweave.net/${artObj?.images?.[0]?.["preview"]}`,
        };
        feed.push(art);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    console.log(feed);
    return feed;
  } catch (error) {
    console.log(error);
  }
}

export async function getMetaweave() {
  try {
    const feed = [];
    const res = await getWeaveAggregator("metaweave-permatweets");
    console.log(res);

    for (const tx of res) {
      try {
        const tweetUrl = await getPermatweetBody(tx.id);

        const tweetBody = {
          tid: tx.id,
          poster: tx.owner,
          tweetUrl: tweetUrl,
        };

        feed.push(tweetBody);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return feed;
  } catch (error) {
    console.log(error);
  }
}
