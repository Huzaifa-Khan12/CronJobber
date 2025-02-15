//Housekeeping job, delete data that are older than 180 days.

import cron from "node-cron";
import * as fs from "node:fs";
import path from "path";

import { readFile } from "fs/promises";

const archives = JSON.parse(
  await readFile(new URL("./data/archive.json", import.meta.url))
);

const houseKeepingTask = () => {
  console.log("Running house keeping task at: ", new Date());
  try {
    archives.map((item, index) => {
      const presentDate = new Date().getTime();
      const recordDate = new Date(item.date).getTime();
      const diff = Math.floor(
        (presentDate - recordDate) / (1000 * 60 * 60 * 24)
      );
      //check if the difference is greater than 180
      console.log("The number of days (difference): ", diff);

      if (diff > 180) {
        archives.splice(index, 1);
        console.log("Splice Ran");
      }
      //   console.log(archives);
    });
  } catch (error) {
    console.log("error: ", error);
  }
  console.log("House Keeping Task has ended!");
};

cron.schedule("*/5 * * * * *", houseKeepingTask);
