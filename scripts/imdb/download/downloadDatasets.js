/* eslint-env node */

import fs from "fs";
import path from "path";
import axios from "axios";

import { imdbConfig } from "../config/imdbConfig.js";

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));


async function getRemoteFileSize(url) {
  const response = await axios.head(url, {
    timeout: 30000,
  });

  return Number(response.headers["content-length"]);
}


async function downloadFile(file) {

  const filePath = path.join(
    imdbConfig.rawPath,
    file.name
  );

  const tempPath = `${filePath}.part`;

  fs.mkdirSync(imdbConfig.rawPath, {
    recursive: true,
  });


  let remoteSize;

  try {

    remoteSize = await getRemoteFileSize(file.url);

  } catch (error) {

    console.error(
      `❌ Cannot get file size for ${file.name}`
    );

    console.error(error.message);

    throw error;
  }


  let downloadedSize = 0;

  if (fs.existsSync(tempPath)) {

    downloadedSize = fs.statSync(tempPath).size;

  }


  if (downloadedSize >= remoteSize) {

    fs.renameSync(tempPath, filePath);

    console.log(`✅ ${file.name} already downloaded`);

    return;
  }


  console.log(`\nDownloading ${file.name}`);

  console.log(
    `Size: ${(remoteSize / 1024 / 1024).toFixed(2)} MB`
  );


  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    try {

      console.log(
        `Attempt ${attempt}/${MAX_RETRIES}`
      );


      const headers = {};

      if (downloadedSize > 0) {

        headers.Range = `bytes=${downloadedSize}-`;

        console.log(
          `Resuming from ${(downloadedSize / 1024 / 1024).toFixed(2)} MB`
        );

      }


      const response = await axios({

        method: "GET",

        url: file.url,

        responseType: "stream",

        headers,

        timeout: 0,

        maxContentLength: Infinity,

        maxBodyLength: Infinity,

        validateStatus: (status) =>
          status === 200 || status === 206,

      });


      // اگر Resume درخواست کردیم ولی سرور 200 داد،
      // یعنی Range را قبول نکرده است.
      if (
        downloadedSize > 0 &&
        response.status === 200
      ) {

        console.log(
          "⚠️ Server does not support resume. Restarting download."
        );

        downloadedSize = 0;

        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }

        continue;
      }


      const writer = fs.createWriteStream(
        tempPath,
        {
          flags:
            downloadedSize > 0
              ? "a"
              : "w",
        }
      );


      let currentSize = downloadedSize;

      let lastLoggedPercentage = -1;


      response.data.on("data", (chunk) => {

        currentSize += chunk.length;

        const percentage =
          (currentSize / remoteSize) * 100;

        const rounded =
          Math.floor(percentage);


        if (rounded !== lastLoggedPercentage) {

          lastLoggedPercentage = rounded;

          process.stdout.write(
            `\rDownloading: ${percentage.toFixed(2)}%`
          );

        }

      });


      response.data.on("error", (error) => {

        writer.destroy(error);

      });


      await new Promise((resolve, reject) => {

        writer.on("finish", resolve);

        writer.on("error", reject);

        response.data.pipe(writer);

      });


      downloadedSize = fs.statSync(
        tempPath
      ).size;


      if (downloadedSize !== remoteSize) {

        throw new Error(
          `Incomplete download: ${downloadedSize}/${remoteSize} bytes`
        );

      }


      fs.renameSync(
        tempPath,
        filePath
      );


      console.log(
        `\n✅ ${file.name} saved`
      );


      return;

    } catch (error) {

      console.log(
        `\n⚠️ Download interrupted: ${error.message}`
      );


      if (fs.existsSync(tempPath)) {

        downloadedSize =
          fs.statSync(tempPath).size;

      }


      if (attempt === MAX_RETRIES) {

        throw error;

      }


      console.log(
        `Retrying in ${RETRY_DELAY / 1000} seconds...`
      );


      await sleep(RETRY_DELAY);

    }

  }

}


async function downloadDatasets() {

  fs.mkdirSync(
    imdbConfig.rawPath,
    {
      recursive: true,
    }
  );


  for (const file of imdbConfig.datasets) {

    const filePath = path.join(
      imdbConfig.rawPath,
      file.name
    );


    if (fs.existsSync(filePath)) {

      console.log(
        `⏭️ ${file.name} already exists`
      );

      continue;

    }


    await downloadFile(file);

  }


  console.log(
    "\n🎬 All IMDb datasets downloaded"
  );

}


downloadDatasets().catch((error) => {

  console.error(
    "\n❌ Download failed:"
  );

  console.error(error.message);

  process.exit(1);

});