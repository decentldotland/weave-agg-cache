import axios from "axios";

export async function getMirrorCover(blog_url) {
  try {
    const FIRST_SREACH_LENGTH = 65;
    const IMG_ID_LENGTH = 21;
    const res = await axios.get(blog_url);
    const start = res.data.indexOf(
      `<meta content="https://mirror-media.imgix.net/publication-images/`
    );
    const img_id = res.data.slice(
      start + FIRST_SREACH_LENGTH,
      start + FIRST_SREACH_LENGTH + IMG_ID_LENGTH
    );

    const extensionStart = res.data.slice(
      start + FIRST_SREACH_LENGTH + IMG_ID_LENGTH
    );
    const extensionFin = extensionStart.indexOf("?h");
    const extension = extensionStart.slice(1, extensionFin);

    const cover_url = `https://mirror-media.imgix.net/publication-images/${img_id}.${extension}`;
    return cover_url;
  } catch (error) {
    console.log("\nCANNOT GET MEDIA URL")
    return false;
  }
}
